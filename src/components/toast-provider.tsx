import { ReactNode, useEffect, useMemo, useState } from "react";
import { setToastHandler, ToastKind } from "../lib/toast-service";

type ToastItem = {
  id: number;
  message: string;
  kind: ToastKind;
};

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const styles = useMemo<Record<ToastKind, string>>(
    () => ({
      error: "border-red-500/40 bg-red-500/15 text-red-100",
      success: "border-lime-500/40 bg-lime-500/15 text-lime-100",
      info: "border-sky-500/40 bg-sky-500/15 text-sky-100",
    }),
    []
  );

  useEffect(() => {
    setToastHandler((message: string, kind: ToastKind = "error") => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((prev) => [...prev, { id, message, kind }]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4500);
    });

    return () => setToastHandler(null);
  }, []);

  return (
    <>
      {children}

      <div className="fixed right-4 top-4 z-[100] w-full max-w-sm space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl border px-4 py-3 shadow-shape backdrop-blur ${styles[toast.kind]}`}
            role="alert"
            aria-live="assertive"
          >
            <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
          </div>
        ))}
      </div>
    </>
  );
}
