import { getVisual } from "./index";

// Renders the visual for a section, if one exists.
//
// The important behaviour: an unknown visualId renders NOTHING rather than
// crashing. That means chapters.ts can reference a visual before it's been
// built, and the page still works — content and visuals can land separately.
export default function VisualSlot({ visualId }: { visualId?: string }) {
  if (!visualId) return null;

  const Visual = getVisual(visualId);
  if (!Visual) {
    // Not built yet. Show a quiet placeholder only in development so the
    // student never sees an empty box in production.
    if (process.env.NODE_ENV === "development") {
      return (
        <div className="mb-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-400">
          visual &ldquo;{visualId}&rdquo; not built yet
        </div>
      );
    }
    return null;
  }

  return (
    <div className="mb-4">
      <Visual />
    </div>
  );
}
