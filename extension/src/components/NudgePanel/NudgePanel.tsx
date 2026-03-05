// NudgePanel - send and receive nudges
// OWNER: Triya
import { useState } from "react";
import type { Nudge, NudgeMessage } from "../../types";

const NUDGE_OPTIONS: { key: NudgeMessage; label: string }[] = [
  { key: "lets_lock_in", label: "Let's lock in!" },
  { key: "need_help", label: "Need help?" },
  { key: "almost_there", label: "Almost there!" },
  { key: "you_got_this", label: "You got this!" },
  { key: "start_together", label: "Start together?" },
];

export default function NudgePanel() {
  const [receivedNudges, _setReceivedNudges] = useState<Nudge[]>([]);

  // TODO: Hook up to subscribeToMyNudges

  const handleSendNudge = (toUid: string, message: NudgeMessage) => {
    chrome.runtime.sendMessage({
      type: "SEND_NUDGE",
      payload: { toUid, squadId: "current-squad", message },
    });
  };

  return (
    <div className="nudge-panel">
      <h3>Send a Nudge</h3>
      <div className="nudge-options">
        {NUDGE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            className="nudge-button"
            onClick={() => handleSendNudge("target-uid", opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <h3>Received</h3>
      <div className="nudge-received">
        {receivedNudges.length === 0 ? (
          <p>No nudges yet</p>
        ) : (
          receivedNudges.map((nudge) => (
            <div key={nudge.id} className={nudge.read ? "nudge read" : "nudge unread"}>
              <strong>{nudge.fromName}</strong>: {nudge.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
