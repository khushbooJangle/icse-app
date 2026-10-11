// Registry of chapter visuals (infographics / animated SVGs).
//
// HOW TO ADD ONE:
//   1. Create the component, e.g. src/components/visuals/CookieCutter.tsx
//   2. Import it below and add one line to VISUALS:
//        "oop-cookie-cutter": CookieCutter,
//   3. In chapters.ts, put visualId: "oop-cookie-cutter" on the section.
//
// The key is whatever string you use as visualId — keep them descriptive.
// Nothing else in the app needs to change.
//
// Kept as a separate registry (rather than putting components in chapters.ts)
// so the content files stay plain data and can still be replaced wholesale.

import type { ComponentType } from "react";

import OopCookieCutter from "./OopCookieCutter";
import ClassesBlueprintCar from "./ClassesBlueprintCar";
import DataTypesCupJug from "./DataTypesCupJug";
import ArraysLockers from "./ArraysLockers";
import Arrays2dSeatingGrid from "./Arrays2dSeatingGrid";
import LoopsAlarmClock from "./LoopsAlarmClock";
import InheritanceFamilyTraits from "./InheritanceFamilyTraits";
import EncapsulationCapsule from "./EncapsulationCapsule";
import JavaIntroBytecode from "./JavaIntroBytecode";
import OperatorsTernarySignpost from "./OperatorsTernarySignpost";
import MethodsRecipeCard from "./MethodsRecipeCard";
import JavaInputWaiter from "./JavaInputWaiter";
import ConstructorsHotelRoom from "./ConstructorsHotelRoom";
import LibraryClassesGiftBox from "./LibraryClassesGiftBox";
import StringHandlingInkPencil from "./StringHandlingInkPencil";
import ConditionalsGpsFork from "./ConditionalsGpsFork";
import DataStructuresStackQueue from "./DataStructuresStackQueue";

// Every visual is a component that takes no props.
export type VisualComponent = ComponentType;

export const VISUALS: Record<string, VisualComponent> = {
  "oop-cookie-cutter": OopCookieCutter,
  "classes-blueprint-car": ClassesBlueprintCar,
  "data-types-cup-jug": DataTypesCupJug,
  "arrays-lockers": ArraysLockers,
  "arrays-2d-seating-grid": Arrays2dSeatingGrid,
  "loops-alarm-clock": LoopsAlarmClock,
  "inheritance-family-traits": InheritanceFamilyTraits,
  "encapsulation-capsule": EncapsulationCapsule,
  "java-intro-bytecode": JavaIntroBytecode,
  "operators-ternary-signpost": OperatorsTernarySignpost,
  "methods-recipe-card": MethodsRecipeCard,
  "java-input-waiter": JavaInputWaiter,
  "constructors-hotel-room": ConstructorsHotelRoom,
  "library-classes-gift-box": LibraryClassesGiftBox,
  "string-handling-ink-pencil": StringHandlingInkPencil,
  "conditionals-gps-fork": ConditionalsGpsFork,
  "data-structures-stack-queue": DataStructuresStackQueue,
};

// Returns undefined for an unknown id — callers must handle that.
export function getVisual(visualId: string): VisualComponent | undefined {
  return VISUALS[visualId];
}
