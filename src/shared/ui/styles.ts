/**
 * 여러 화면이 같은 모양으로 써야 하는 요소의 클래스.
 * 버튼마다 따로 적으면 조금씩 어긋나서, 같은 동작이 화면마다 다르게 보인다.
 */

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "disabled:cursor-not-allowed disabled:opacity-40";

/** 화면에서 가장 중요한 동작 하나. */
export const buttonPrimary = `${BUTTON_BASE} bg-brand text-brand-ink hover:bg-brand-strong`;

/** 보조 동작. */
export const buttonSecondary = `${BUTTON_BASE} border border-line bg-surface text-ink hover:border-brand hover:text-brand`;

/** 글자만 있는 동작. 되돌리기·취소처럼 무게가 가벼운 것. */
export const buttonText =
  "text-sm font-medium text-brand underline-offset-4 hover:underline " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded";

/** 내용을 묶는 흰 판. */
export const card = "rounded-2xl border border-line bg-surface";
