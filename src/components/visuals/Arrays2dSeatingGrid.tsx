"use client";

import { motion } from "framer-motion";

// Visual for the "2D array = classroom seating plan" analogy (arrays-2d chapter).
// A 3x3 grid of seats, labelled by row/column. A highlighted seat moves to a few
// different [row][col] positions in sequence, showing that BOTH numbers together
// pinpoint exactly one seat.

const ROWS = 3;
const COLS = 3;
const SEAT = 42;
const GAP = 8;
const ORIGIN_X = 46;
const ORIGIN_Y = 20;

// sequence of [row, col] the highlight visits
const path: [number, number][] = [
  [0, 0],
  [0, 2],
  [1, 1],
  [2, 0],
  [2, 2],
];

function seatX(col: number) {
  return ORIGIN_X + col * (SEAT + GAP);
}
function seatY(row: number) {
  return ORIGIN_Y + row * (SEAT + GAP);
}

export default function Arrays2dSeatingGrid() {
  const width = ORIGIN_X + COLS * (SEAT + GAP) + 10;
  const height = ORIGIN_Y + ROWS * (SEAT + GAP) + 30;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-sm mx-auto" aria-hidden="true">
      {/* column labels */}
      {Array.from({ length: COLS }).map((_, c) => (
        <text key={c} x={seatX(c) + SEAT / 2} y={ORIGIN_Y - 6} textAnchor="middle" fontSize="11" fill="#6B7280">
          col {c}
        </text>
      ))}
      {/* row labels */}
      {Array.from({ length: ROWS }).map((_, r) => (
        <text key={r} x={ORIGIN_X - 12} y={seatY(r) + SEAT / 2 + 4} textAnchor="end" fontSize="11" fill="#6B7280">
          row {r}
        </text>
      ))}

      {Array.from({ length: ROWS }).map((_, r) =>
        Array.from({ length: COLS }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={seatX(c)}
            y={seatY(r)}
            width={SEAT}
            height={SEAT}
            rx="5"
            fill="#FFFFFF"
            stroke="#6B7280"
            strokeWidth="1.5"
          />
        ))
      )}

      {/* the highlighted seat, hopping between positions in `path` */}
      <motion.rect
        width={SEAT}
        height={SEAT}
        rx="5"
        fill="#8B5CF6"
        opacity="0.85"
        initial={{ x: seatX(path[0][1]), y: seatY(path[0][0]) }}
        animate={{
          x: path.map(([, c]) => seatX(c)),
          y: path.map(([r]) => seatY(r)),
        }}
        transition={{ duration: path.length * 1.1, repeat: Infinity, ease: "easeInOut" }}
      />

      <text x={width / 2} y={height - 4} textAnchor="middle" fontSize="12" fill="#6B7280">
        arr[row][col] - both numbers pinpoint one seat
      </text>
    </svg>
  );
}
