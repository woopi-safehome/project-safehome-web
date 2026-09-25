import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ResultView } from "./ResultView";
import { getJob, type DeedJob } from "../api";
import type { DeedAnalysis } from "../result";
import { ApiError } from "@/shared/api/client";

vi.mock("../api", () => ({ getJob: vi.fn() }));
const getJobMock = vi.mocked(getJob);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function job(result: DeedAnalysis | null): DeedJob {
  return {
    jobId: "j1",
    fileName: "등기부등본.pdf",
    fileSize: 1024,
    status: "COMPLETED",
    step: null,
    description: null,
    result,
  };
}

/** 유효한 등기부의 최소 형태. 각 테스트가 필요한 필드만 얹는다. */
function valid(extra: Partial<DeedAnalysis> = {}): DeedAnalysis {
  return { isValidDeed: true, safetyLevel: "CAUTION", ...extra };
}

function serverReturns(analysis: DeedAnalysis | null) {
  getJobMock.mockResolvedValue(job(analysis));
}

describe("ResultView", () => {
  it("불러오는 동안 진행 중임을 알린다", () => {
    getJobMock.mockReturnValue(new Promise(() => {}));
    render(<ResultView jobId="j1" />);

    expect(screen.getByRole("status").textContent).toContain("불러오고 있어요");
  });

  it("서버가 정한 등급을 그대로 보여준다", async () => {
    // 화면에서 위험도를 다시 계산하지 않는다.
    serverReturns(valid({ safetyLevel: "DANGER" }));
    render(<ResultView jobId="j1" />);

    await waitFor(() => expect(screen.getByText("위험")).toBeTruthy());
    expect(screen.getByText("보증금을 잃을 수 있는 내용이 있어요")).toBeTruthy();
  });

  it("등급이 없으면 등급 영역을 비운다", async () => {
    serverReturns(valid({ safetyLevel: undefined, analysisSummary: "요약입니다" }));
    render(<ResultView jobId="j1" />);

    await waitFor(() => expect(screen.getByText("요약입니다")).toBeTruthy());
    expect(screen.queryByText("안전")).toBeNull();
    expect(screen.queryByText("주의")).toBeNull();
  });

  it("등기부등본이 아니면 이유만 보여준다", async () => {
    // 이 경우 서버가 체크리스트 계산 자체를 건너뛴다.
    serverReturns({ isValidDeed: false, reason: "등기부등본이 아닙니다." });
    render(<ResultView jobId="j1" />);

    expect((await screen.findByRole("alert")).textContent).toBe("등기부등본이 아닙니다.");
    expect(screen.queryByText("항목별 확인 결과")).toBeNull();
  });

  it("체크리스트의 analysis 는 있을 때만 보여준다", async () => {
    // 항목 자체는 늘 오지만 analysis 는 모델이 채웠을 때만 붙는다.
    serverReturns(
      valid({
        checklist: [
          {
            id: "ownership_clarity",
            category: "소유권",
            item: "소유권이 명확한가",
            status: "양호",
            detail: "단독 소유입니다.",
            analysis: { findings: "발견 사항", leaseImpact: "전세 영향" },
          },
          {
            id: "mortgage",
            category: "담보권",
            item: "근저당이 있는가",
            status: "위험",
            detail: "근저당이 설정돼 있습니다.",
          },
        ],
      }),
    );
    render(<ResultView jobId="j1" />);

    await waitFor(() => expect(screen.getByText("소유권이 명확한가")).toBeTruthy());
    expect(screen.getByText("발견 사항")).toBeTruthy();
    // 두 번째 항목은 analysis 가 없다 — 항목은 보이되 서술은 없다.
    expect(screen.getByText("근저당이 있는가")).toBeTruthy();
    expect(screen.getByText("위험")).toBeTruthy();
  });

  it("references 가 없어도 깨지지 않는다", async () => {
    // 등급이 SAFE 가 아니어도 검색이 실패하면 없다. 등급만 보고 단정하지 않는다.
    serverReturns(valid({ safetyLevel: "DANGER", references: undefined }));
    render(<ResultView jobId="j1" />);

    await waitFor(() => expect(screen.getByText("위험")).toBeTruthy());
    expect(screen.queryByText("참고한 법령과 사례")).toBeNull();
  });

  it("references 의 한쪽만 와도 그쪽만 보여준다", async () => {
    serverReturns(
      valid({
        references: {
          laws: [
            {
              source: "주택임대차보호법",
              article: "제3조",
              title: "대항력",
              content: "본문입니다.",
              riskContext: "맥락",
            },
          ],
        },
      }),
    );
    render(<ResultView jobId="j1" />);

    await waitFor(() => expect(screen.getByText("법령")).toBeTruthy());
    expect(screen.queryByText("사례")).toBeNull();
  });

  it("잦은 이전 경고는 표시될 때만 보인다", async () => {
    const info = { currentOwner: "홍길동", ownerType: "개인" };
    serverReturns(valid({ ownershipInfo: { ...info, frequentTransferWarning: true } }));
    const { unmount } = render(<ResultView jobId="j1" />);

    await waitFor(() => expect(screen.getByText("잦은 이전")).toBeTruthy());

    unmount();
    serverReturns(valid({ ownershipInfo: info }));
    render(<ResultView jobId="j1" />);

    await waitFor(() => expect(screen.getAllByText("홍길동").length).toBeGreaterThan(0));
    expect(screen.queryByText("잦은 이전")).toBeNull();
  });

  it("null 로 온 필드는 빈 줄로 그리지 않고, 묶음이 null 이어도 멈추지 않는다", async () => {
    // 분석 서버의 프롬프트가 모르는 값을 null 로 채우라고 지시한다. 단독소유의 지분이 대표적이다.
    serverReturns({
      ...valid({ analysisSummary: "요약입니다" }),
      ownershipInfo: { currentOwner: "홍길동", ownerType: "단독소유", shareRatio: null },
      riskSummary: null,
      recommendations: null,
    } as unknown as DeedAnalysis);
    render(<ResultView jobId="j1" />);

    await waitFor(() => expect(screen.getByText("요약입니다")).toBeTruthy());
    expect(screen.getByText("단독소유")).toBeTruthy();
    expect(screen.queryByText("지분")).toBeNull();
    expect(screen.queryByText("위험 요소 정리")).toBeNull();
  });

  it("등급과 무관하게 등기부 밖의 위험을 확인할 공공 서비스로 이어 준다", async () => {
    // '안전'이어도 체납·선순위 세입자는 등기부에 나오지 않는다. 어디서 보는지까지 알려야 한다.
    serverReturns(valid({ safetyLevel: "SAFE", analysisSummary: "요약입니다" }));
    render(<ResultView jobId="j1" />);

    await waitFor(() => expect(screen.getByText("요약입니다")).toBeTruthy());
    const links = screen.getAllByRole("link").filter((a) => a.getAttribute("target") === "_blank");
    expect(links.length).toBe(3);
    for (const a of links) {
      expect(a.getAttribute("href")).toMatch(/^https:\/\/(www\.khug\.or\.kr|www\.gov\.kr|www\.nts\.go\.kr)\//);
      expect(a.getAttribute("rel")).toContain("noopener");
    }
  });

  it("등기부가 아니면 공공 서비스 안내도 내놓지 않는다", async () => {
    serverReturns({ isValidDeed: false, reason: "등기부등본이 아닙니다." });
    render(<ResultView jobId="j1" />);

    await screen.findByRole("alert");
    expect(screen.queryByText("등기부로 알 수 없는 것도 확인해 보세요")).toBeNull();
  });

  it("결과가 비어 있으면 찾을 수 없다고 알린다", async () => {
    serverReturns(null);
    render(<ResultView jobId="j1" />);

    expect((await screen.findByRole("alert")).textContent).toBe("결과를 찾지 못했어요.");
  });

  it("조회가 실패하면 다시 시도할 수 있다", async () => {
    getJobMock.mockRejectedValueOnce(new ApiError("NETWORK_ERROR", "…", 0));
    render(<ResultView jobId="j1" />);

    expect((await screen.findByRole("alert")).textContent).toBe("네트워크 연결을 확인하세요.");

    serverReturns(valid({ analysisSummary: "두 번째엔 성공" }));
    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    await waitFor(() => expect(screen.getByText("두 번째엔 성공")).toBeTruthy());
  });
});
