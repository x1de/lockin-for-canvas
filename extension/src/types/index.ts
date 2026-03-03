// Core domain types for LockIn

export type AssignmentStatus =
  | "not_started"
  | "viewing"
  | "in_progress"
  | "drafting"
  | "submitted";

export interface User {
  uid: string;
  displayName: string;
  canvasUserId: string;
  avatarUrl?: string;
  lastActive: number; // timestamp
}

export interface Squad {
  id: string;
  name: string;
  memberIds: string[];
  createdBy: string;
  inviteCode: string;
  createdAt: number;
}

export interface MemberStatus {
  uid: string;
  displayName: string;
  assignmentId: string;
  assignmentName: string;
  status: AssignmentStatus;
  updatedAt: number;
}

export interface Nudge {
  id: string;
  fromUid: string;
  fromName: string;
  toUid: string;
  squadId: string;
  message: NudgeMessage;
  createdAt: number;
  read: boolean;
}

export type NudgeMessage =
  | "lets_lock_in"
  | "need_help"
  | "almost_there"
  | "you_got_this"
  | "start_together";

export const NUDGE_LABELS: Record<NudgeMessage, string> = {
  lets_lock_in: "Let's lock in!",
  need_help: "Need help?",
  almost_there: "Almost there!",
  you_got_this: "You got this!",
  start_together: "Start together?",
};

// ---- Message Protocol ----
// ALL Firebase writes go through the background service worker.
// Content script and popup NEVER import Firebase directly.
// Flow: ContentScript/Popup -> chrome.runtime.sendMessage -> Background -> Firebase
//       Firebase -> Background -> chrome.runtime.sendMessage -> ContentScript/Popup

// Messages FROM content script / popup TO background worker
export type RequestMessage =
  | { type: "CANVAS_DATA_SCRAPED"; payload: { canvasUserId: string; displayName: string; assignments: CanvasAssignment[] } }
  | { type: "ASSIGNMENT_STATUS_CHANGED"; payload: { assignmentId: string; assignmentName: string; status: AssignmentStatus } }
  | { type: "SEND_NUDGE"; payload: { toUid: string; squadId: string; message: NudgeMessage } }
  | { type: "CREATE_SQUAD"; payload: { name: string } }
  | { type: "JOIN_SQUAD"; payload: { inviteCode: string } }
  | { type: "GET_SQUAD_STATUSES"; payload: { squadId: string } }
  | { type: "MARK_NUDGE_READ"; payload: { nudgeId: string } };

// Messages FROM background worker TO content script / popup
export type BroadcastMessage =
  | { type: "AUTH_STATE_CHANGED"; payload: { user: User | null } }
  | { type: "SQUAD_STATUSES_UPDATED"; payload: { squadId: string; statuses: Record<string, MemberStatus> } }
  | { type: "NUDGE_RECEIVED"; payload: Nudge }
  | { type: "SQUAD_UPDATED"; payload: Squad }
  | { type: "ERROR"; payload: { source: string; message: string } };

// Union type for the message listener
export type ExtensionMessage = RequestMessage | BroadcastMessage;

export interface CanvasAssignment {
  id: string;
  name: string;
  dueAt: string | null;
  courseId: string;
  courseName: string;
  submitted: boolean;
  url: string;
}
