// Canvas DOM scraping - extracts assignment data from page
// OWNER: Devank
//
// This runs inside the content script context.
// It reads the Canvas DOM to extract assignment info
// without needing API tokens (Session-Bridge approach).

import type { CanvasAssignment, AssignmentStatus } from "../types";

export function scrapeCurrentUser(): { userId: string; displayName: string } | null {
  // Canvas stores user info in ENV variable on the page
  // Look for window.ENV or specific DOM elements
  try {
    // TODO: Parse ENV.current_user_id and ENV.current_user.display_name from script:not([src])
    // Fallback: scrape from profile link in nav (.ic-app-header__menu-list-item--active a)
    // Placeholder - implement actual scraping
    return null;
  } catch {
    return null;
  }
}

export function scrapeAssignments(): CanvasAssignment[] {
  // Scrape assignment list from the assignments page DOM
  // Look for .assignment elements or the planner API
  const assignments: CanvasAssignment[] = [];
  // TODO: Implement DOM scraping for:
  // - Assignment ID (from data attributes or href)
  // - Assignment name
  // - Due date
  // - Submission status
  // - Course name
  return assignments;
}

export function detectCurrentAssignmentStatus(): AssignmentStatus {
  // Detect what the user is doing on the current page
  const url = window.location.href;

  if (url.includes("/assignments/") && url.includes("/submissions/")) {
    return "submitted";
  }
  if (url.includes("/assignments/")) {
    // Check if there is a text editor with content
    const editor = document.querySelector(".tox-editor-container, .ic-RichContentEditor");
    if (editor) return "drafting";
    return "viewing";
  }
  return "not_started";
}
