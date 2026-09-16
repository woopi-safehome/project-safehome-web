import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DeedUploadForm } from "./DeedUploadForm";

// 렌더링을 테스트마다 치운다. 안 치우면 앞 테스트의 DOM 이 남아
// 같은 이름의 요소가 둘이 되고, 조회가 "여럿 찾음"으로 실패한다.
afterEach(cleanup);

function button(name: string) {
  return screen.getByRole("button", { name }) as HTMLButtonElement;
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
});
