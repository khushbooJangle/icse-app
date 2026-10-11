"use client";

import dynamic from "next/dynamic";
import { java } from "@codemirror/lang-java";

// WHY dynamic({ ssr: false }): CodeMirror measures real DOM elements when it
// mounts, and there is no DOM on the server. Loading it this way tells Next.js
// "only load this in the browser" — otherwise the build crashes.
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl bg-gray-900 p-4 font-mono text-sm text-gray-500">
      loading editor…
    </div>
  ),
});

// Read-only code display for chapter notes. Replaces the old <pre><code>.
export default function CodeBlock({ code }: { code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-700">
      <CodeMirror
        value={code}
        editable={false}
        theme="dark"
        extensions={[java()]}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          autocompletion: false,
          searchKeymap: false,
        }}
      />
    </div>
  );
}
