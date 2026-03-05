// Extension popup - squad management hub
// OWNER: Triya
import { useState } from "react";
import { createRoot } from "react-dom/client";
import GroupManager from "../components/GroupManager/GroupManager";
import NudgePanel from "../components/NudgePanel/NudgePanel";

type Tab = "squad" | "nudges" | "settings";

function Popup() {
  const [activeTab, setActiveTab] = useState<Tab>("squad");

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1 className="popup-title">LockIn</h1>
        <p className="popup-subtitle">for Canvas</p>
      </header>

      <nav className="popup-tabs">
        <button
          className={activeTab === "squad" ? "tab active" : "tab"}
          onClick={() => setActiveTab("squad")}
        >
          Squad
        </button>
        <button
          className={activeTab === "nudges" ? "tab active" : "tab"}
          onClick={() => setActiveTab("nudges")}
        >
          Nudges
        </button>
        <button
          className={activeTab === "settings" ? "tab active" : "tab"}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </nav>

      <main className="popup-content">
        {activeTab === "squad" && <GroupManager />}
        {activeTab === "nudges" && <NudgePanel />}
        {activeTab === "settings" && <div>Settings coming soon</div>}
      </main>
    </div>
  );
}

const root = createRoot(document.getElementById("popup-root")!);
root.render(<Popup />);
