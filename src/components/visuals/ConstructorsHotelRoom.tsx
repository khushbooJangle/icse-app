"use client";

import { motion } from "framer-motion";

// Visual for the "constructor = hotel room prepping on check-in" analogy
// (constructors chapter). A guest walks up to the door; the moment they arrive,
// the bed, towel, and light all appear automatically - nobody asked for each
// one separately. Real icons instead of abstract boxes so each item is obvious
// at a glance.

export default function ConstructorsHotelRoom() {
  return (
    <svg viewBox="0 0 260 150" className="w-full max-w-xs mx-auto" aria-hidden="true">
      <rect x="90" y="20" width="130" height="95" rx="6" fill="#FFFFFF" stroke="#6366F1" strokeWidth="2" />
      <text x="155" y="34" textAnchor="middle" fontSize="9" fill="#6366F1" fontWeight="600">
        Room (object)
      </text>

      {/* bed, towel, light - each appears the instant the guest arrives */}
      <motion.text
        x="120"
        y="80"
        textAnchor="middle"
        fontSize="26"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{ duration: 4, times: [0, 0.32, 0.4, 1], repeat: Infinity }}
      >
        🛏️
      </motion.text>
      <text x="120" y="105" textAnchor="middle" fontSize="8" fill="#6B7280">
        bed made
      </text>

      <motion.text
        x="160"
        y="80"
        textAnchor="middle"
        fontSize="24"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{ duration: 4, times: [0, 0.34, 0.42, 1], repeat: Infinity }}
      >
        🧺
      </motion.text>
      <text x="160" y="105" textAnchor="middle" fontSize="8" fill="#6B7280">
        towel
      </text>

      <motion.text
        x="195"
        y="78"
        textAnchor="middle"
        fontSize="22"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{ duration: 4, times: [0, 0.36, 0.44, 1], repeat: Infinity }}
      >
        💡
      </motion.text>
      <text x="195" y="105" textAnchor="middle" fontSize="8" fill="#6B7280">
        light on
      </text>

      {/* the guest walking up to the door - triggers everything above on arrival */}
      <motion.text
        y="75"
        textAnchor="middle"
        fontSize="26"
        initial={{ x: 20 }}
        animate={{ x: [20, 20, 65, 65] }}
        transition={{ duration: 4, times: [0, 0.1, 0.3, 1], repeat: Infinity }}
      >
        🧍
      </motion.text>
      <text x="45" y="135" textAnchor="middle" fontSize="10" fill="#111827" fontWeight="600">
        new Room() - everything sets up at once
      </text>
    </svg>
  );
}
