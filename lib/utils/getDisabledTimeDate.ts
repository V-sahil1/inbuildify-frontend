import dayjs from "dayjs";

export const disablePastDates = (current: dayjs.Dayjs) => {
  return current && current < dayjs().startOf("day");
};

export const getDisabledTime = (date: dayjs.Dayjs | null) => {
  if (!date) return {};
  const now = dayjs();

  if (date.isSame(now, "day")) {
    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => (i < now.hour() ? i : -1)).filter(
          (i) => i !== -1
        ),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === now.hour()) {
          return Array.from({ length: 60 }, (_, i) =>
            i < now.minute() ? i : -1
          ).filter((i) => i !== -1);
        }
        return [];
      },
    };
  }

  return {};
};


export const getEndDisabledTime = (
  selectedDate: dayjs.Dayjs | null,
  startTime: dayjs.Dayjs | null
) => {
  if (!selectedDate || !startTime) {
    return { disabledHours: () => [], disabledMinutes: () => [] };
  }

  const now = dayjs();

  let minHour = startTime.hour();
  let minMinute = startTime.minute();

  // If selecting today, also respect current time
  if (selectedDate.isSame(now, "day")) {
    if (now.hour() > minHour) {
      minHour = now.hour();
      minMinute = now.minute();
    } else if (now.hour() === minHour && now.minute() > minMinute) {
      minMinute = now.minute();
    }
  }

  return {
    disabledHours: () =>
      Array.from({ length: 24 }, (_, i) => i).filter((h) => h < minHour),
    disabledMinutes: (hour: number) => {
      if (hour === minHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (m) => m <= minMinute
        );
      }
      return [];
    },
  };
};

