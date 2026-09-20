import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { AnalyzingView } from "./AnalyzingView";
import { streamJobEvents } from "@/shared/api/stream";
import { getJob } from "../api";
import type { JobEvent } from "@/shared/api/stream";

vi.mock("@/shared/api/stream", () => ({ streamJobEvents: vi.fn() }));
vi.mock("../api", () => ({ getJob: vi.fn() }));

const streamMock = vi.mocked(streamJobEvents);
const getJobMock = vi.mocked(getJob);

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

beforeEach(() => {
  // 최소 표시 시간 게이트가 있어 실시간으로는 매 단계 1.5초를 기다려야 한다.
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
});

function event(status: string, step: string | null): JobEvent {
  return {
    jobId: "j1",
    status,
    step,
    message: "진행 중",
    timestamp: "2026-09-08T14:23:45.123",
  } as JobEvent;
}

/**
 * 이벤트를 순서대로 흘리고 **스트림을 열어 둔다.**
 * 실제 서버는 완료·실패에서만 닫으므로, 닫아 버리면 연결 끊김 경로로 떨어져 단계를 볼 수 없다.
 */
function serverSends(...events: JobEvent[]) {
  streamMock.mockImplementation(async function* (_jobId: string, signal?: AbortSignal) {
    for (const e of events) yield e;
    await new Promise<void>((resolve) =>
      signal?.addEventListener("abort", () => resolve(), { once: true }),
    );
  });
}

/** 완료·실패를 알리지 않고 그냥 끊긴 경우. */
function serverDropsAfter(...events: JobEvent[]) {
  streamMock.mockImplementation(async function* () {
    for (const e of events) yield e;
  });
}

/** 게이트가 붙잡아 두는 시간을 건너뛴다. */
async function passGate(times = 1) {
  for (let i = 0; i < times; i += 1) {
    await vi.advanceTimersByTimeAsync(1600);
  }
}

describe("AnalyzingView", () => {
  it("첫 단계를 바로 보여준다", () => {
    serverSends();
    render(<AnalyzingView jobId="j1" />);

    expect(screen.getByRole("status").textContent).toContain("읽어오고 있어요");
  });

  it("단계가 바뀌면 이어서 보여준다", async () => {
    serverSends(event("IN_PROGRESS", "LLM_ANALYSIS"));
    render(<AnalyzingView jobId="j1" />);

    await passGate();

    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("꼼꼼히 살펴보고 있어요"),
    );
  });

  it("단계를 최소 시간 동안 붙잡아 둔다", async () => {
    // 서버가 순식간에 끝내도 화면은 단계를 건너뛰지 않는다. 이 지연은 의도된 것이다.
    serverSends(event("IN_PROGRESS", "LLM_ANALYSIS"), event("IN_PROGRESS", "POST_PROCESSING"));
    render(<AnalyzingView jobId="j1" />);

    await passGate();
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("꼼꼼히 살펴보고 있어요"),
    );

    // 아직 다음 단계로 넘어가면 안 된다.
    await vi.advanceTimersByTimeAsync(500);
    expect(screen.getByRole("status").textContent).toContain("꼼꼼히 살펴보고 있어요");

    await passGate();
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("마무리하고"),
    );
  });

  it("완료를 받으면 결과를 따로 조회한다", async () => {
    // 완료 이벤트는 결과를 담고 있지 않다. 조회를 빠뜨리면 결과가 비어 보인다.
    serverSends(event("COMPLETED", null));
    getJobMock.mockResolvedValue({
      jobId: "j1",
      fileName: "등기부등본.pdf",
      fileSize: 1024,
      status: "COMPLETED",
      step: null,
      description: null,
      result: { isValidDeed: true, safetyLevel: "SAFE" },
    });
    render(<AnalyzingView jobId="j1" />);

    await passGate();

    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("끝났어요"));
    expect(getJobMock).toHaveBeenCalledWith("j1");
  });

  it("완료되면 결과 화면으로 보낸다", async () => {
    // replace 다. 뒤로 가기가 끝난 분석 화면으로 돌아오면 안 된다.
    serverSends(event("COMPLETED", null));
    getJobMock.mockResolvedValue({
      jobId: "j1",
      fileName: "등기부등본.pdf",
      fileSize: 1024,
      status: "COMPLETED",
      step: null,
      description: null,
      result: { isValidDeed: true, safetyLevel: "SAFE" },
    });
    render(<AnalyzingView jobId="j1" />);

    await passGate();

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/result/j1"));
  });

  it("결과 조회가 실패하면 그 사실을 알린다", async () => {
    serverSends(event("COMPLETED", null));
    getJobMock.mockRejectedValue(new Error("boom"));
    render(<AnalyzingView jobId="j1" />);

    expect((await screen.findByRole("alert")).textContent).toBe("결과를 불러오지 못했습니다.");
  });

  it("실패 이벤트를 받으면 재시도를 내어 준다", async () => {
    serverSends(event("FAILED", null));
    render(<AnalyzingView jobId="j1" />);

    await passGate();

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe("분석에 실패했습니다. 다시 시도해주세요."),
    );
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeTruthy();
  });

  it("완료도 실패도 없이 스트림이 닫히면 끊긴 것으로 다룬다", async () => {
    // 이걸 빠뜨리면 연결이 끊겼을 때 화면이 영원히 진행 중으로 남는다.
    serverDropsAfter(event("IN_PROGRESS", "PDF_PARSING"));
    render(<AnalyzingView jobId="j1" />);

    expect((await screen.findByRole("alert")).textContent).toBe(
      "연결이 끊어졌습니다. 다시 시도해주세요.",
    );
  });

  it("스트림이 오류를 내면 화면이 진행 중으로 남지 않는다", async () => {
    streamMock.mockImplementation(async function* () {
      throw new Error("boom");
    });
    render(<AnalyzingView jobId="j1" />);

    expect((await screen.findByRole("alert")).textContent).toBe(
      "알 수 없는 오류가 발생했습니다.",
    );
  });
});
