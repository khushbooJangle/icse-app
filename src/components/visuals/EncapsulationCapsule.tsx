"use client";

import { motion } from "framer-motion";

// Visual for the "encapsulation = medicine capsule" analogy (encapsulation chapter).
// A capsule shell opens briefly to reveal its raw contents (private data), then closes
// back up - you only ever interact with the capsule as a whole (its public methods),
// not the loose powder directly.

export default function EncapsulationCapsule() {
  return (
    <svg viewBox="0 0 220 130" className="w-full max-w-xs mx-auto" aria-hidden="true">
      {/* loose "powder" dots - only visible when the shell is open */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 3.2, times: [0, 0.45, 0.55, 0.8, 1], repeat: Infinity, repeatDelay: 0.8 }}
      >
        {[[-14, -6], [0, 4], [12, -8], [-6, 8], [16, 6]].map(([dx, dy], i) => (
          <circle key={i} cx={110 + dx} cy={65 + dy} r="3" fill="#F59E0B" />
        ))}
      </motion.g>

      {/* left half of the shell, slides away to "open" then returns */}
      <motion.path
        d="M110 35 a30 30 0 0 0 -30 30 a30 30 0 0 0 30 30 z"
        fill="#8B5CF6"
        initial={{ x: 0 }}
        animate={{ x: [0, 0, -22, -22, 0] }}
        transition={{ duration: 3.2, times: [0, 0.35, 0.5, 0.8, 1], repeat: Infinity, repeatDelay: 0.8 }}
      />
      {/* right half of the shell, slides away to "open" then returns */}
      <motion.path
        d="M110 35 a30 30 0 0 1 30 30 a30 30 0 0 1 -30 30 z"
        fill="#6D28D9"
        initial={{ x: 0 }}
        animate={{ x: [0, 0, 22, 22, 0] }}
        transition={{ duration: 3.2, times: [0, 0.35, 0.5, 0.8, 1], repeat: Infinity, repeatDelay: 0.8 }}
      />

      <text x="110" y="115" textAnchor="middle" fontSize="11" fill="#6B7280">
        private data
      </text>
      <text x="110" y="15" textAnchor="middle" fontSize="12" fill="#111827" fontWeight="600">
        You use the capsule, not the powder
      </text>
    </svg>
  );
}
