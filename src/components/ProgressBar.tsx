// No 'use client' needed — this component has no state and no event handlers,
// so Next.js can render it on the server. Keep components server-side when you can.

export default function ProgressBar({
  label,
  done,
  total,
  colour = "bg-indigo-500",
}: {
  label: string;
  done: number;
  total: number;
  colour?: string;
}) {
  // Guard against total === 0, which would make this NaN.
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">
          {done} / {total} ({percent}%)
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colour}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
