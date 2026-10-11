"use client";

import { motion } from "framer-motion";

// Visual for the "method = recipe card" analogy (methods chapter). One recipe
// (📋) sits fixed on the left, written once. A finger presses "call" three
// separate times, and each press produces its own dish - real food emoji so
// it's obvious these are 3 different results from calling the SAME recipe.

export default function MethodsRecipeCard() {
  return (
    <svg viewBox="0 0 320 140" className="w-full max-w-sm mx-auto" aria-hidden="true">
      <text x="40" y="65" textAnchor="middle" fontSize="34">
        📋
      </text>
      <text x="40" y="100" textAnchor="middle" fontSize="10" fill="#6B7280">
        the method (written once)
      </text>

      {/* a finger presses "call" 3 separate times, one per dish */}
      {[0, 1, 2].map((i) => (
        <motion.text
          key={i}
          x="140"
          y="65"
          textAnchor="middle"
          fontSize="22"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.35, delay: 0.5 + i * 1.3, repeat: Infinity, repeatDelay: 3.9 - 0.35 }}
        >
          👆
        </motion.text>
      ))}
      <text x="140" y="100" textAnchor="middle" fontSize="10" fill="#6B7280">
        call() x3
      </text>

      {/* three dishes, one appearing right after each press - all sharing the
          SAME period as the presses above so nothing drifts out of sync */}
      {[
        { x: 220, icon: "🍪", times: [0, 0.14, 0.22, 1] },
        { x: 260, icon: "🧁", times: [0, 0.47, 0.55, 1] },
        { x: 300, icon: "🍰", times: [0, 0.8, 0.88, 1] },
      ].map((d, i) => (
        <motion.text
          key={i}
          x={d.x}
          y="65"
          textAnchor="middle"
          fontSize="26"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0, 1, 1], scale: [0.5, 0.5, 1, 1] }}
          transition={{ duration: 3.9, times: d.times, repeat: Infinity }}
        >
          {d.icon}
        </motion.text>
      ))}
      <text x="260" y="100" textAnchor="middle" fontSize="10" fill="#6B7280">
        same recipe, 3 results
      </text>
    </svg>
  );
}
