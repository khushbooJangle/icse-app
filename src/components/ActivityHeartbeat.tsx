"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { getSubjectId } from "@/lib/progress";

const TICK_SECONDS = 30;

// Records time-on-task for the parent and tutor dashboards (APP_PLAN 11.4).
//
// THE IMPORTANT PART — it only counts time while the tab is actually in front
// of the student. A tab left open overnight would otherwise report eight hours
// of diligent study. `document.visibilityState` is the browser's own answer to
// "can the user see this right now?", and it flips to "hidden" when the tab is
// switched away from, the window is minimised, or the phone is locked.
//
// Rendered once inside AuthGuard for students, so it runs on every page they
// visit and nowhere else.
export default function ActivityHeartbeat() {
  useEffect(() => {
    let cancelled = false;

    async function tick() {
      // Re-check at the moment of firing, not when the timer was set.
      if (document.visibilityState !== "visible") return;

      const subjectId = await getSubjectId();
      if (!subjectId || cancelled) return;

      // bump_activity adds to whatever is already stored for today, atomically.
      // It runs as the caller, so RLS still restricts it to this student's row.
      const { error } = await supabase.rpc("bump_activity", {
        p_subject_id: subjectId,
        p_seconds: TICK_SECONDS,
      });
      if (error) console.error("heartbeat:", error.message);
    }

    const timer = setInterval(tick, TICK_SECONDS * 1000);

    return () => {
      cancelled = true;
      // Without this, navigating between pages would stack up a new interval
      // each time and multiply the recorded time.
      clearInterval(timer);
    };
  }, []);

  return null; // nothing to draw
}
