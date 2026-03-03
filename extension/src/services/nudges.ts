// Nudge sending and receiving
// OWNER: Devank
import { db } from "./firebase";
import { ref, push, set, onValue, off, update } from "firebase/database";
import type { Nudge, NudgeMessage } from "../types";

export async function sendNudge(
  fromUid: string,
  fromName: string,
  toUid: string,
  squadId: string,
  message: NudgeMessage
): Promise<void> {
  const nudgeRef = push(ref(db, "nudges/" + toUid));
  const nudge: Nudge = {
    id: nudgeRef.key!,
    fromUid,
    fromName,
    toUid,
    squadId,
    message,
    createdAt: Date.now(),
    read: false,
  };
  await set(nudgeRef, nudge);
}

export function subscribeToMyNudges(
  uid: string,
  callback: (nudges: Nudge[]) => void
) {
  const nudgesRef = ref(db, "nudges/" + uid);
  onValue(nudgesRef, (snapshot) => {
    const data = snapshot.val() || {};
    const nudges = Object.values(data) as Nudge[];
    nudges.sort((a, b) => b.createdAt - a.createdAt);
    callback(nudges);
  });
  return () => off(nudgesRef);
}

export async function markNudgeRead(uid: string, nudgeId: string): Promise<void> {
  await update(ref(db, "nudges/" + uid + "/" + nudgeId), { read: true });
}
