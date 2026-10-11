"use client";

import { motion } from "framer-motion";

// Visual for the "array = row of lockers, index = locker number" analogy (arrays-1d
// chapter). Five lockers numbered 0-4, with a highlight that walks across them one at a
// time to show how an index picks out exactly one locker - and that numbering starts at 0.

const LOCKER_COUNT = 5;
const LOCKER_WIDTH = 48;
const GAP = 10;
const START_X = 20;

export default function ArraysLockers() {
  const totalWidth = LOCKER_COUNT * LOCKER_WIDTH + (LOCKER_COUNT - 1) * GAP + START_X * 2;

  return (
    <svg viewBox={`0 0 ${totalWidth} 120`} className="w-full max-w-md mx-auto" aria-hidden="true">
      {Array.from({ length: LOCKER_COUNT }).map((_, i) => {
        const x = START_X + i * (LOCKER_WIDTH + GAP);
        return (
          <g key={i}>
            <rect x={x} y="15" width={LOCKER_WIDTH} height="60" rx="4" fill="#FFFFFF" stroke="#6B7280" strokeWidth="2" />
            <circle cx={x + LOCKER_WIDTH - 10} cy="45" r="2.5" fill="#6B7280" />
            <text x={x + LOCKER_WIDTH / 2} y="98" textAnchor="middle" fontSize="13" fill="#111827" fontWeight="600">
              arr[{i}]
            </text>
          </g>
        );
      })}

      {/* highlight box that walks from locker 0 to locker 4 and loops back */}
      <motion.rect
        y="15"
        width={LOCKER_WIDTH}
        height="60"
        rx="4"
        fill="none"
        stroke="#6366F1"
        strokeWidth="4"
        initial={{ x: START_X }}
        animate={{
          x: Array.from({ length: LOCKER_COUNT }).map((_, i) => START_X + i * (LOCKER_WIDTH + GAP)),
        }}
        transition={{ duration: LOCKER_COUNT * 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
