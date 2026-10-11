"use client";

import { motion } from "framer-motion";

// Visual for the "bytecode = universal instruction sheet" analogy (java-intro chapter).
// Uses real emoji instead of abstract boxes so it reads instantly: one code file
// becomes one bytecode scroll, and that SAME scroll runs on three different kinds
// of device - "write once, run anywhere".

export default function JavaIntroBytecode() {
  return (
    <svg viewBox="0 0 320 130" className="w-full max-w-md mx-auto" aria-hidden="true">
      <text x="30" y="65" textAnchor="middle" fontSize="30">
        📄
      </text>
      <text x="30" y="95" textAnchor="middle" fontSize="10" fill="#6B7280">
        Main.java
      </text>

      <motion.text
        x="115"
        y="65"
        textAnchor="middle"
        fontSize="24"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.3, 1, 1] }}
        transition={{ duration: 4, times: [0, 0.15, 0.3, 1], repeat: Infinity }}
      >
        📜
      </motion.text>
      <text x="115" y="95" textAnchor="middle" fontSize="10" fill="#6B7280">
        bytecode (one copy)
      </text>

      {[
        { x: 210, icon: "💻", label: "Windows" },
        { x: 260, icon: "🖥️", label: "Mac" },
        { x: 310, icon: "📱", label: "phone" },
      ].map((d, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.3, 1, 1] }}
          transition={{ duration: 4, times: [0, 0.35 + i * 0.08, 0.5 + i * 0.08, 1], repeat: Infinity }}
        >
          <text x={d.x} y="65" textAnchor="middle" fontSize="26">
            {d.icon}
          </text>
          <text x={d.x} y="95" textAnchor="middle" fontSize="9" fill="#6B7280">
            {d.label}
          </text>
        </motion.g>
      ))}

      <text x="160" y="120" textAnchor="middle" fontSize="11" fill="#111827" fontWeight="600">
        same bytecode, runs on every device
      </text>
    </svg>
  );
}
