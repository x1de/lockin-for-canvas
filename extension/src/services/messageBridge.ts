// Message bridge - SAFE for content scripts and popup
// OWNER: Devank
//
// This is the ONLY way content scripts and popup should communicate
// with Firebase. All calls go through chrome.runtime.sendMessage
// to the background worker, which owns the Firebase connection.
//
// NEVER import firebase.ts, auth.ts, statusSync.ts, squads.ts,
// or nudges.ts directly from content scripts or popup components.
// Use this file instead.

import type {
  AssignmentStatus,
  NudgeMessage,
  CanvasAssignment,
  RequestMessage,
  BroadcastMessage,
} from "../types";

// ---- Outbound: Content Script / Popup -> Background ----

export function reportCanvasUser(canvasUserId: string, displayName: string, assignments: CanvasAssignment[]) {
  chrome.runtime.sendMessage({
    type: "CANVAS_DATA_SCRAPED",
    payload: { canvasUserId, displayName, assignments },
  } satisfies RequestMessage);
}

export function reportStatusChange(assignmentId: string, assignmentName: string, status: AssignmentStatus) {
  chrome.runtime.sendMessage({
    type: "ASSIGNMENT_STATUS_CHANGED",
    payload: { assignmentId, assignmentName, status },
  } satisfies RequestMessage);
}

export function requestSendNudge(toUid: string, squadId: string, message: NudgeMessage) {
  chrome.runtime.sendMessage({
    type: "SEND_NUDGE",
    payload: { toUid, squadId, message },
  } satisfies RequestMessage);
}

export function requestCreateSquad(name: string) {
  chrome.runtime.sendMessage({
    type: "CREATE_SQUAD",
    payload: { name },
  } satisfies RequestMessage);
}

export function requestJoinSquad(inviteCode: string) {
  chrome.runtime.sendMessage({
    type: "JOIN_SQUAD",
    payload: { inviteCode },
  } satisfies RequestMessage);
}

export function requestMarkNudgeRead(nudgeId: string) {
  chrome.runtime.sendMessage({
    type: "MARK_NUDGE_READ",
    payload: { nudgeId },
  } satisfies RequestMessage);
}

// ---- Inbound: Background -> Content Script / Popup ----

export function onBroadcast(callback: (message: BroadcastMessage) => void) {
  const listener = (message: BroadcastMessage) => {
    // Only handle broadcast messages (from background)
    if ("type" in message && message.type.includes("_")) {
      callback(message);
    }
  };
  chrome.runtime.onMessage.addListener(listener);
  return () => chrome.runtime.onMessage.removeListener(listener);
}
