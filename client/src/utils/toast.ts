import toast from "react-hot-toast";

const defaultConfig = {
  duration: 3000,
  position: "top-right" as const,
};

export const Toast = {
  success: (message: string, options = {}) =>
    toast.success(message, { ...defaultConfig, ...options }),

  error: (message: string, options = {}) =>
    toast.error(message, { ...defaultConfig, ...options }),

  info: (message: string, options = {}) =>
    toast(message, { ...defaultConfig, ...options }),

  warning: (message: string, options = {}) =>
    toast(message, { ...defaultConfig, ...options }),
};