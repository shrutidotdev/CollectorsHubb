import type { ReactNode } from "react";

export default function EmptyState({
  icon,
  title,
  message,
  action,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="state-card">
      <span className="state-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{message}</p>
      <button className="secondary-button" onClick={onAction}>{action}</button>
    </div>
  );
}
