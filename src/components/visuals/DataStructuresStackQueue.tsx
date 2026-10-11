"use client";

import { motion } from "framer-motion";

// Visual for the stack (LIFO - pile of plates) and queue (FIFO - ticket line)
// analogies (data-structures bonus chapter). Left: a plate is pushed onto the
// TOP of the pile, then popped back off the TOP. Right: a person joins the BACK
// of the line, and the person at the FRONT leaves first.

export default function DataStructuresStackQueue() {
  return (
    <svg viewBox="0 0 300 150" className="w-full max-w-sm mx-auto" aria-hidden="true">
      {/* ---- Stack: push/pop from the top only ---- */}
      <g transform="translate(65,0)">
        {[0, 1, 2].map((i) => (
          <rect key={i} x="-30" y={85 - i * 14} width="60" height="10" rx="4" fill="#8B5CF6" opacity={0.5 + i * 0.15} />
        ))}
        {/* the 4th plate - pushed onto the top, then popped back off */}
        <motion.rect
          x="-30"
          width="60"
          height="10"
          rx="4"
          fill="#8B5CF6"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: [10, 43, 43, 10], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, times: [0, 0.3, 0.7, 1], repeat: Infinity }}
        />
        <text x="0" y="115" textAnchor="middle" fontSize="10" fill="#6B7280">
          push / pop from TOP only
        </text>
        <text x="0" y="130" textAnchor="middle" fontSize="11" fill="#111827" fontWeight="600">
          Stack - LIFO
        </text>
      </g>

      {/* ---- Queue: join at the back, leave from the front ---- */}
      <g transform="translate(220,0)">
        <rect x="-40" y="55" width="90" height="20" rx="4" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeDasharray="3 3" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-25 + i * 20} cy="65" r="8" fill="#3B82F6" />
        ))}
        {/* new person joining at the back */}
        <motion.circle
          cy="65"
          r="8"
          fill="#3B82F6"
          initial={{ cx: 60, opacity: 0 }}
          animate={{ cx: [60, 35, 35, 35], opacity: [0, 1, 1, 1] }}
          transition={{ duration: 3, times: [0, 0.25, 0.4, 0.6], repeat: Infinity }}
        />
        {/* front person leaving */}
        <motion.circle
          cy="65"
          r="8"
          fill="#22C55E"
          initial={{ cx: -25, opacity: 1 }}
          animate={{ cx: [-25, -25, -55], opacity: [1, 1, 0] }}
          transition={{ duration: 3, times: [0, 0.6, 0.85], repeat: Infinity }}
        />
        <text x="0" y="115" textAnchor="middle" fontSize="10" fill="#6B7280">
          join at BACK, leave from FRONT
        </text>
        <text x="0" y="130" textAnchor="middle" fontSize="11" fill="#111827" fontWeight="600">
          Queue - FIFO
        </text>
      </g>
    </svg>
  );
}
