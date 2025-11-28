import React from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: number;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  show: (msg: Omit<ToastMessage, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = React.useState<ToastMessage[]>([]);
  const show = React.useCallback((msg: Omit<ToastMessage, "id">) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const duration = msg.duration ?? 3000;
    const m: ToastMessage = { id, ...msg, duration };
    setMessages((prev) => [...prev, m]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const value = React.useMemo(() => ({ show }), [show]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export const ToastContainer: React.FC<{ messages: ToastMessage[] }> = ({
  messages,
}) => {
  return (
    <div className="fixed top-4 right-4 z-[10000] space-y-3 pointer-events-none">
      {messages.map((m) => {
        const type = m.type ?? "info";
        const bg =
          type === "success"
            ? "bg-green-600"
            : type === "error"
            ? "bg-red-600"
            : type === "warning"
            ? "bg-amber-600"
            : "bg-brand-dark";
        return (
          <div
            key={m.id}
            className={`pointer-events-auto text-white ${bg} shadow-lg rounded-xl px-4 py-3 flex items-start gap-3 animate-fade-in-up`}
          >
            <div className="flex-1">
              {m.title && (
                <div className="font-semibold leading-tight">{m.title}</div>
              )}
              {m.description && (
                <div className="text-sm opacity-90">{m.description}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

