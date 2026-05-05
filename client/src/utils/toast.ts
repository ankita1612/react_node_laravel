import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const Toast = {
  success: (message, options = {}) =>
    toast.success(message, { ...defaultConfig, ...options }),

  error: (message, options = {}) =>
    toast.error(message, { ...defaultConfig, ...options }),

  info: (message, options = {}) =>
    toast.info(message, { ...defaultConfig, ...options }),

  warning: (message, options = {}) =>
    toast.warn(message, { ...defaultConfig, ...options }),
};