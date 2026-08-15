import type { RevisionCard } from "@/data/revision";

export default function Flashcard({
  card,
  title,
}: {
  card: RevisionCard;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <div className="text-5xl">{card.emoji}</div>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      <ul className="mb-6 space-y-3">
        {card.triggerPoints.map((point, index) => (
          <li key={index} className="flex gap-3 text-gray-700">
            <span className="text-purple-500">▸</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-xl bg-purple-50 p-4 text-purple-900">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-purple-500">
          Key analogy
        </p>
        <p>{card.keyAnalogy}</p>
      </div>
    </div>
  );
}
