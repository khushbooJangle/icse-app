"use client";

import { motion } from "framer-motion";

// Visual for the "Scanner = waiter taking your order" analogy (java-input chapter).
// Keyboard input travels to the waiter, who sends it out as ONE of two possible
// formats depending which method asked - shown one at a time, not simultaneously,
// so it's clear a single order becomes either a number OR a sentence, not both.

export default function JavaInputWaiter() {
  return (
    <svg viewBox="0 0 300 130" className="w-full max-w-sm mx-auto" aria-hidden="true">
      <text x="35" y="65" textAnchor="middle" fontSize="30">
        ⌨️
      </text>
      <text x="35" y="100" textAnchor="middle" fontSize="10" fill="#6B7280">
        you type
      </text>

      {/* the order travelling to the waiter */}
      <motion.text
        textAnchor="middle"
        fontSize="16"
        initial={{ x: 70, opacity: 0 }}
        animate={{ x: [70, 70, 130, 130], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.6, times: [0, 0.15, 0.7, 1], repeat: Infinity, repeatDelay: 2.4 }}
        y="58"
      >
        ✉️
      </motion.text>

      <text x="160" y="65" textAnchor="middle" fontSize="30">
        🤵
      </text>
      <text x="160" y="100" textAnchor="middle" fontSize="10" fill="#6B7280">
        Scanner sc
      </text>

      {/* ONE output at a time - number, then later a sentence, never together */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
        transition={{ duration: 4, times: [0, 0.5, 0.55, 0.72, 0.77, 1], repeat: Infinity }}
      >
        <text x="245" y="50" textAnchor="middle" fontSize="20">
          🔢
        </text>
        <text x="245" y="72" textAnchor="middle" fontSize="9" fill="#6B7280">
          nextInt()
        </text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 1, 1, 0] }}
        transition={{ duration: 4, times: [0, 0.72, 0.77, 0.85, 0.97, 1], repeat: Infinity }}
      >
        <text x="245" y="50" textAnchor="middle" fontSize="20">
          💬
        </text>
        <text x="245" y="72" textAnchor="middle" fontSize="9" fill="#6B7280">
          nextLine()
        </text>
      </motion.g>

      <text x="150" y="120" textAnchor="middle" fontSize="10" fill="#111827" fontWeight="600">
        same order, sorted into the format you asked for
      </text>
    </svg>
  );
}
