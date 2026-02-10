// toastHelper.ts
import { toast } from "sonner";

// Success toast for create (normal)
export const toastCreate = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      borderRadius: "8px",
      background: "#f0f0f0",
      color: "#000",
      padding: "8px 16px",
      fontWeight: 600,
      boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    },
  });
};

// Update toast (orange professional)
export const toastUpdate = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      borderRadius: "8px",
      background: "#fff4e5",
      color: "#d97706", // amber/orange-600
      padding: "8px 16px",
      fontWeight: 600,
      boxShadow: "0 2px 10px rgba(217,119,6,0.3)",
    },
  });
};

// Delete toast (red/black)
export const toastDelete = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      borderRadius: "8px",
      background: "#000",
      color: "#ff4d4f", // red
      padding: "8px 16px",
      fontWeight: 600,
      boxShadow: "0 2px 10px rgba(255,77,79,0.5)",
    },
  });
};
