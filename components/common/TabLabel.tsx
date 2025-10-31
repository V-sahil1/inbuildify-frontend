export const tabsLabel = (label: string, note: string) => {
  return (
    <div>
      <p>{label}</p>
      <span className="text-sm font-medium">{note}</span>
    </div>
  );
};
