import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function SidebarRow({
  label,
  value,
  isHighLightedText,
}: {
  label: string;
  value: string;
  isHighLightedText?: boolean;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [value]);
  return (
    <div className="flex justify-between gap-1 w-full">
      <span
        className={`${
          isHighLightedText ? " font-bold" : "text-font-color-100"
        }  w-1/2`}
      >
        {label}
      </span>

      <div
        className="w-1/2 text-right relative flex items-center justify-end"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span
          ref={textRef}
          className={
            isHighLightedText
              ? "block truncate border-t font-bold cursor-default"
              : "block truncate text-font-color-100  cursor-default"
          }
          style={{ width: "max-content" }}
        >
          {value}
        </span>

        <AnimatePresence>
          {isTruncated && isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                top: "-30px",
                right: "0",
                width: "max-content",
                maxWidth: "20rem",
                backgroundColor: "black",
                color: "white",
                fontSize: "12px",
                padding: "0.3rem 0.7rem",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              {value}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}