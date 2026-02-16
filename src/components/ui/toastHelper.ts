// toastHelper.ts - Enhanced version
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

  /**
   * Enhanced toastError that handles both error objects and strings
   */
  const toastError = (err: any) => {
    let message: string;

    // If it's a string, use it directly
    if (typeof err === 'string') {
      message = err;
    } 
    // If it's an error object from axios/backend
    else {
      // Extract message from various formats
      message = 
        err?.response?.data?.message || 
        err?.response?.data?.error ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "An unexpected error occurred";

      // Make stock errors more user-friendly
      if (message.includes('Insufficient stock')) {
        const stockMatch = /variant: (.+?)(?:\s|$)/.exec(message);
        const sku = stockMatch ? stockMatch[1] : 'selected product';
        message = `Not enough stock for ${sku}. Please reduce quantity or restock.`;
      }
    }

    toast.error(message, {
      duration: 4000, // Longer duration for errors so user can read them
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

/**
 * Non-hook versions for use outside components
 * (e.g., in utility functions or API interceptors)
 */
export const toastCreate = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      borderRadius: "8px",
      background: "#f0f0f0",
      color: "#000",
      padding: "8px 16px",
      fontWeight: 600,
    },
  });
};

export const toastUpdate = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      borderRadius: "8px",
      background: "#fff4e5",
      color: "#d97706", 
      padding: "8px 16px",
      fontWeight: 600,
    },
  });
};

export const toastDelete = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      borderRadius: "8px",
      background: "#000",
      color: "#ff4d4f", 
      padding: "8px 16px",
      fontWeight: 600,
    },
  });
};

export const toastError = (err: any) => {
  let message: string;

  if (typeof err === 'string') {
    message = err;
  } else {
    message = 
      err?.response?.data?.message || 
      err?.response?.data?.error ||
      err?.message ||
      "An unexpected error occurred";

    if (message.includes('Insufficient stock')) {
      const stockMatch = /variant: (.+?)(?:\s|$)/.exec(message);
      const sku = stockMatch ? stockMatch[1] : 'selected product';
      message = `Not enough stock for ${sku}. Please reduce quantity or restock.`;
    }
  }

  toast.error(message, {
    duration: 4000,
    style: {
      borderRadius: "8px",
      background: "#fde2e2",
      color: "#b91c1c", 
      padding: "8px 16px",
      fontWeight: 600,
    },
  });
};