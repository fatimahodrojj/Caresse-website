"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/admin/Icon";
import { FLASH_MESSAGES, type FlashKey } from "@/lib/admin/flash";

type Toast = { id: number; kind: "success" | "error"; message: string };

const ToastContext = createContext<(kind: Toast["kind"], message: string) => void>(() => {});

/** Shows short messages after actions ("Saved", errors). Lives in the admin layout. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const show = useCallback((kind: Toast["kind"], message: string) => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { id, kind, message }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4500);
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

/** Shows the toast for ?flash=<key> after a redirect, then removes the parameter. */
export function FlashToast() {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const flash = searchParams.get("flash");
  useEffect(() => {
    if (!flash) return;
    if (flash in FLASH_MESSAGES) toast("success", FLASH_MESSAGES[flash as FlashKey]);
    const rest = new URLSearchParams(searchParams);
    rest.delete("flash");
    router.replace(rest.size ? `${pathname}?${rest}` : pathname, { scroll: false });
  }, [flash, pathname, router, searchParams, toast]);
  return null;
}
