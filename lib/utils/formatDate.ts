export const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
