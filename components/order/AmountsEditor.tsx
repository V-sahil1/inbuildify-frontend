const AmountsEditor = () => {
  return (
    <form className="w-full text-sm">
      <div className="space-y-3">
        {/* Row */}
        {[
          ["Order Amount", true],
          ["S & H", false],
          ["Sales Taxes", false],
          ["Discount/Add. Chgs.", false],
          ["Total Amount", true],
          ["Amount Paid", false],
          ["Net Due", true],
          ["Balance Due (US)", false],
          ["Int. Decl. Value", false],
          ["Insurance", false],
        ].map(([label, isDisabled]) => (
          <div
            className="flex items-center justify-between gap-2 form-control"
            key={label as string}
          >
            <label className="w-1/2 text-left form-label">{label}:</label>
            <input
              type="number"
              step="0.01"
              defaultValue="0.00"
              disabled={isDisabled as boolean}
              className="w-1/2 text-right px-2 py-1 form-input"
            />
          </div>
        ))}
      </div>
    </form>
  );
};

export default AmountsEditor;
