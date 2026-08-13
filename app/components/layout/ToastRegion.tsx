import { Check, Sparkles } from "lucide-react";
import type { Toast } from "../../types";

export default function ToastRegion({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div className={`toast toast-${toast.tone}`} key={toast.id}>
          {toast.tone === "success" ? <Check size={17} /> : <Sparkles size={17} />}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
