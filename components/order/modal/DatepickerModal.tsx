// components/DatepickerModal.tsx
import React, { useState } from "react";
import Calendar from "react-calendar";
import { IconX } from "@tabler/icons-react";
import "react-calendar/dist/Calendar.css";
import Drawer from "@/components/common/Drawer";

interface DatepickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
}

const DatepickerModal: React.FC<DatepickerModalProps> = ({
  isOpen,
  onClose,
  onDateSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  if (!isOpen) return null;

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        header="Select Do Not Ship Before Date"
        onSuccess={onClose}
      >
        <div className="flex justify-center items-center">
          <Calendar
            onChange={onDateSelect}
            value={selectedDate}
            className="w-full bg-card-color "
          />
        </div>
      </Drawer>
    </>
  );
};

export default DatepickerModal;
