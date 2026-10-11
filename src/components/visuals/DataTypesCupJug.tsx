"use client";

import { motion } from "framer-motion";

// Visual for the implicit-vs-explicit type conversion analogy (data-types chapter).
// Left: a small cup pours into a big jug - fits easily, nothing spills (implicit).
// Right: a big jug pours into a small cup - some liquid overflows the top (explicit,
// data can be lost when typecasting a larger type into a smaller one).
//
// Both vessels are drawn already tilted (a fixed, non-animated pose) - only the
// water droplets and the receiving vessel's fill level animate. This avoids
// rotating a shape around a pivot altogether, which is the trickiest thing to
// get right in SVG (see LoopsAlarmClock.tsx for what goes wrong otherwise).

// period = the FULL loop length (duration + repeatDelay). Every animated element
// sharing one scene must use the same period, or they'll drift out of sync with
// each other after the first loop even if they line up perfectly at t=0.
//
// A single small dot moving is easy to miss - it reads as "something flickered",
// not "water is pouring". Drawing a line from the spout to the dot's CURRENT
// position (same timing, same keyframes) turns it into a visible stream with a
// droplet at the leading edge, which is a much clearer "liquid pouring" cue.
function Drop({
  cx,
  cy,
  delay,
  period = 2.3,
  fill = "#3B82F6",
}: {
  cx: [number, number];
  cy: [number, number];
  delay: number;
  period?: number;
  fill?: string;
}) {
  const duration = 0.9;
  const sharedTransition = { duration, delay, repeat: Infinity, repeatDelay: period - duration };
  return (
    <>
      <motion.line
        x1={cx[0]}
        y1={cy[0]}
        stroke={fill}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ x2: cx[0], y2: cy[0], opacity: 0 }}
        animate={{ x2: cx[1], y2: [cy[0], cy[0] - 6, cy[1]], opacity: [0, 0.5, 0.5, 0] }}
        transition={sharedTransition}
      />
      <motion.circle
        r="4.5"
        fill={fill}
        initial={{ cx: cx[0], cy: cy[0], opacity: 0 }}
        animate={{ cx: cx[1], cy: [cy[0], cy[0] - 6, cy[1]], opacity: [0, 1, 1, 0] }}
        transition={sharedTransition}
      />
    </>
  );
}

export default function DataTypesCupJug() {
  return (
    <svg viewBox="0 0 320 130" className="w-full max-w-sm mx-auto" aria-hidden="true">
      {/* ---- Implicit: small cup -> big jug ---- */}
      <g transform="translate(60,0)">
        {/* small cup, drawn already tipped toward the jug - fixed pose, never rotates */}
        <g transform="rotate(-40 -2 30)">
          <rect x="-14" y="18" width="24" height="22" fill="none" stroke="#3B82F6" strokeWidth="2" />
          <rect x="-13" y="23" width="22" height="16" fill="#3B82F6" opacity="0.6" />
        </g>

        {/* big jug receiving, filling up in two steps */}
        <rect x="30" y="15" width="30" height="48" rx="4" fill="none" stroke="#3B82F6" strokeWidth="2" />
        <motion.rect
          x="31"
          width="28"
          rx="3"
          fill="#3B82F6"
          initial={{ height: 6, y: 61 }}
          animate={{ height: [6, 6, 34, 34], y: [61, 61, 29, 29] }}
          transition={{ duration: 2.3, times: [0, 0.3, 0.75, 1], repeat: Infinity }}
        />

        <Drop cx={[8, 34]} cy={[26, 20]} delay={0.3} />
        <Drop cx={[8, 40]} cy={[26, 20]} delay={0.55} />

        <text x="25" y="90" textAnchor="middle" fontSize="11" fill="#22C55E" fontWeight="600">
          fits, nothing lost
        </text>
        <text x="25" y="104" textAnchor="middle" fontSize="10" fill="#6B7280">
          implicit: int → double
        </text>
      </g>

      {/* ---- Explicit: big jug -> small cup, overflow ----
          Sequence, all on one CYCLE so nothing drifts out of sync:
          1. two drops travel jug -> cup, cup fills right up to its rim
          2. the cup FLASHES right when it hits full - the "uh oh, no more room" beat
          3. two MORE drops follow the exact same path but sail straight over the rim,
             landing on the floor line with a little splash - visibly missing the cup
          4. floor puddle fades, cup empties, cycle repeats
      */}
      <g transform="translate(220,0)">
        {/* big jug, drawn already tipped toward the cup - fixed pose, never rotates */}
        <g transform="rotate(-35 -18 28)">
          <rect x="-32" y="10" width="26" height="38" fill="none" stroke="#EF4444" strokeWidth="2" />
          <rect x="-31" y="16" width="24" height="31" fill="#EF4444" opacity="0.55" />
        </g>

        {/* floor line the overflow lands on */}
        <line x1="-6" y1="70" x2="42" y2="70" stroke="#6B7280" strokeWidth="1.5" />

        {/* small cup receiving */}
        <rect x="15" y="35" width="18" height="18" fill="none" stroke="#EF4444" strokeWidth="2" />
        <motion.rect
          x="16"
          width="16"
          fill="#EF4444"
          initial={{ height: 4, y: 51 }}
          animate={{ height: [4, 4, 16, 16, 16, 16], y: [51, 51, 37, 37, 37, 37] }}
          transition={{ duration: 3.4, times: [0, 0.12, 0.32, 0.32, 0.85, 1], repeat: Infinity }}
        />
        {/* the "full!" flash right on the rim, right as filling finishes */}
        <motion.rect
          x="14"
          y="34"
          width="20"
          height="20"
          rx="2"
          fill="none"
          stroke="#EF4444"
          strokeWidth="3"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.9, 0, 0] }}
          transition={{ duration: 3.4, times: [0, 0.32, 0.38, 0.46, 1], repeat: Infinity }}
        />

        {/* first two drops - go INTO the cup while it's still filling.
            period=3.4 to match the cup fill's own 3.4s cycle exactly. */}
        <Drop cx={[-8, 22]} cy={[24, 32]} delay={0.15} period={3.4} fill="#EF4444" />
        <Drop cx={[-8, 28]} cy={[24, 32]} delay={0.35} period={3.4} fill="#EF4444" />

        {/* overflow drops - SAME start point, but sail past the rim to the floor.
            Same "line + dot" trick as Drop() above, sized to match. */}
        <motion.line
          x1="-8"
          y1="24"
          stroke="#EF4444"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ x2: -8, y2: 24, opacity: 0 }}
          animate={{ x2: [-8, 24, 36], y2: [24, 20, 68], opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: 0.9, delay: 1.35, repeat: Infinity, repeatDelay: 2.5 }}
        />
        <motion.circle
          r="4.5"
          fill="#EF4444"
          initial={{ cx: -8, cy: 24, opacity: 0 }}
          animate={{ cx: [-8, 24, 36], cy: [24, 20, 68], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, delay: 1.35, repeat: Infinity, repeatDelay: 2.5 }}
        />
        <motion.line
          x1="-8"
          y1="24"
          stroke="#EF4444"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ x2: -8, y2: 24, opacity: 0 }}
          animate={{ x2: [-8, 24, 30], y2: [24, 20, 68], opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: 0.9, delay: 1.6, repeat: Infinity, repeatDelay: 2.5 }}
        />
        <motion.circle
          r="4.5"
          fill="#EF4444"
          initial={{ cx: -8, cy: 24, opacity: 0 }}
          animate={{ cx: [-8, 24, 30], cy: [24, 20, 68], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, delay: 1.6, repeat: Infinity, repeatDelay: 2.5 }}
        />
        {/* splash where the overflow actually lands */}
        <motion.ellipse
          cx="33"
          cy="70"
          rx="0"
          ry="0"
          fill="#EF4444"
          initial={{ opacity: 0 }}
          animate={{ rx: [0, 7, 0], ry: [0, 2.5, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.5, delay: 2.15, repeat: Infinity, repeatDelay: 2.9 }}
        />

        <text x="12" y="88" textAnchor="middle" fontSize="11" fill="#EF4444" fontWeight="600">
          overflow, data lost
        </text>
        <text x="12" y="102" textAnchor="middle" fontSize="10" fill="#6B7280">
          explicit: (int) someDouble
        </text>
      </g>
    </svg>
  );
}
