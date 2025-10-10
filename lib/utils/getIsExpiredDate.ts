import dayjs from "dayjs";

export const getIsExpiredDate = (dueDate: string | Date, time: string): boolean => {
  const estimatedDateTime = dayjs(dueDate)
    .hour(dayjs(time, "HH:mm:ss").hour())
    .minute(dayjs(time, "HH:mm:ss").minute())
    .second(dayjs(time, "HH:mm:ss").second());

  return estimatedDateTime.isBefore(dayjs());
};