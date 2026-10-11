"use client";

import { motion } from "framer-motion";

// Visual for the "String = permanent ink, StringBuffer = pencil and eraser"
// analogy (string-handling chapter) - using the real 🖊️ pen and ✏️ pencil emoji,
// the exact objects the text analogy names, instead of abstract page shapes.

export default function StringHandlingInkPencil() {
  return (
    <svg viewBox="0 0 300 120" className="w-full max-w-sm mx-auto" aria-hidden="true">
      {/* ---- String: pen, old page torn away, fresh page appears ---- */}
      <g transform="translate(55,0)">
        <text x="-35" y="45" textAnchor="middle" fontSize="24">
          🖊️
        </text>

        <motion.rect
          x="-10"
          y="10"
          width="45"
          height="55"
          rx="2"
          fill="#FFFFFF"
          stroke="#3B82F6"
          strokeWidth="2"
          initial={{ opacity: 1, x: 0, rotate: 0 }}
          animate={{ opacity: [1, 1, 0], x: [0, 25, 50], rotate: [0, 15, 25] }}
          transition={{ duration: 2.6, times: [0, 0.5, 0.85], repeat: Infinity }}
        />
        <motion.rect
          x="-10"
          y="10"
          width="45"
          height="55"
          rx="2"
          fill="#FFFFFF"
          stroke="#22C55E"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 1] }}
          transition={{ duration: 2.6, times: [0, 0.55, 0.7, 1], repeat: Infinity }}
        />
        <text x="12" y="90" textAnchor="middle" fontSize="10" fill="#6B7280">
          a fresh page each time
        </text>
        <text x="12" y="103" textAnchor="middle" fontSize="10" fill="#111827" fontWeight="600">
          String (immutable)
        </text>
      </g>

      {/* ---- StringBuffer: pencil edits the SAME page directly ---- */}
      <g transform="translate(215,0)">
        <motion.text
          x="-35"
          textAnchor="middle"
          fontSize="24"
          initial={{ y: 45 }}
          animate={{ y: [45, 45, 30, 30, 45] }}
          transition={{ duration: 2.6, times: [0, 0.3, 0.4, 0.6, 1], repeat: Infinity }}
        >
          ✏️
        </motion.text>

        <rect x="-10" y="10" width="45" height="55" rx="2" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="2" />
        <motion.line
          x1="0"
          x2="25"
          y1="30"
          y2="30"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0, 0, 1, 1] }}
          transition={{ duration: 2.6, times: [0, 0.3, 0.4, 0.6, 1], repeat: Infinity }}
        />

        <text x="12" y="90" textAnchor="middle" fontSize="10" fill="#6B7280">
          same page, edited in place
        </text>
        <text x="12" y="103" textAnchor="middle" fontSize="10" fill="#111827" fontWeight="600">
          StringBuffer (mutable)
        </text>
      </g>
    </svg>
  );
}
