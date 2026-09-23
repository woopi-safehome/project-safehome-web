import type { SVGProps } from "react";

/**
 * 안내 화면의 그림. 외부 이미지를 쓰지 않고 인라인 SVG 로 그린다 —
 * 색이 디자인 토큰을 따르므로 다크 모드에서 따로 그릴 필요가 없고, 요청도 늘지 않는다.
 *
 * 전부 장식이다. 뜻은 곁의 글자가 전하므로 보조기기에는 숨긴다.
 */
type Props = SVGProps<SVGSVGElement>;

function Frame({ children, ...props }: Props) {
  return (
    <svg viewBox="0 0 240 180" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

/** 선 스타일을 한곳에 모은다. */
const OUTLINE = "stroke-line";
const CARD = `fill-surface ${OUTLINE}`;

function Lines({ x, y, widths, gap = 10 }: { x: number; y: number; widths: number[]; gap?: number }) {
  return (
    <>
      {widths.map((w, i) => (
        <rect key={i} x={x} y={y + i * gap} width={w} height={4} rx={2} className="fill-line" />
      ))}
    </>
  );
}

/** 첫 화면. 집과 등기부, 그 위의 확인 표시 — 계약 전에 서류로 먼저 확인한다는 뜻. */
export function HeroIllustration(props: Props) {
  return (
    <svg viewBox="0 0 360 280" aria-hidden="true" {...props}>
      <circle cx="190" cy="145" r="118" className="fill-brand-soft" />
      <circle cx="300" cy="52" r="10" className="fill-brand-soft" />
      <circle cx="54" cy="226" r="7" className="fill-brand-soft" />

      {/* 집 */}
      <g>
        <path d="M58 150 128 94l70 56v88H58v-88Z" className={CARD} strokeWidth={2} />
        <path d="M46 156 128 90l82 66" className="fill-none stroke-brand" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="80" y="166" width="30" height="28" rx="3" className="fill-brand-soft" />
        <rect x="146" y="166" width="30" height="28" rx="3" className="fill-brand-soft" />
        <rect x="113" y="196" width="30" height="42" rx="3" className="fill-brand" />
      </g>

      {/* 등기부등본 */}
      <g transform="rotate(6 262 150)">
        <rect x="206" y="72" width="112" height="146" rx="10" className={CARD} strokeWidth={2} />
        <rect x="222" y="88" width="56" height="7" rx="3.5" className="fill-brand" />
        <Lines x={222} y={106} widths={[80, 66, 74]} gap={12} />
        <rect x="222" y="148" width="80" height="1.5" className="fill-line" />
        <Lines x={222} y={158} widths={[70, 58, 76]} gap={12} />
      </g>

      {/* 방패 */}
      <g>
        <path
          d="M268 172 238 184v22c0 18 12.4 32.6 30 38 17.6-5.4 30-20 30-38v-22l-30-12Z"
          className="fill-brand"
        />
        <path
          d="m254 208 10 10 20-21"
          className="fill-none stroke-brand-ink"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** 1단계 — 인터넷등기소에서 발급. 브라우저 창 안의 문서. */
export function IssueIllustration(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="120" cy="92" r="72" className="fill-brand-soft" />
      <rect x="38" y="36" width="164" height="112" rx="10" className={CARD} strokeWidth={2} />
      <path d="M38 46a10 10 0 0 1 10-10h144a10 10 0 0 1 10 10v10H38V46Z" className="fill-surface-muted" />
      <circle cx="52" cy="46" r="3" className="fill-danger" />
      <circle cx="62" cy="46" r="3" className="fill-caution" />
      <circle cx="72" cy="46" r="3" className="fill-safe" />
      <rect x="86" y="42" width="100" height="8" rx="4" className="fill-surface" />
      <rect x="92" y="68" width="56" height="70" rx="6" className="fill-surface stroke-brand" strokeWidth={2} />
      <rect x="100" y="78" width="28" height="5" rx="2.5" className="fill-brand" />
      <Lines x={100} y={90} widths={[40, 32, 36, 28]} gap={9} />
      <circle cx="170" cy="124" r="16" className="fill-brand" />
      <path d="M170 116v12M164 123l6 6 6-6" className="fill-none stroke-brand-ink" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/** 2단계 — 올리기. 문서가 올라가는 모습. */
export function UploadIllustration(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="120" cy="92" r="72" className="fill-brand-soft" />
      <rect x="54" y="112" width="132" height="44" rx="10" className="fill-surface stroke-brand" strokeWidth={2} strokeDasharray="6 5" />
      <rect x="88" y="30" width="64" height="84" rx="7" className={CARD} strokeWidth={2} />
      <rect x="98" y="42" width="30" height="5" rx="2.5" className="fill-brand" />
      <Lines x={98} y={54} widths={[44, 36, 40, 30]} gap={9} />
      <rect x="98" y="94" width="26" height="12" rx="3" className="fill-danger-soft" />
      <text x="111" y="103" textAnchor="middle" fontSize="8" fontWeight="700" className="fill-danger">PDF</text>
      <circle cx="120" cy="134" r="13" className="fill-brand" />
      <path d="M120 140v-12M115 132l5-5 5 5" className="fill-none stroke-brand-ink" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/** 3단계 — 분석. 문서를 돋보기로 훑는 모습. */
export function AnalyzeIllustration(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="120" cy="92" r="72" className="fill-brand-soft" />
      <rect x="62" y="28" width="92" height="124" rx="9" className={CARD} strokeWidth={2} />
      <rect x="74" y="42" width="40" height="6" rx="3" className="fill-brand" />
      <Lines x={74} y={58} widths={[66, 54, 60]} gap={11} />
      <rect x="74" y="92" width="62" height="12" rx="4" className="fill-caution-soft" />
      <rect x="78" y="96" width="44" height="4" rx="2" className="fill-caution" />
      <Lines x={74} y={114} widths={[58, 48]} gap={11} />
      <circle cx="150" cy="96" r="30" className="fill-surface stroke-brand" strokeWidth={6} fillOpacity={0.6} />
      <path d="m171 118 22 22" className="stroke-brand" strokeWidth={10} strokeLinecap="round" />
      <path d="M186 44l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" className="fill-brand" />
      <path d="M46 118l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2 2-4.5Z" className="fill-brand" />
    </Frame>
  );
}

/** 4단계 — 결과 확인. 등급 표시가 붙은 보고서. */
export function ResultIllustration(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="120" cy="92" r="72" className="fill-brand-soft" />
      <rect x="60" y="26" width="120" height="132" rx="10" className={CARD} strokeWidth={2} />
      <rect x="74" y="40" width="92" height="30" rx="7" className="fill-safe-soft" />
      <circle cx="90" cy="55" r="8" className="fill-safe" />
      <path d="m86.5 55.2 2.4 2.4 4.6-4.8" className="fill-none stroke-surface" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="104" y="49" width="48" height="5" rx="2.5" className="fill-safe" />
      <rect x="104" y="58" width="34" height="4" rx="2" className="fill-line" />
      {[82, 102, 122].map((y, i) => (
        <g key={y}>
          <circle cx="80" cy={y + 5} r="4" className={i === 1 ? "fill-caution" : "fill-safe"} />
          <rect x="90" y={y + 3} width={i === 1 ? 52 : 64} height="4" rx="2" className="fill-line" />
        </g>
      ))}
      <rect x="74" y="140" width="92" height="5" rx="2.5" className="fill-brand-soft" />
    </Frame>
  );
}

/** 로그인 — 잠긴 서랍 속 기록. 이력이 남는다는 뜻. */
export function HistoryIllustration(props: Props) {
  return (
    <Frame {...props}>
      <circle cx="120" cy="92" r="72" className="fill-brand-soft" />
      <rect x="64" y="46" width="100" height="112" rx="10" className={CARD} strokeWidth={2} />
      <rect x="74" y="36" width="100" height="112" rx="10" className={CARD} strokeWidth={2} />
      {[54, 82, 110].map((y) => (
        <g key={y}>
          <rect x="86" y={y} width="76" height="20" rx="5" className="fill-surface-muted" />
          <rect x="94" y={y + 8} width="40" height="4" rx="2" className="fill-line" />
          <circle cx="150" cy={y + 10} r="4" className="fill-brand" />
        </g>
      ))}
      <circle cx="174" cy="140" r="20" className="fill-brand" />
      <rect x="165" y="138" width="18" height="13" rx="2.5" className="fill-brand-ink" />
      <path d="M168.5 138v-3.5a5.5 5.5 0 0 1 11 0v3.5" className="fill-none stroke-brand-ink" strokeWidth={2.6} />
    </Frame>
  );
}
