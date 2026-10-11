"use client";

import { motion } from "framer-motion";

// Visual for the "inheritance = inheriting traits from parents" analogy (inheritance
// chapter). A parent node has two traits; arrows carry both traits DOWN into the child
// node automatically, and the child also grows one extra trait of its own that the
// parent never had - same idea as a subclass inheriting a parent class plus adding more.

export default function InheritanceFamilyTraits() {
  return (
    <svg viewBox="0 0 260 185" className="w-full max-w-sm mx-auto" aria-hidden="true">
      {/* parent */}
      <circle cx="130" cy="30" r="26" fill="#3B82F6" opacity="0.9" />
      <text x="130" y="35" textAnchor="middle" fontSize="11" fill="#FFFFFF" fontWeight="600">
        Parent
      </text>
      <text x="130" y="62" textAnchor="middle" fontSize="10" fill="#6B7280">
        height, eye colour
      </text>

      {/* two traits travelling down as small dots along the connecting line */}
      {[0, 1].map((i) => (
        <motion.circle
          key={i}
          r="5"
          fill={i === 0 ? "#3B82F6" : "#8B5CF6"}
          initial={{ cx: 130, cy: 56, opacity: 0 }}
          animate={{ cx: 130, cy: [56, 120], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.4, delay: 0.6 + i * 0.3, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}

      {/* connecting line */}
      <line x1="130" y1="56" x2="130" y2="118" stroke="#6B7280" strokeWidth="2" strokeDasharray="4 3" />

      {/* child */}
      <circle cx="130" cy="140" r="26" fill="#22C55E" opacity="0.9" />
      <text x="130" y="145" textAnchor="middle" fontSize="11" fill="#FFFFFF" fontWeight="600">
        Child
      </text>

      {/* the child's own extra trait, appearing after the inherited ones arrive */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
        transition={{ duration: 1.6, delay: 2.2, repeat: Infinity, repeatDelay: 2 }}
      >
        <circle cx="185" cy="140" r="12" fill="#F59E0B" />
        <text x="185" y="144" textAnchor="middle" fontSize="9" fill="#FFFFFF" fontWeight="700">
          +
        </text>
      </motion.g>
      <text x="130" y="172" textAnchor="middle" fontSize="10" fill="#6B7280">
        inherited traits + one trait of its own
      </text>
    </svg>
  );
}
