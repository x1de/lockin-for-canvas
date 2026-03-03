// Real-time status synchronization - BACKGROUND WORKER ONLY
// OWNER: Rishi (Firebase writes) + Devank (sync logic)
//
// WARNING: This file imports Firebase directly.
// It must ONLY be imported by background/index.ts.
// Content scripts and popup use chrome.runtime.sendMessage instead.

import { db } from "./firebase";
import { ref, set, onValue, off } from "firebase/database";
import type { AssignmentStatus, MemberStatus } from "../types";

export function writeStatus(
  uid: string,
  squadId: string,
  assignmentId: string,
  assignmentName: string,
  status: AssignmentStatus
): Promise<void> {
  const statusRef = ref(db, "status/" + squadId + "/" + uid);
  return set(statusRef, {
    uid,
    assignmentId,
    assignmentName,
    status,
    updatedAt: Date.now(),
  } satisfies Omit<MemberStatus, "displayName">);
}

export function listenToSquadStatuses(
  squadId: string,
  callback: (statuses: Record<string, MemberStatus>) => void
) {
  const statusRef = ref(db, "status/" + squadId);
  onValue(statusRef, (snapshot) => {
    callback((snapshot.val() as Record<string, MemberStatus>) || {});
  });
  return () => off(statusRef);
}
