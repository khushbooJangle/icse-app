"use client";

import { motion } from "framer-motion";

// Visual for the "class = cookie cutter, object = cookie" analogy (oop-intro chapter).
// The cutter presses into a tray of dough three separate times; each press launches
// a cookie that travels from the press point out to its own resting slot. By the end
// of one cycle all three cookies are sitting side by side - same shape every time,
// different "toppings" (data) each time - then everything resets and repeats.

const CYCLE = 6.5; // total seconds for one full press-press-press-hold-reset loop
const PRESS_TIMES = [0.4, 1.5, 2.6]; // when each press happens, in seconds

const cookies = [
  { restX: 190, fill: "#F59E0B", dots: [[-6, -4], [4, 2], [-2, 6]] },
  { restX: 235, fill: "#F59E0B", dots: [[0, -6], [-5, 3], [5, 3]] },
  { restX: 280, fill: "#F59E0B", dots: [[-4, 4], [4, -4], [0, 0]] },
];

export default function OopCookieCutter() {
  return (
    <svg viewBox="0 0 320 170" className="w-full max-w-sm mx-auto" aria-hidden="true">
      {/* dough tray the cutter presses into */}
      <rect x="30" y="60" width="60" height="18" rx="3" fill="#FDE9C8" stroke="#D9A75C" strokeWidth="1.5" />

      {/* the cutter - presses down into the tray three times per cycle, then rests */}
      <motion.g
        initial={{ y: -22 }}
        animate={{
          y: [-22, -22, 2, -22, -22, 2, -22, -22, 2, -22, -22],
        }}
        transition={{
          duration: CYCLE,
          times: [0, 0.05, 0.09, 0.13, 0.22, 0.26, 0.3, 0.39, 0.43, 0.47, 1],
          repeat: Infinity,
        }}
      >
        <circle cx="60" cy="40" r="24" fill="none" stroke="#6366F1" strokeWidth="5" />
        <rect x="52" y="8" width="16" height="12" rx="3" fill="#6366F1" />
      </motion.g>
      <text x="60" y="100" textAnchor="middle" fontSize="12" fill="#6B7280">
        Class (cutter)
      </text>

      {/* three cookies, each launched from the press point to its own resting slot */}
      {cookies.map((c, i) => (
        <motion.g
          key={i}
          initial={{ x: 60, y: 64, opacity: 0, scale: 0.5 }}
          animate={{
            x: [60, 60, c.restX, c.restX, c.restX],
            y: [64, 64, 64, 64, 64],
            opacity: [0, 1, 1, 1, 1],
            scale: [0.5, 0.9, 1, 1, 1],
          }}
          transition={{
            duration: CYCLE,
            delay: 0,
            times: [
              PRESS_TIMES[i] / CYCLE,
              (PRESS_TIMES[i] + 0.15) / CYCLE,
              (PRESS_TIMES[i] + 0.55) / CYCLE,
              0.95,
              1,
            ],
            repeat: Infinity,
          }}
        >
          <circle r="22" fill={c.fill} stroke="#B45309" strokeWidth="2" />
          {c.dots.map(([dx, dy], j) => (
            <circle key={j} cx={dx} cy={dy} r="2.5" fill="#7C2D12" />
          ))}
        </motion.g>
      ))}
      <text x="235" y="100" textAnchor="middle" fontSize="12" fill="#6B7280">
        Objects (cookies) - same shape, different toppings
      </text>
    </svg>
  );
}
