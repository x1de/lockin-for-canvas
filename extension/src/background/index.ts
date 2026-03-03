// Background service worker - the SOLE Firebase gateway
// OWNER: Rishi
//
// ARCHITECTURE RULE: This is the ONLY file (along with services it imports)
// that touches Firebase. Content scripts and popup communicate exclusively
// via chrome.runtime.sendMessage -> this worker -> Firebase.
//
// Handles:
// 1. Receiving Canvas data from content script -> Firebase auth
// 2. Status updates from content script -> Firebase write
// 3. Squad operations from popup -> Firebase CRUD
// 4. Nudge requests -> Firebase write + Chrome notification
// 5. Firebase listeners -> broadcast updates to content script / popup

import { initAuth, getCurrentUser } from "../services/auth";
import { writeStatus, listenToSquadStatuses } from "../services/statusSync";
import { sendNudge, subscribeToMyNudges } from "../services/nudges";
import { createSquad, joinSquad } from "../services/squads";
import type { RequestMessage, BroadcastMessage, MemberStatus, Nudge } from "../types";
import { NUDGE_LABELS } from "../types";

// Track active squad subscriptions so we don't duplicate listeners
const activeSubscriptions = new Map<string, () => void>();

// Broadcast a message to all extension contexts (content scripts + popup)
function broadcast(message: BroadcastMessage) {
  chrome.runtime.sendMessage(message).catch(() => {
    // No listeners - that's fine, popup might be closed
  });
  // Also send to all content script tabs
  chrome.tabs.query({ url: "https://*.instructure.com/*" }, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message).catch(() => {});
      }
    }
  });
}

// Handle all incoming messages from content scripts and popup
chrome.runtime.onMessage.addListener((message: RequestMessage, _sender, sendResponse) => {
  handleMessage(message, sendResponse);
  return true; // Keep sendResponse channel open for async
});

async function handleMessage(message: RequestMessage, sendResponse: (response?: unknown) => void) {
  try {
    switch (message.type) {

      case "CANVAS_DATA_SCRAPED": {
        // Content script found Canvas user info -> authenticate with Firebase
        const { canvasUserId, displayName } = message.payload;
        const user = await initAuth(canvasUserId, displayName);
        broadcast({ type: "AUTH_STATE_CHANGED", payload: { user } });

        // Start listening for nudges for this user
        subscribeToMyNudges(user.uid, (nudges: Nudge[]) => {
          const unread = nudges.filter((n) => !n.read);
          for (const nudge of unread) {
            broadcast({ type: "NUDGE_RECEIVED", payload: nudge });
            showNudgeNotification(nudge.fromName, NUDGE_LABELS[nudge.message]);
          }
        });

        sendResponse({ success: true, user });
        break;
      }

      case "ASSIGNMENT_STATUS_CHANGED": {
        // Content script detected a status change -> write to Firebase
        const user = getCurrentUser();
        if (!user) {
          sendResponse({ success: false, error: "Not authenticated" });
          return;
        }
        const { assignmentId, assignmentName, status } = message.payload;
        // TODO: Get current squad ID from chrome.storage or user state
        const squadId = await getActiveSquadId();
        if (squadId) {
          await writeStatus(user.uid, squadId, assignmentId, assignmentName, status);
        }
        sendResponse({ success: true });
        break;
      }

      case "SEND_NUDGE": {
        const user = getCurrentUser();
        if (!user) {
          sendResponse({ success: false, error: "Not authenticated" });
          return;
        }
        const { toUid, squadId, message: nudgeMsg } = message.payload;
        await sendNudge(user.uid, user.displayName, toUid, squadId, nudgeMsg);
        sendResponse({ success: true });
        break;
      }

      case "CREATE_SQUAD": {
        const user = getCurrentUser();
        if (!user) {
          sendResponse({ success: false, error: "Not authenticated" });
          return;
        }
        const squad = await createSquad(message.payload.name, user.uid);

        // Start listening to this squad's statuses
        startSquadListener(squad.id);

        broadcast({ type: "SQUAD_UPDATED", payload: squad });
        sendResponse({ success: true, squad });
        break;
      }

      case "JOIN_SQUAD": {
        const user = getCurrentUser();
        if (!user) {
          sendResponse({ success: false, error: "Not authenticated" });
          return;
        }
        const squad = await joinSquad(message.payload.inviteCode, user.uid);
        if (squad) {
          startSquadListener(squad.id);
          broadcast({ type: "SQUAD_UPDATED", payload: squad });
        }
        sendResponse({ success: !!squad, squad });
        break;
      }

      case "GET_SQUAD_STATUSES": {
        // Ensure we're listening to this squad
        startSquadListener(message.payload.squadId);
        sendResponse({ success: true });
        break;
      }

      case "MARK_NUDGE_READ": {
        const user = getCurrentUser();
        if (user) {
          const { markNudgeRead } = await import("../services/nudges");
          await markNudgeRead(user.uid, message.payload.nudgeId);
        }
        sendResponse({ success: true });
        break;
      }
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    broadcast({ type: "ERROR", payload: { source: message.type, message: errMsg } });
    sendResponse({ success: false, error: errMsg });
  }
}

// Start a Firebase listener for a squad's statuses and broadcast changes
function startSquadListener(squadId: string) {
  if (activeSubscriptions.has(squadId)) return; // Already listening

  const unsubscribe = listenToSquadStatuses(squadId, (statuses) => {
    broadcast({
      type: "SQUAD_STATUSES_UPDATED",
      payload: { squadId, statuses },
    });
  });

  activeSubscriptions.set(squadId, unsubscribe);
}

// Get the user's currently active squad from chrome.storage
async function getActiveSquadId(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get("activeSquadId", (result) => {
      resolve(result.activeSquadId || null);
    });
  });
}

// Show Chrome notification for nudges
function showNudgeNotification(fromName: string, message: string) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon-128.png",
    title: "LockIn - Nudge!",
    message: fromName + ": " + message,
  });
}

console.log("[LockIn] Background service worker loaded - Firebase gateway active");
