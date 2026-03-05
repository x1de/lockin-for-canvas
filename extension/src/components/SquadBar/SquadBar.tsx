// SquadBar - injected into Canvas sidebar, shows squad status
// OWNER: Triya
import { useState } from "react";
import StatusBadge from "../StatusBadge/StatusBadge";
import type { MemberStatus } from "../../types";

export default function SquadBar() {
  const [members, _setMembers] = useState<MemberStatus[]>([]);
  const [expanded, setExpanded] = useState(true);

  // TODO: Hook up to subscribeToSquadStatuses via useSquadStatuses hook

  return (
    <div className="lockin-squadbar">
      <button
        className="lockin-squadbar-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="lockin-logo">LockIn</span>
        <span className="lockin-member-count">{members.length} online</span>
      </button>

      {expanded && (
        <div className="lockin-squadbar-members">
          {members.length === 0 ? (
            <p className="lockin-empty">
              No squad yet. Open the LockIn popup to create or join one!
            </p>
          ) : (
            members.map((member) => (
              <div key={member.uid} className="lockin-member-row">
                <span className="lockin-member-name">{member.displayName}</span>
                <StatusBadge status={member.status} />
                <span className="lockin-member-assignment">
                  {member.assignmentName}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
