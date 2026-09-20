import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Onboarding } from "./Onboarding";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function button(name: string) {
  return screen.getByRole("button", { name });
}

describe("Onboarding", () => {
  it("첫 장부터 보여준다", () => {
    render(<Onboarding />);

    expect(screen.getByRole("heading").textContent).toContain("업로드하세요");
  });

  it("다음으로 넘기면 마지막에서 시작하기가 된다", () => {
    render(<Onboarding />);

    fireEvent.click(button("다음"));
    expect(screen.getByRole("heading").textContent).toContain("분석합니다");

    fireEvent.click(button("다음"));
    expect(screen.getByRole("heading").textContent).toContain("한눈에 확인");
    expect(screen.queryByRole("button", { name: "다음" })).toBeNull();

    fireEvent.click(button("시작하기"));
    expect(replace).toHaveBeenCalledWith("/");
  });

  it("언제든 건너뛸 수 있다", () => {
    // 이미 아는 사람을 붙잡아 두지 않는다.
    render(<Onboarding />);

    fireEvent.click(button("건너뛰기"));

    expect(replace).toHaveBeenCalledWith("/");
  });
});
