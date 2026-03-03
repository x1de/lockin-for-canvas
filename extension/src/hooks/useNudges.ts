// Custom hook for nudge notifications
// OWNER: Devank
//
// Listens to NUDGE_RECEIVED broadcasts from the background worker.
// Does NOT import Firebase - all data comes through the message bridge.

import { useState, useEffect } from "react";
import { onBroadcast, requestMarkNudgeRead } from "../services/messageBridge";
import type { Nudge, BroadcastMessage } from "../types";

export function useNudges() {
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onBroadcast((message: BroadcastMessage) => {
      if (message.type === "NUDGE_RECEIVED") {
        setNudges((prev) => {
          const updated = [message.payload, ...prev.filter((n) => n.id !== message.payload.id)];
          setUnreadCount(updated.filter((n) => !n.read).length);
          return updated;
        });
      }
    });

    return unsubscribe;
  }, []);

  const markRead = (nudgeId: string) => {
    requestMarkNudgeRead(nudgeId);
    setNudges((prev) =>
      prev.map((n) => (n.id === nudgeId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return { nudges, unreadCount, markRead };
}
