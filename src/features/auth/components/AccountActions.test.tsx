import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AccountActions } from "./AccountActions";
import { withdraw } from "../api";
import { readTokens, writeTokens } from "@/shared/api/tokens";
import { ApiError } from "@/shared/api/client";

vi.mock("../api", () => ({ withdraw: vi.fn() }));
const withdrawMock = vi.mocked(withdraw);

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function loggedIn() {
  writeTokens({ accessToken: "a1", refreshToken: "r1" });
}

function button(name: string) {
  return screen.getByRole("button", { name });
}

describe("AccountActions", () => {
  it("로그인하지 않았으면 아무것도 내놓지 않는다", () => {
    const { container } = render(<AccountActions />);

    expect(container.textContent).toBe("");
  });

  it("로그아웃도 한 번 더 묻는다", () => {
    loggedIn();
    render(<AccountActions />);

    fireEvent.click(button("로그아웃"));

    expect(readTokens()).not.toBeNull();
    expect(screen.getByText("로그아웃 하시겠습니까?")).toBeTruthy();
  });

  it("확인하면 토큰을 버리고 화면이 곧바로 따라간다", () => {
    // 저장소는 스스로 알려 주지 않는다. 구독이 없으면 로그아웃해도 버튼이 남는다.
    loggedIn();
    render(<AccountActions />);

    fireEvent.click(button("로그아웃"));
    fireEvent.click(screen.getAllByRole("button", { name: "로그아웃" })[0]);

    expect(readTokens()).toBeNull();
    expect(screen.queryByRole("button", { name: "로그아웃" })).toBeNull();
  });

  it("탈퇴는 무엇이 사라지는지 알리고 한 번 더 묻는다", () => {
    // 되돌릴 수 없다. 한 번에 지워지면 안 된다.
    loggedIn();
    render(<AccountActions />);

    fireEvent.click(button("회원탈퇴"));

    expect(withdrawMock).not.toHaveBeenCalled();
    expect(screen.getByText(/모든 분석 기록이 삭제됩니다/)).toBeTruthy();
  });

  it("취소하면 탈퇴하지 않는다", () => {
    loggedIn();
    render(<AccountActions />);

    fireEvent.click(button("회원탈퇴"));
    fireEvent.click(button("취소"));

    expect(withdrawMock).not.toHaveBeenCalled();
    expect(button("회원탈퇴")).toBeTruthy();
  });

  it("확인하면 탈퇴하고 첫 화면으로 보낸다", async () => {
    loggedIn();
    withdrawMock.mockResolvedValue();
    render(<AccountActions />);

    fireEvent.click(button("회원탈퇴"));
    fireEvent.click(button("탈퇴"));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
    expect(withdrawMock).toHaveBeenCalledTimes(1);
  });

  it("탈퇴가 실패하면 알리고 그대로 둔다", async () => {
    loggedIn();
    withdrawMock.mockRejectedValue(new ApiError("INTERNAL_SERVER_ERROR", "잠시 후 다시 시도해주세요.", 500));
    render(<AccountActions />);

    fireEvent.click(button("회원탈퇴"));
    fireEvent.click(button("탈퇴"));

    expect((await screen.findByRole("alert")).textContent).toBe("잠시 후 다시 시도해주세요.");
    expect(replace).not.toHaveBeenCalled();
    expect(readTokens()).not.toBeNull();
  });
});
