"use client";

import { motion } from "framer-motion";

// Visual for the "if-else = GPS at a fork" analogy (conditionals chapter). A GPS
// pin checks a condition (traffic on route A?) and re-routes down whichever path
// matches - unlike the ternary's one-glance sign, this is a fuller decision with
// a visible "checking..." beat before committing to a path.

export default function ConditionalsGpsFork() {
  return (
    <svg viewBox="0 0 260 160" className="w-full max-w-sm mx-auto" aria-hidden="true">
      <path d="M130 130 L130 80 L70 30" stroke="#D1D5DB" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M130 80 L190 30" stroke="#D1D5DB" strokeWidth="10" fill="none" strokeLinecap="round" />

      <text x="70" y="20" textAnchor="middle" fontSize="9" fill="#6B7280">
        route A (traffic)
      </text>
      <text x="190" y="20" textAnchor="middle" fontSize="9" fill="#6B7280">
        route B (clear)
      </text>

      {/* GPS pin "thinking" at the fork before committing */}
      <motion.text
        x="130"
        y="72"
        textAnchor="middle"
        fontSize="18"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.2, times: [0, 0.2, 0.7, 1], delay: 0.9, repeat: Infinity, repeatDelay: 4.6 }}
      >
        🤔
      </motion.text>

      {/* the car - checks, then commits to route B (the "else" branch) this time */}
      <motion.g
        initial={{ x: 130, y: 130 }}
        animate={{ x: [130, 130, 130, 190, 190], y: [130, 80, 80, 30, 30] }}
        transition={{ duration: 5.8, times: [0, 0.19, 0.36, 0.55, 1], repeat: Infinity }}
      >
        <circle r="8" fill="#F59E0B" />
        <text y="4" textAnchor="middle" fontSize="10">
          📍
        </text>
      </motion.g>

      <text x="130" y="148" textAnchor="middle" fontSize="10" fill="#111827" fontWeight="600">
        check condition, then pick one path
      </text>
    </svg>
  );
}
