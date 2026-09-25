import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HistoryList } from "./HistoryList";
import { getMyJobs, type DeedJobSummary, type JobPage } from "../api";
import { ApiError } from "@/shared/api/client";

vi.mock("../api", () => ({ getMyJobs: vi.fn() }));
const getMyJobsMock = vi.mocked(getMyJobs);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function summary(over: Partial<DeedJobSummary> = {}): DeedJobSummary {
  return {
    jobId: "j1",
    fileName: "등기부등본.pdf",
    fileSize: 1024,
    status: "COMPLETED",
    safetyLevel: "SAFE",
    address: "서울시 어딘가",
    createdAt: "2026-09-08T14:23:45.123",
    leaseType: "전세",
    ...over,
  };
}

function page(items: DeedJobSummary[], hasNext = false): JobPage {
  return {
    items,
    pagination: {
      currentPage: 1,
      totalPages: hasNext ? 2 : 1,
      totalElements: items.length,
      size: 20,
      hasNext,
      hasPrevious: false,
      isFirst: true,
      isLast: !hasNext,
    },
  };
}

function link(name: string) {
  return screen.getByRole("link", { name: new RegExp(name) }) as HTMLAnchorElement;
}

describe("HistoryList", () => {
  it("첫 쪽을 0 번으로 요청한다", async () => {
    // 요청의 page 는 0부터다. 응답의 currentPage(1부터)와 기준이 다르다.
    getMyJobsMock.mockResolvedValue(page([summary()]));
    render(<HistoryList />);

    await waitFor(() => expect(getMyJobsMock).toHaveBeenCalledWith(0));
  });

  it("이력이 없으면 분석을 시작하도록 안내한다", async () => {
    getMyJobsMock.mockResolvedValue(page([]));
    render(<HistoryList />);

    await screen.findByText("아직 분석한 기록이 없어요");
    // 첫 화면은 안내가 길어서, 맨 위가 아니라 업로드 영역으로 바로 보낸다.
    expect(link("분석 시작하기").getAttribute("href")).toBe("/#analyze");
  });

  it("끝난 작업은 결과로, 도는 작업은 진행 화면으로 보낸다", async () => {
    getMyJobsMock.mockResolvedValue(
      page([
        summary({ jobId: "done", fileName: "끝난것.pdf", status: "COMPLETED" }),
        summary({ jobId: "busy", fileName: "도는것.pdf", status: "IN_PROGRESS", safetyLevel: null }),
      ]),
    );
    render(<HistoryList />);

    await waitFor(() => expect(link("끝난것.pdf").getAttribute("href")).toBe("/result/done"));
    expect(link("도는것.pdf").getAttribute("href")).toBe("/analyzing/busy");
  });

  it("실패한 작업은 갈 곳이 없고 안내만 한다", async () => {
    getMyJobsMock.mockResolvedValue(
      page([summary({ jobId: "bad", fileName: "실패.pdf", status: "FAILED", safetyLevel: null })]),
    );
    render(<HistoryList />);

    await screen.findByText("실패.pdf");
    expect(screen.queryByRole("link", { name: /실패\.pdf/ })).toBeNull();
    expect(screen.getByText(/다른 파일로 다시 올려 주세요/)).toBeTruthy();
  });

  it("날짜를 시간대와 무관하게 표시한다", async () => {
    // 계약상 오프셋이 없는 시각이라, Date 로 파싱하면 브라우저 시간대만큼 밀린다.
    getMyJobsMock.mockResolvedValue(page([summary({ createdAt: "2026-09-08T23:50:00.000" })]));
    render(<HistoryList />);

    await waitFor(() => expect(screen.getByText("2026.09.08")).toBeTruthy());
  });

  it("createdAt 이 없어도 깨지지 않는다", async () => {
    getMyJobsMock.mockResolvedValue(
      page([summary({ createdAt: null, address: null, safetyLevel: null, leaseType: null })]),
    );
    render(<HistoryList />);

    await screen.findByText("등기부등본.pdf");
  });

  it("다음 쪽이 없으면 더 보기를 내놓지 않는다", async () => {
    getMyJobsMock.mockResolvedValue(page([summary()], false));
    render(<HistoryList />);

    await screen.findByText("등기부등본.pdf");
    expect(screen.queryByRole("button", { name: "더 보기" })).toBeNull();
  });

  it("더 보기는 다음 쪽을 이어 붙인다", async () => {
    getMyJobsMock
      .mockResolvedValueOnce(page([summary({ jobId: "a", fileName: "첫쪽.pdf" })], true))
      .mockResolvedValueOnce(page([summary({ jobId: "b", fileName: "둘쪽.pdf" })], false));
    render(<HistoryList />);

    fireEvent.click(await screen.findByRole("button", { name: "더 보기" }));

    await waitFor(() => expect(screen.getByText("둘쪽.pdf")).toBeTruthy());
    // 앞 쪽이 사라지면 안 된다.
    expect(screen.getByText("첫쪽.pdf")).toBeTruthy();
    expect(getMyJobsMock).toHaveBeenLastCalledWith(1);
  });

  it("더 보기가 실패해도 이미 있는 목록은 그대로 둔다", async () => {
    getMyJobsMock
      .mockResolvedValueOnce(page([summary({ fileName: "첫쪽.pdf" })], true))
      .mockRejectedValueOnce(new ApiError("NETWORK_ERROR", "…", 0));
    render(<HistoryList />);

    fireEvent.click(await screen.findByRole("button", { name: "더 보기" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "더 보기" })).toBeTruthy());
    expect(screen.getByText("첫쪽.pdf")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("더 보기가 실패하면 같은 쪽을 다시 시도한다", async () => {
    // 실패한 시도로 번호가 밀리면 한 쪽이 통째로 빠진다.
    getMyJobsMock
      .mockResolvedValueOnce(page([summary({ fileName: "첫쪽.pdf" })], true))
      .mockRejectedValueOnce(new ApiError("NETWORK_ERROR", "…", 0))
      .mockResolvedValueOnce(page([summary({ jobId: "b", fileName: "둘쪽.pdf" })], false));
    render(<HistoryList />);

    fireEvent.click(await screen.findByRole("button", { name: "더 보기" }));
    await waitFor(() => expect(getMyJobsMock).toHaveBeenCalledTimes(2));

    fireEvent.click(screen.getByRole("button", { name: "더 보기" }));

    await waitFor(() => expect(screen.getByText("둘쪽.pdf")).toBeTruthy());
    expect(getMyJobsMock).toHaveBeenLastCalledWith(1);
  });

  it("첫 조회가 실패하면 다시 시도할 수 있다", async () => {
    getMyJobsMock
      .mockRejectedValueOnce(new ApiError("NETWORK_ERROR", "…", 0))
      .mockResolvedValueOnce(page([summary({ fileName: "두번째엔.pdf" })]));
    render(<HistoryList />);

    expect((await screen.findByRole("alert")).textContent).toBe("네트워크 연결을 확인하세요.");

    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    await waitFor(() => expect(screen.getByText("두번째엔.pdf")).toBeTruthy());
  });
});
