"use client";

import type { QuizQuestion as QuizQuestionType } from "@/data/quizzes";

// This component holds NO state of its own. The quiz session page owns
// "which option was picked" and passes it down, because the session page is
// what needs to count the score. Keeping state in one place is easier to follow.
export default function QuizQuestion({
  question,
  pickedIndex,
  onPick,
}: {
  question: QuizQuestionType;
  pickedIndex: number | null; // null = not answered yet
  onPick: (index: number) => void;
}) {
  const hasAnswered = pickedIndex !== null;

  return (
    <div>
      <h2 className="mb-5 text-xl font-semibold text-gray-900">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctIndex;
          const isPicked = index === pickedIndex;

          // Before answering: plain. After answering: show the right answer in
          // green, and the wrong pick (if any) in red.
          let style = "border-gray-200 bg-white hover:border-amber-400";
          if (hasAnswered && isCorrect) style = "border-green-500 bg-green-50";
          else if (hasAnswered && isPicked) style = "border-red-500 bg-red-50";
          else if (hasAnswered) style = "border-gray-200 bg-white opacity-60";

          return (
            <button
              key={index}
              // disabled after answering, so the score can't be gamed by re-clicking
              disabled={hasAnswered}
              onClick={() => onPick(index)}
              className={`w-full rounded-xl border-2 px-4 py-3 text-left transition ${style}`}
            >
              <span className="mr-2 font-semibold text-gray-400">
                {"ABCD"[index]}.
              </span>
              {option}
              {hasAnswered && isCorrect && <span className="ml-2">✅</span>}
              {hasAnswered && isPicked && !isCorrect && <span className="ml-2">❌</span>}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div className="mt-5 rounded-xl bg-indigo-50 p-4">
          <p className="mb-1 font-semibold text-indigo-900">
            {pickedIndex === question.correctIndex ? "Correct! 🎉" : "Not quite."}
          </p>
          <p className="text-sm text-indigo-800">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
