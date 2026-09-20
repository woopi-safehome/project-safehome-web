import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AnonymousNotice } from "./AnonymousNotice";
import { writeTokens } from "@/shared/api/tokens";

beforeEach(() => {
  localStorage.clear();
});

afterEach(cleanup);

describe("AnonymousNotice", () => {
  it("비회원에게는 결과가 남지 않는다는 것을 알린다", () => {
    // 말해 주지 않으면 사용자는 창을 닫은 뒤에야 안다.
    render(<AnonymousNotice />);

    expect(screen.getByText(/다시 찾을 수 없습니다/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "로그인" }).getAttribute("href")).toBe("/login");
  });

  it("로그인했으면 아무것도 내놓지 않는다", () => {
    writeTokens({ accessToken: "a1", refreshToken: "r1" });

    const { container } = render(<AnonymousNotice />);

    expect(container.textContent).toBe("");
  });
});
