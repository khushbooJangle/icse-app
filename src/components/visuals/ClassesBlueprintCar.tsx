"use client";

import { motion } from "framer-motion";

// Visual for the "class = car blueprint, object = actual car" analogy (classes-objects
// chapter). A dashed blueprint outline sits still on the left. Three solid, differently
// coloured cars drive out from it one after another and park side by side on the
// right - built from the same design, but each with its own colour (its own data).
// Cars are staggered wide enough apart that they never overlap mid-drive, and all
// three sit parked together for a beat before the cycle resets.

const CYCLE = 5.5;
const START_TIMES = [0.3, 1.5, 2.7]; // each car leaves well after the previous one arrives
const DRIVE_DURATION = 1.0;
const PARK_X = [175, 225, 275]; // distinct resting spot for each car

function CarShape({ fill }: { fill: string }) {
  return (
    <g>
      <rect x="-22" y="-8" width="44" height="16" rx="6" fill={fill} />
      <rect x="-13" y="-18" width="26" height="14" rx="5" fill={fill} />
      <circle cx="-12" cy="10" r="6" fill="#111827" />
      <circle cx="12" cy="10" r="6" fill="#111827" />
    </g>
  );
}

const carColors = ["#3B82F6", "#EF4444", "#22C55E"];

export default function ClassesBlueprintCar() {
  return (
    <svg viewBox="0 0 320 140" className="w-full max-w-sm mx-auto" aria-hidden="true">
      {/* Blueprint - dashed outline, never moves */}
      <g transform="translate(55,55)">
        <rect x="-22" y="-8" width="44" height="16" rx="6" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 3" />
        <rect x="-13" y="-18" width="26" height="14" rx="5" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="-12" cy="10" r="6" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="12" cy="10" r="6" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 2" />
      </g>
      <text x="55" y="100" textAnchor="middle" fontSize="12" fill="#6B7280">
        Class (blueprint)
      </text>

      {carColors.map((fill, i) => {
        const startFrac = START_TIMES[i] / CYCLE;
        const arriveFrac = (START_TIMES[i] + DRIVE_DURATION) / CYCLE;
        return (
          <motion.g
            key={i}
            initial={{ x: 55, y: 55, opacity: 0 }}
            animate={{
              x: [55, 55, PARK_X[i], PARK_X[i]],
              y: [55, 55, 55, 55],
              opacity: [0, 1, 1, 1],
            }}
            transition={{
              duration: CYCLE,
              times: [startFrac, startFrac, arriveFrac, 1],
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            <CarShape fill={fill} />
          </motion.g>
        );
      })}
      <text x="225" y="100" textAnchor="middle" fontSize="12" fill="#6B7280">
        Objects - same design, different colours
      </text>
    </svg>
  );
}
