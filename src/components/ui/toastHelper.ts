// toastHelper.ts
import { toast } from "sonner";
import { useTheme } from "@/ThemeContext";

/**
 * Hook-based helper to create theme-aware toasts.
 */
export const useToastHelper = () => {
  const { darkMode } = useTheme();

  const toastCreate = (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        borderRadius: "8px",
        background: darkMode ? "#1f1f1f" : "#f0f0f0",
        color: darkMode ? "#f0f0f0" : "#000",
        padding: "8px 16px",
        fontWeight: 600,
        boxShadow: darkMode
          ? "0 2px 10px rgba(255,255,255,0.1)"
          : "0 2px 10px rgba(0,0,0,0.15)",
      },
    });
  };

  const toastUpdate = (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        borderRadius: "8px",
        background: darkMode ? "#4b341e" : "#fff4e5",
        color: darkMode ? "#fbbf24" : "#d97706", 
        padding: "8px 16px",
        fontWeight: 600,
        boxShadow: darkMode
          ? "0 2px 10px rgba(251,191,36,0.3)"
          : "0 2px 10px rgba(217,119,6,0.3)",
      },
    });
  };

  const toastDelete = (message: string) => {
    toast.success(message, {
      duration: 3000,
      style: {
        borderRadius: "8px",
        background: darkMode ? "#111" : "#000",
        color: darkMode ? "#ff4d4f" : "#ff4d4f", 
        padding: "8px 16px",
        fontWeight: 600,
        boxShadow: darkMode
          ? "0 2px 10px rgba(255,77,79,0.7)"
          : "0 2px 10px rgba(255,77,79,0.5)",
      },
    });
  };

  const toastError = (err: any) => {
    const message =
      err?.response?.data?.message || "An unexpected error occurred";
    toast.error(message, {
      duration: 3000,
      style: {
        borderRadius: "8px",
        background: darkMode ? "#2a1a1a" : "#fde2e2",
        color: darkMode ? "#f87171" : "#b91c1c", 
        padding: "8px 16px",
        fontWeight: 600,
        boxShadow: darkMode
          ? "0 2px 10px rgba(248,113,113,0.4)"
          : "0 2px 10px rgba(185,28,28,0.3)",
      },
    });
  };

  return { toastCreate, toastUpdate, toastDelete, toastError };
};
