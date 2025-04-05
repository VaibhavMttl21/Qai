import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

const Toast = ({ message, type = "info", onClose }: ToastProps) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-md shadow-md p-4 min-w-[200px] animate-in fade-in slide-in-from-bottom-5",
        type === "success" && "bg-green-100 text-green-800 border border-green-200",
        type === "error" && "bg-red-100 text-red-800 border border-red-200",
        type === "info" && "bg-blue-100 text-blue-800 border border-blue-200"
      )}
    >
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
    </div>
  );
};

interface ToasterState {
  toasts: Array<{
    id: string;
    message: string;
    type: "success" | "error" | "info";
  }>;
}

export const ToasterContext = React.createContext<{
  toast: (message: string, type?: "success" | "error" | "info") => void;
}>({
  toast: () => {},
});

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ToasterState>({ toasts: [] });

  const toast = React.useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setState((prev) => ({
        toasts: [...prev.toasts, { id, message, type }],
      }));
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((toast) => toast.id !== id),
    }));
  }, []);

  return (
    <ToasterContext.Provider value={{ toast }}>
      {children}
      {state.toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToasterContext.Provider>
  );
}

export function Toaster() {
  return null; // The actual toasts are rendered by the ToasterProvider
}

export const useToast = () => React.useContext(ToasterContext);
