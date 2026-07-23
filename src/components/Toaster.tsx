"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1c1f24",
            color: "#dcdee2",
            border: "1px solid #2a2e35",
            borderRadius: "10px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#d4a94e", secondary: "#1c1f24" } },
          error: { iconTheme: { primary: "#c73a3a", secondary: "#1c1f24" } },
        }}
      />
    </>
  );
}
