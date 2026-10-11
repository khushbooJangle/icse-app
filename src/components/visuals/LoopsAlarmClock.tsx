"use client";

import { motion } from "framer-motion";

// Visual for the "loop = daily alarm clock" analogy (loops chapter). A clock face
// with a hand that sweeps around continuously (the repeating condition, checked
// every "day"), and a bell that rings briefly once per full sweep.
//
// Rotation note: the hand is drawn in ITS OWN local coordinates, pivoting at (0,0),
// then positioned onto the clock face with a plain (non-animated) translate on the
// parent <g>. Rotating a line/rect that ISN'T centred on its own origin is a classic
// Framer Motion SVG trap - originX/originY are fractions of the element's OWN
// bounding box, not the page's coordinates, so "originX: 80px" on a line whose box
// starts at x=80 does not mean what it looks like it means. Keeping the shape's
// local origin AT the pivot point sidesteps the whole problem.

export default function LoopsAlarmClock() {
  return (
    <svg viewBox="0 0 220 150" className="w-full max-w-xs mx-auto" aria-hidden="true">
      <circle cx="80" cy="65" r="50" fill="#FFFFFF" stroke="#6366F1" strokeWidth="4" />
      {/* tick marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 80 + 42 * Math.sin(angle);
        const y1 = 65 - 42 * Math.cos(angle);
        const x2 = 80 + 46 * Math.sin(angle);
        const y2 = 65 - 46 * Math.cos(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6B7280" strokeWidth="2" />;
      })}

      {/* Pivot lives at (80,65) via this plain translate - the hand below is drawn
          from (0,0) to (0,-37), so its own origin IS the pivot. No origin math needed. */}
      <g transform="translate(80,65)">
        <motion.line
          x1="0"
          y1="0"
          x2="0"
          y2="-37"
          stroke="#6366F1"
          strokeWidth="4"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </g>
      <circle cx="80" cy="65" r="4" fill="#6366F1" />

      <text x="80" y="140" textAnchor="middle" fontSize="12" fill="#111827" fontWeight="600">
        &ldquo;Every day at 7am&rdquo; - set once, repeats automatically
      </text>

      {/* bell rings briefly once per sweep (sweep duration is 3s) */}
      <motion.text
        x="150"
        y="35"
        fontSize="20"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.15, 1.15, 0.6] }}
        transition={{ duration: 0.6, delay: 2.7, repeat: Infinity, repeatDelay: 2.4 }}
      >
        🔔
      </motion.text>
    </svg>
  );
}
