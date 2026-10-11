"use client";

import { motion } from "framer-motion";

// Visual for the "ternary operator = road sign with two arrows" analogy (operators
// chapter). Same road-fork layout as the conditionals visual (that one reads clearly),
// but with a car emoji making a quick, one-glance choice - no "thinking" pause, since
// a ternary is meant to be a single condensed glance, not a fuller decision.

export default function OperatorsTernarySignpost() {
  return (
    <svg viewBox="0 0 260 150" className="w-full max-w-sm mx-auto" aria-hidden="true">
      <path d="M130 130 L130 80 L70 30" stroke="#D1D5DB" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M130 80 L190 30" stroke="#D1D5DB" strokeWidth="10" fill="none" strokeLinecap="round" />

      <text x="70" y="20" textAnchor="middle" fontSize="9" fill="#6B7280">
        value a
      </text>
      <text x="190" y="20" textAnchor="middle" fontSize="9" fill="#6B7280">
        value b
      </text>
      <text x="130" y="105" textAnchor="middle" fontSize="10" fill="#111827" fontWeight="600">
        cond ? a : b
      </text>

      {/* the car travels the bent road (start -> fork -> end), holds, blinks back to
          the fork while invisible, then travels the OTHER branch - a single glance
          decision each time, not a paused "thinking" beat */}
      <motion.text
        textAnchor="middle"
        fontSize="20"
        initial={{ x: 130, y: 130, opacity: 1 }}
        animate={{
          x: [130, 130, 70, 70, 130, 130, 190, 190, 190, 130, 130, 130],
          y: [130, 80, 30, 30, 80, 80, 30, 30, 30, 130, 130, 130],
          opacity: [1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1],
        }}
        transition={{
          duration: 6,
          times: [0, 0.13, 0.3, 0.42, 0.46, 0.5, 0.67, 0.79, 0.83, 0.83, 0.87, 1],
          repeat: Infinity,
        }}
      >
        🚗
      </motion.text>
    </svg>
  );
}
