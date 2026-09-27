import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AnonymousNotice } from "./AnonymousNotice";
import { writeTokens } from "@/shared/api/tokens";

// 로그인 가능 여부는 상수다. 두 경우를 모두 보려고 테스트마다 바꾼다.
const flags = vi.hoisted(() => ({ loginAvailable: false }));
vi.mock("@/shared/config/env", () => ({
  env: { apiUrl: "", kakaoJsKey: "" },
  get loginAvailable() {
    return flags.loginAvailable;
  },
}));

beforeEach(() => {
  localStorage.clear();
  flags.loginAvailable = false;
});

afterEach(cleanup);

describe("AnonymousNotice", () => {
  it("비회원에게는 이 브라우저에서만 열리고 목록이 없다는 것을 알린다", () => {
    // 말해 주지 않으면 사용자는 창을 닫은 뒤에야 안다.
    render(<AnonymousNotice />);

    expect(screen.getByText(/분석한 이 브라우저에서만/)).toBeTruthy();
  });

  it("로그인이 되지 않는 동안에는 로그인을 권하지 않는다", () => {
    // 누르면 막다른 곳에 닿는다 — 공모전 시연 영상에도 그대로 찍힌다.
    render(<AnonymousNotice />);

    expect(screen.queryByRole("link", { name: "로그인" })).toBeNull();
    expect(screen.getByText(/즐겨찾기/)).toBeTruthy();
  });

  it("로그인이 되면 로그인으로 기록을 남기라고 안내한다", () => {
    flags.loginAvailable = true;
    render(<AnonymousNotice />);

    expect(screen.getByRole("link", { name: "로그인" }).getAttribute("href")).toBe("/login");
  });

  it("로그인했으면 아무것도 내놓지 않는다", () => {
    writeTokens({ accessToken: "a1", refreshToken: "r1" });

    const { container } = render(<AnonymousNotice />);

    expect(container.textContent).toBe("");
  });
});
