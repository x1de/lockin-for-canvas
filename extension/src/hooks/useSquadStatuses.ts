// Custom hook for real-time squad status updates
// OWNER: Devank
//
// Listens to SQUAD_STATUSES_UPDATED broadcasts from the background worker.
// Does NOT import Firebase - all data comes through the message bridge.

import { useState, useEffect } from "react";
import { onBroadcast } from "../services/messageBridge";
import type { MemberStatus, BroadcastMessage } from "../types";

export function useSquadStatuses(squadId: string | null) {
  const [statuses, setStatuses] = useState<MemberStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!squadId) {
      setStatuses([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Ask background to start listening to this squad
    chrome.runtime.sendMessage({
      type: "GET_SQUAD_STATUSES",
      payload: { squadId },
    });

    // Listen for broadcasts from background
    const unsubscribe = onBroadcast((message: BroadcastMessage) => {
      if (
        message.type === "SQUAD_STATUSES_UPDATED" &&
        message.payload.squadId === squadId
      ) {
        setStatuses(Object.values(message.payload.statuses));
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [squadId]);

  return { statuses, loading };
}
