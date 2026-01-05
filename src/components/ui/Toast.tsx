import { useEffect } from "react";
import { clsx } from "clsx";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white",
        {
          "bg-green-500": toast.type === "success",
          "bg-red-500": toast.type === "error",
          "bg-blue-500": toast.type === "info",
        }
      )}
    >
      <span>
        {toast.type === "success" && "✓"}
        {toast.type === "error" && "✕"}
        {toast.type === "info" && "ℹ"}
      </span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
