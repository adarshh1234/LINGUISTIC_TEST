"use client";

import { useEffect, useRef } from "react";
import { useCandidateTestStore } from "@/store/candidate-test-store";

export function useIntegrityMonitor({
  enabled = true,
  blockCopyPaste = true,
}: {
  enabled?: boolean;
  blockCopyPaste?: boolean;
}) {
  const logEvent = useCandidateTestStore((s) => s.logCandidateIntegrityEvent);
  const blurStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        blurStartRef.current = Date.now();
      } else {
        if (blurStartRef.current) {
          const duration = Math.round((Date.now() - blurStartRef.current) / 1000);
          if (duration >= 2) {
            logEvent(
              "TAB_BLUR_DETECTED",
              duration > 15 ? "HIGH" : "MEDIUM",
              `Candidate switched tabs or minimized test window for ${duration} seconds.`,
              { durationSeconds: duration }
            );
          }
          blurStartRef.current = null;
        }
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      if (!blockCopyPaste) return;
      e.preventDefault();
      const pasted = e.clipboardData?.getData("text") || "";
      logEvent(
        "CLIPBOARD_INTERCEPTED",
        "HIGH",
        `External paste attempt intercepted (${pasted.length} characters blocked).`,
        { characterLength: pasted.length }
      );
    };

    const handleOffline = () => {
      logEvent(
        "NETWORK_DISCONNECTED",
        "LOW",
        "Client network connection interrupted.",
        { timestamp: new Date().toISOString() }
      );
    };

    const handleOnline = () => {
      logEvent(
        "NETWORK_RECONNECTED",
        "LOW",
        "Client network connection successfully restored.",
        { timestamp: new Date().toISOString() }
      );
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("paste", handlePaste);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("paste", handlePaste);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [enabled, blockCopyPaste, logEvent]);
}

