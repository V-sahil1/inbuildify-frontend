// // import { useEffect, useRef } from "react";
// // import Calendar from "react-calendar";
// // import { AnimatePresence, motion } from "framer-motion";

// // type InlineCalendarProps = {
// //   position: { top: number; left: number };
// //   value: Date | null;
// //   onChange: (date: Date) => void;
// //   onClose: () => void;
// // };

// // export default function InlineCalendar({
// //   position,
// //   value,
// //   onChange,
// //   onClose,
// // }: InlineCalendarProps) {
// //   const calendarRef = useRef<HTMLDivElement | null>(null);

// //   useEffect(() => {
// //     function handleClickOutside(event: MouseEvent) {
// //       if (
// //         calendarRef.current &&
// //         !calendarRef.current.contains(event.target as Node)
// //       ) {
// //         onClose();
// //       }
// //     }

// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, [onClose]);

// //   return (
// //     <AnimatePresence>
// //       <motion.div
// //         ref={calendarRef}
// //         initial={{ opacity: 0, scale: 0.9 }}
// //         animate={{ opacity: 1, scale: 1 }}
// //         exit={{ opacity: 0, scale: 0.95 }}
// //         transition={{ duration: 0.2 }}
// //         className="absolute z-50 bg-white border p-2 shadow-lg rounded-md"
// //         style={{
// //           top: position.top,
// //           left: position.left,
// //         }}
// //       >
// //         <Calendar
// //           onChange={(date) => onChange(date as Date)}
// //           value={value}
// //           className="bg-card-color rounded-md"
// //         />
// //       </motion.div>
// //     </AnimatePresence>
// //   );
// // }


// // components/common/InlineCalendar.tsx
// import { useEffect, useRef } from "react";
// import Calendar from "react-calendar";
// import { AnimatePresence, motion } from "framer-motion";

// type InlineCalendarProps = {
//   position: { top: number; left: number };
//   value: Date | null;
//   onChange: (date: Date) => void;
//   onClose: () => void;
// };

// export default function InlineCalendar({
//   position,
//   value,
//   onChange,
//   onClose,
// }: InlineCalendarProps) {
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       onClose();
//     };
//     window.addEventListener("scroll", handleScroll, true);
//     return () => window.removeEventListener("scroll", handleScroll, true);
//   }, [onClose]);

//   return (
//     <AnimatePresence>
//       <motion.div
//         ref={ref}
//         className="absolute z-50 shadow-lg rounded-lg bg-white"
//         style={{
//           top: position.top,
//           left: position.left,
//         }}
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         transition={{ duration: 0.2 }}
//       >
//         <Calendar onChange={onChange} value={value} />
//       </motion.div>
//     </AnimatePresence>
//   );
// }

import { useEffect, useRef } from "react";
import Calendar from "react-calendar";
import { AnimatePresence, motion } from "framer-motion";

type InlineCalendarProps = {
  position: { top: number; left: number };
  value: Date | null;
  onChange: (date: Date) => void;
  onClose: () => void;
};

export default function InlineCalendar({
  position,
  value,
  onChange,
  onClose,
}: InlineCalendarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      onClose(); // or reposition if needed
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        className="fixed z-[9999] bg-white border border-gray-300 rounded-xl shadow-xl"
        style={{
          top: position.top,
          left: position.left,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Calendar onChange={onChange} value={value || new Date()} />
      </motion.div>
    </AnimatePresence>
  );
}
