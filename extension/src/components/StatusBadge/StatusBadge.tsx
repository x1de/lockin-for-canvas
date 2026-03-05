// StatusBadge - visual indicator of assignment progress
// OWNER: Triya
import type { AssignmentStatus } from "../../types";

const STATUS_CONFIG: Record<AssignmentStatus, { label: string; color: string; emoji: string }> = {
  not_started: { label: "Not Started", color: "#95A5A6", emoji: "" },
  viewing: { label: "Viewing", color: "#3498DB", emoji: "" },
  in_progress: { label: "In Progress", color: "#F39C12", emoji: "" },
  drafting: { label: "Drafting", color: "#E67E22", emoji: "" },
  submitted: { label: "Submitted", color: "#27AE60", emoji: "" },
};

interface Props {
  status: AssignmentStatus;
}

export default function StatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className="lockin-status-badge"
      style={{ backgroundColor: config.color }}
      title={config.label}
    >
      {config.emoji} {config.label}
    </span>
  );
}
