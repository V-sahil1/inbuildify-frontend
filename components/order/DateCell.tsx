// components/order/DateCell.tsx
import { useRef, useState, useEffect } from "react";
import InlineCalendar from "@/components/common/InlineCalendar";

type DateCellProps = {
  value: string;
  onChange: (date: string) => void;
};

export default function DateCell({ value, onChange }: DateCellProps) {
  const cellRef = useRef<HTMLDivElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleClick = () => {
    const rect = cellRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: rect.top + window.scrollY - 300, // adjust upward
        left: rect.left + window.scrollX - 110,
      });
    }
    setShowCalendar(true);
  };

  const handleClose = () => {
    setShowCalendar(false);
  };

  const handleSelect = (date: Date) => {
    onChange(date.toISOString().split("T")[0]);
    handleClose();
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showCalendar &&
        !cellRef.current?.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  return (
    <div ref={cellRef}  onClick={(e) => {
        e.stopPropagation(); // ✅ prevent table row select
        handleClick();
      }} className="cursor-pointer relative text-secondary border-b-secondary border-b">
      {value || "Select"}
      {showCalendar && (
        <InlineCalendar
          position={position}
          value={value ? new Date(value) : null}
          onChange={handleSelect}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
