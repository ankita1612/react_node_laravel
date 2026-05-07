import {
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiLoader,
  FiX,
} from "react-icons/fi";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
type ToastType = {
  id: string;
  message: string;
  visible: boolean;
  type?: string;
  duration?: number;
  icon?: React.ReactNode;
  styleType?: "success" | "error" | "info" | "loading";
};

const CustomToast = ({ t }: { t: ToastType }) => {
  const duration = t.duration || 4000;

  const getColor = (type?: string) => {
    switch (type) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      case "loading":
        return "#3b82f6";
      default:
        return "#6366f1";
    }
  };

  //const color = getColor(t.type);
  const color = getColor(t.styleType);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(1));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`relative transform transition-all duration-200 ease-out ${t.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}  min-w-[280px] max-w-[400px] bg-white/90 backdrop-blur-md
    shadow-lg rounded-xl border border-gray-200 overflow-hidden  hover:shadow-xl `}
    >
      <button
        onClick={() => toast.dismiss(t.id)}
        className="absolute text-gray-400 top-2 right-2 hover:text-gray-700"
      >
        <FiX size={16} />
      </button>
      {/* Content */}
      <div className="flex items-center gap-1 px-4 py-3">
        {t.icon}
        <p className="flex-1 text-[15px] font-medium text-gray-500">
          {t.message}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gray-200">
        <div
          className="h-full origin-left"
          style={{
            backgroundColor: color,
            transform: `scaleX(${progress})`,
            transition: `transform ${duration}ms linear`,
          }}
        />
      </div>
    </div>
  );
};

export default CustomToast;

export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "loading" = "info",
) => {
  toast.dismiss("global-toast");

  toast.custom(
    (t) => (
      <CustomToast
        t={{
          ...t,
          message,
          styleType: type,
          icon: getIcon(type),
        }}
      />
    ),
    {
      id: "global-toast",
      duration: 2000,
    },
  );
};

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <FiCheckCircle className="w-5 h-5 text-green-500" />;
    case "error":
      return <FiXCircle className="w-5 h-5 text-red-500" />;
    case "loading":
      return <FiLoader className="w-5 h-5 text-blue-500 animate-spin" />;
    default:
      return <FiInfo className="w-5 h-5 text-indigo-500" />;
  }
};
