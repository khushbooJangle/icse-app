// Grading for `type: "code"` questions.
//
// Nothing is compiled or run. We compare the lines the student typed against
// the lines of the model answer, forgivingly:
//   - indentation and extra spaces don't matter
//   - blank lines don't matter
//   - ORDER doesn't matter (a model line counts if it appears anywhere)
// A model line is "matched" if the student typed it somewhere. Score is
// matched / total, and >= 80% counts as correct — the same 80% threshold the
// rest of the app uses.
//
// WHY order-independent: this is a study aid, not a compiler. Punishing a
// student for declaring a variable one line early would be discouraging and
// wouldn't teach them anything about the exam.

export const CODE_PASS_RATIO = 0.8;

// "  int   x =  5;  "  ->  "int x = 5;"
function normaliseLine(line: string): string {
  return line.trim().replace(/\s+/g, " ");
}

export function toLines(source: string): string[] {
  return source
    .split("\n")
    .map(normaliseLine)
    .filter((line) => line.length > 0);
}

export type CodeCheckResult = {
  matched: string[]; // model lines the student got
  missing: string[]; // model lines the student didn't write
  total: number;
  ratio: number; // 0..1
  percent: number; // 0..100, rounded
  isCorrect: boolean; // ratio >= 80%
};

export function checkCode(typed: string, modelAnswer: string): CodeCheckResult {
  const modelLines = toLines(modelAnswer);
  const typedLines = toLines(typed);

  // A Set gives fast "did they type this line anywhere?" lookups.
  const typedSet = new Set(typedLines);

  const matched: string[] = [];
  const missing: string[] = [];
  for (const line of modelLines) {
    if (typedSet.has(line)) {
      matched.push(line);
    } else {
      missing.push(line);
    }
  }

  // An empty model answer would divide by zero; treat it as nothing to match.
  const total = modelLines.length;
  const ratio = total === 0 ? 0 : matched.length / total;

  return {
    matched,
    missing,
    total,
    ratio,
    percent: Math.round(ratio * 100),
    isCorrect: total > 0 && ratio >= CODE_PASS_RATIO,
  };
}
