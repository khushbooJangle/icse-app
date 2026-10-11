"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { java } from "@codemirror/lang-java";
import type { CodeQuestion } from "@/lib/content";
import { checkCode, type CodeCheckResult } from "@/lib/codeCheck";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl bg-gray-900 p-4 font-mono text-sm text-gray-500">
      loading editor…
    </div>
  ),
});

// A "write the program" question. The student types Java, presses Check, and
// we compare line-by-line against the model answer. Nothing is executed.
//
// Like QuizQuestion.tsx, this component reports its result upward instead of
// tracking score itself — the session page owns scoring for both question types.
export default function CodeAnswer({
  question,
  result,
  onCheck,
}: {
  question: CodeQuestion;
  result: CodeCheckResult | null; // null = not checked yet
  onCheck: (result: CodeCheckResult) => void;
}) {
  const [typed, setTyped] = useState("");
  const hasChecked = result !== null;

  function handleCheck() {
    onCheck(checkCode(typed, question.modelAnswer));
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{question.title}</h2>
      <p className="mb-4 mt-2 text-gray-700">{question.prompt}</p>

      <div className="overflow-hidden rounded-xl border border-gray-700">
        <CodeMirror
          value={typed}
          onChange={setTyped}
          editable={!hasChecked}
          theme="dark"
          height="220px"
          extensions={[java()]}
          placeholder="Type your program here…"
          basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: false }}
        />
      </div>

      {!hasChecked && (
        <button
          onClick={handleCheck}
          className="mt-4 rounded-xl bg-amber-500 px-5 py-2.5 font-semibold text-white hover:bg-amber-600 disabled:bg-gray-300"
          disabled={typed.trim().length === 0}
        >
          Check my answer
        </button>
      )}

      {hasChecked && (
        <div className="mt-5 space-y-4">
          <div
            className={`rounded-xl p-4 ${
              result.isCorrect ? "bg-green-50" : "bg-amber-50"
            }`}
          >
            <p
              className={`font-semibold ${
                result.isCorrect ? "text-green-800" : "text-amber-800"
              }`}
            >
              {result.isCorrect ? "Correct! 🎉" : "Not quite yet."}{" "}
              {result.matched.length} of {result.total} lines matched (
              {result.percent}%)
            </p>
            <p className="mt-1 text-sm text-gray-600">
              80% of the lines need to match to count as correct. Order
              doesn&apos;t matter, and spacing is ignored.
            </p>
          </div>

          {result.missing.length > 0 && (
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Lines you missed:
              </p>
              <ul className="space-y-1">
                {result.missing.map((line, index) => (
                  <li
                    key={index}
                    className="rounded bg-red-50 px-2 py-1 font-mono text-sm text-red-800"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">
              Model answer:
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-700">
              <CodeMirror
                value={question.modelAnswer}
                editable={false}
                theme="dark"
                extensions={[java()]}
                basicSetup={{ lineNumbers: true, foldGutter: false }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50 p-4">
            <p className="text-sm text-indigo-800">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
