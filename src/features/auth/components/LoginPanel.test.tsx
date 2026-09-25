import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { LoginPanel } from "./LoginPanel";

vi.mock("../api", () => ({ loginWithKakao: vi.fn() }));
vi.mock("../kakao", () => ({ getKakaoAccessToken: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

afterEach(() => {
  cleanup();
});

describe("LoginPanel", () => {
  it("카카오 키가 없으면 버튼을 잠근다", () => {
    // 눌리는데 아무 일도 안 일어나는 버튼을 두지 않는다.
    // 테스트 환경에는 키가 주입되지 않으므로 이 상태가 기본이다.
    render(<LoginPanel />);

    expect((screen.getByRole("button", { name: "카카오로 시작하기" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("status").textContent).toContain("아직 준비 중이에요");
  });
});
