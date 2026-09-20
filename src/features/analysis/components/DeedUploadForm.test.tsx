import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DeedUploadForm } from "./DeedUploadForm";
import { ApiError } from "@/shared/api/client";
import { uploadDeed } from "../api";

vi.mock("../api", () => ({ uploadDeed: vi.fn() }));
const uploadMock = vi.mocked(uploadDeed);

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

// 렌더링을 테스트마다 치운다. 안 치우면 앞 테스트의 DOM 이 남아
// 같은 이름의 요소가 둘이 되고, 조회가 "여럿 찾음"으로 실패한다.
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function button(name: string) {
  return screen.getByRole("button", { name }) as HTMLButtonElement;
}

/** 파일을 고르고 제출까지 한다. jsdom 은 파일 선택을 사람처럼 흉내 낼 수 없다. */
function submitWith(container: HTMLElement, name = "등기부등본.pdf") {
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(["%PDF-1.4"], name, { type: "application/pdf" });
  fireEvent.change(input, { target: { files: [file] } });
  fireEvent.submit(container.querySelector("form") as HTMLFormElement);
  return file;
}

describe("DeedUploadForm", () => {
  it("파일을 고르기 전에는 제출할 수 없다", () => {
    render(<DeedUploadForm />);

    expect(button("분석 시작").disabled).toBe(true);
  });

  it("임대차 유형은 하나만 선택되고, 다시 누르면 해제된다", () => {
    // 유형을 고르지 않을 수도 있어야 한다 — 서버가 선택 항목으로 받는다.
    render(<DeedUploadForm />);

    fireEvent.click(button("전세"));
    expect(button("전세").getAttribute("aria-pressed")).toBe("true");
    expect(button("월세").getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(button("월세"));
    expect(button("전세").getAttribute("aria-pressed")).toBe("false");
    expect(button("월세").getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(button("월세"));
    expect(button("월세").getAttribute("aria-pressed")).toBe("false");
  });

  it("고른 파일과 유형을 그대로 올린다", async () => {
    uploadMock.mockResolvedValue("job-1");
    const { container } = render(<DeedUploadForm />);

    fireEvent.click(button("전세"));
    const file = submitWith(container);

    await waitFor(() => expect(uploadMock).toHaveBeenCalledWith(file, "전세"));
  });

  it("유형을 고르지 않으면 null 로 올린다", async () => {
    uploadMock.mockResolvedValue("job-1");
    const { container } = render(<DeedUploadForm />);

    const file = submitWith(container);

    await waitFor(() => expect(uploadMock).toHaveBeenCalledWith(file, null));
  });

  it("업로드가 끝나면 분석중 화면으로 보낸다", async () => {
    uploadMock.mockResolvedValue("job-9");
    const { container } = render(<DeedUploadForm />);

    submitWith(container);

    await waitFor(() => expect(push).toHaveBeenCalledWith("/analyzing/job-9"));
  });

  it("서버가 거절하면 서버 문구를 그대로 보여준다", async () => {
    // 안내 문구를 화면에서 새로 지어내지 않는다. 판정도 안내도 서버가 정한다.
    uploadMock.mockRejectedValue(new ApiError("UNAUTHORIZED", "인증이 필요합니다.", 401));
    const { container } = render(<DeedUploadForm />);

    submitWith(container);

    expect((await screen.findByRole("alert")).textContent).toBe("인증이 필요합니다.");
  });

  it("업로드 중에는 다시 제출할 수 없다", async () => {
    uploadMock.mockReturnValue(new Promise(() => {})); // 끝나지 않는 업로드
    const { container } = render(<DeedUploadForm />);

    submitWith(container);

    await waitFor(() => expect(button("업로드 중…").disabled).toBe(true));
  });
});
