"use client";

import { motion } from "framer-motion";

// Visual for the "wrapper class = gift box" analogy (library-classes chapter).
// A plain number 5 turns into an actual gift box (boxing), then back into the
// plain number (unboxing) - using the real 🎁 emoji so "gift box" doesn't need
// explaining, it just IS one.

export default function LibraryClassesGiftBox() {
  return (
    <svg viewBox="0 0 260 130" className="w-full max-w-xs mx-auto" aria-hidden="true">
      {/* the plain value, visible when NOT boxed */}
      <motion.g
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0, 0, 1, 1] }}
        transition={{ duration: 4.4, times: [0, 0.18, 0.25, 0.7, 0.78, 1], repeat: Infinity }}
      >
        <circle cx="40" cy="55" r="20" fill="#3B82F6" />
        <text x="40" y="61" textAnchor="middle" fontSize="16" fill="#FFFFFF" fontWeight="700">
          5
        </text>
      </motion.g>
      <text x="40" y="95" textAnchor="middle" fontSize="10" fill="#6B7280">
        int
      </text>

      <text x="130" y="30" textAnchor="middle" fontSize="9" fill="#6B7280">
        boxing →
      </text>
      <text x="130" y="95" textAnchor="middle" fontSize="9" fill="#6B7280">
        ← unboxing
      </text>

      {/* the actual gift box - closed most of the time, opens briefly to show the same 5 inside */}
      <motion.text
        x="212"
        y="65"
        textAnchor="middle"
        fontSize="34"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0, 0, 1, 1] }}
        transition={{ duration: 4.4, times: [0, 0.25, 0.32, 0.62, 0.7, 1], repeat: Infinity }}
      >
        🎁
      </motion.text>
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
        transition={{ duration: 4.4, times: [0, 0.28, 0.35, 0.58, 0.65, 1], repeat: Infinity }}
      >
        <circle cx="212" cy="55" r="18" fill="#3B82F6" />
        <text x="212" y="61" textAnchor="middle" fontSize="15" fill="#FFFFFF" fontWeight="700">
          5
        </text>
      </motion.g>
      <text x="212" y="95" textAnchor="middle" fontSize="10" fill="#6B7280">
        Integer
      </text>
    </svg>
  );
}
