/**
 * 안내 구역의 제목. 구역마다 같은 모양이어야 훑어 읽기 쉽다.
 * 가운데 정렬 + 영문 라벨 조합은 틀에 찍은 듯한 인상을 줘서, 왼쪽 정렬에 짧은 한글 머리말로 둔다.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-2.5">
      {eyebrow !== undefined && <p className="text-sm font-medium text-brand">{eyebrow}</p>}
      {/* 앵커(`/guide#issue`)로 들어오면 고정 머리글에 가리지 않게, 위 소제목까지 보이도록 여백을 둔다. */}
      <h2 id={id} className="scroll-mt-32 text-2xl font-bold leading-snug tracking-tight sm:text-[1.75rem]">
        {title}
      </h2>
      {description !== undefined && <p className="text-base leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
