import { IconX } from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";

const Drawer = ({
  isOpen,
  onClose,
  children,
  header,
  onSuccess,
  isSuccessBtnDisabled,
  width = "default",
}: {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  children: React.ReactNode;
  onSuccess: () => void;
    height?: string;
    isSuccessBtnDisabled?: boolean;
    width?: "small" | "default" | "large";
}) => {
  const [animateOut, setAnimateOut] = useState(false);
const memorisedWidth = useMemo(() => {
  switch (width) {
    case "small":
      return "sm:max-w-[300px]";
    case "default":
      return "sm:max-w-[550px]";
    case "large":
      return "sm:max-w-[850px]";
    default:
      return "sm:max-w-[550px]";
  }
}, [width]);
  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      onClose();
    }, 300); // matches drawer & overlay animation
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  if (!isOpen) return null;
  return (
    <>
      {/* Overlay with animation */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 backdrop-blur-[2px] !z-[9998] ${
          animateOut ? "animate-fade-out" : "animate-fade-in"
        } bg-black-50`}
      ></div>

      {/* Right-side Drawer */}
      <div
        className={`fixed right-0 bottom-0 h-full w-full ${memorisedWidth} !z-[9999] bg-card-color shadow-shadow-lg flex flex-col transition-transform duration-300 ${
          animateOut ? "animate-slide-out" : "animate-slide-in"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 right-[12px] !z-[9999] flex items-center justify-between p-5 border-b border-border-color bg-card-color">
          <h2 className="text-[20px]/[26px] font-medium p-2">{header}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-black transition"
          >
            <IconX />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {children}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 !z-[9999] p-4 border-t border-border-color bg-card-color flex justify-end gap-4">
          <button onClick={handleClose} className="btn btn-secondary">
            Close
          </button>
          <button className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed" onClick={onSuccess} disabled={isSuccessBtnDisabled}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0%);
          }
        }

        @keyframes slide-out {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(100%);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        .animate-slide-out {
          animation: slide-out 0.3s ease-in forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-fade-out {
          animation: fade-out 0.3s ease-in forwards;
        }
      `}</style>
    </>
  );
};

export default Drawer;
