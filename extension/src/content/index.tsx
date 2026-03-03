// Content script - injected into Canvas pages
// OWNER: Devank
//
// Responsibilities:
// 1. Scrape Canvas user info + assignment data
// 2. Detect assignment status changes
// 3. Inject the SquadBar UI component into the Canvas sidebar

import React from "react";
import { createRoot } from "react-dom/client";
import { scrapeCurrentUser, detectCurrentAssignmentStatus } from "../services/canvasParser";
import SquadBar from "../components/SquadBar/SquadBar";

function init() {
  console.log("[LockIn] Content script loaded on Canvas");

  // 1. Scrape user identity
  const user = scrapeCurrentUser();
  if (user) {
    chrome.runtime.sendMessage({
      type: "CANVAS_DATA_SCRAPED",
      payload: [],
    });
  }

  // 2. Inject SquadBar into Canvas sidebar
  injectSquadBar();

  // 3. Set up mutation observer for status changes
  observeStatusChanges();
}

function injectSquadBar() {
  // Find Canvas sidebar or create our own container
  const sidebar = document.getElementById("right-side") || document.body;
  const container = document.createElement("div");
  container.id = "lockin-squadbar-root";
  sidebar.prepend(container);

  const root = createRoot(container);
  root.render(<SquadBar />);
}

function observeStatusChanges() {
  // Watch for DOM changes that indicate status transitions
  // e.g., file upload, text entry, form submission
  const observer = new MutationObserver(() => {
    const status = detectCurrentAssignmentStatus();
    chrome.runtime.sendMessage({
      type: "ASSIGNMENT_STATUS_CHANGED",
      payload: {
        assignmentId: extractAssignmentId(),
        status,
      },
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
}

function extractAssignmentId(): string {
  // Extract assignment ID from URL: /courses/123/assignments/456
  const match = window.location.pathname.match(/assignments\/(\d+)/);
  return match ? match[1] : "unknown";
}

// Run on page load
init();
