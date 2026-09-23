/** 안내 구역의 제목. 구역마다 같은 모양이어야 훑어 읽기 쉽다. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
      <p className="text-sm font-semibold text-brand">{eyebrow}</p>
      {/* 앵커(`/guide#issue`)로 들어오면 고정 머리글에 가리지 않게, 위 소제목까지 보이도록 여백을 둔다. */}
      <h2 id={id} className="scroll-mt-32 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description !== undefined && <p className="text-base leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
