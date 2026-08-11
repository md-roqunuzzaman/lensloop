"use client";

import { useEffect, useState } from "react";

export function GlobalLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setVisible(false), 350);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      aria-label="Loading"
      role="status"
    >
      <div className="flex flex-col items-center">
        {/* Animated logo mark */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-border" />

          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-secondary iris-loader" />

          {/* Inner mark */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface shadow-sm">
            <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]" />
          </div>
        </div>

        {/* Brand */}
        <div className="mt-5 text-center">
          <p className="font-display text-lg font-semibold tracking-tight">
            Gear<span className="text-primary">Up</span>
          </p>

          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="h-1 w-1 animate-pulse rounded-full bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Loading
            </span>
            <span className="h-1 w-1 animate-pulse rounded-full bg-secondary [animation-delay:150ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}
