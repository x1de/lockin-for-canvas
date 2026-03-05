// GroupManager - create/join squads
// OWNER: Triya
import { useState } from "react";

export default function GroupManager() {
  const [mode, setMode] = useState<"menu" | "create" | "join">("menu");
  const [squadName, setSquadName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleCreate = () => {
    // TODO: Call createSquad service
    console.log("Creating squad:", squadName);
  };

  const handleJoin = () => {
    // TODO: Call joinSquad service
    console.log("Joining squad with code:", inviteCode);
  };

  if (mode === "menu") {
    return (
      <div className="group-manager">
        <h3>Your Squads</h3>
        <p>No squads yet. Get started!</p>
        <div className="group-actions">
          <button className="btn-primary" onClick={() => setMode("create")}>
            Create Squad
          </button>
          <button className="btn-secondary" onClick={() => setMode("join")}>
            Join with Code
          </button>
        </div>
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div className="group-manager">
        <button className="btn-back" onClick={() => setMode("menu")}>Back</button>
        <h3>Create a Squad</h3>
        <input
          type="text"
          placeholder="Squad name (e.g. CS301 Study Crew)"
          value={squadName}
          onChange={(e) => setSquadName(e.target.value)}
          className="input-field"
        />
        <button className="btn-primary" onClick={handleCreate}>
          Create
        </button>
      </div>
    );
  }

  return (
    <div className="group-manager">
      <button className="btn-back" onClick={() => setMode("menu")}>Back</button>
      <h3>Join a Squad</h3>
      <input
        type="text"
        placeholder="Enter invite code"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        className="input-field"
      />
      <button className="btn-primary" onClick={handleJoin}>
        Join
      </button>
    </div>
  );
}
