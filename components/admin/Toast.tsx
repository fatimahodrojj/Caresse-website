"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Icon from "@/components/admin/Icon";
import type { ActionState } from "@/lib/admin/action-state";

type Toast = { id: number; kind: "success" | "error"; message: string };

const ToastContext = createContext<(kind: Toast["kind"], message: string) => void>(() => {});

/** Shows short messages after actions ("Saved", errors). Lives in the admin layout. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const show = useCallback((kind: Toast["kind"], message: string) => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { id, kind, message }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {/* Above the phone tab bar; bottom-right on desktop. */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-3 bottom-[84px] z-50 flex flex-col items-center gap-2 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.kind === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-panel px-4 py-3 text-sm font-semibold text-white shadow-lg ${
              toast.kind === "success" ? "bg-navy" : "bg-danger"
            }`}
          >
            <Icon name={toast.kind === "success" ? "check" : "x"} className="size-5 shrink-0" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

/**
 * Shows a toast whenever an action returns a new result, and calls
 * onSuccess (e.g. to navigate) after a success.
 */
export function useActionToast(state: ActionState, onSuccess?: (state: ActionState & { status: "success" }) => void) {
  const toast = useToast();
  const last = useRef(state);
  useEffect(() => {
    if (state === last.current) return;
    last.current = state;
    if (state.status === "success") {
      toast("success", state.message);
      onSuccess?.(state);
    } else if (state.status === "error") {
      toast("error", state.message);
    }
  }, [state, toast, onSuccess]);
}
