const getPlanColors = planName => {
  switch (planName) {
    case 'Small':
      return {
        bg: 'bg-blue-600',
        border: 'border-blue-600',
        text: 'text-blue-600',
        hover: 'hover:bg-blue-700',
      };
    case 'Medium':
      return {
        bg: 'bg-green-600',
        border: 'border-green-600',
        text: 'text-green-600',
        hover: 'hover:bg-green-700',
      };
    case 'High':
      return {
        bg: 'bg-yellow-500',
        border: 'border-yellow-500',
        text: 'text-yellow-500',
        hover: 'hover:bg-yellow-600',
      };
    case 'Volume':
      return {
        bg: 'bg-purple-600',
        border: 'border-purple-600',
        text: 'text-purple-600',
        hover: 'hover:bg-purple-700',
      };
    default:
      return {
        bg: 'bg-gray-500',
        border: 'border-gray-500',
        text: 'text-gray-500',
        hover: 'hover:bg-gray-600',
      };
  }
};

export const PlanCard = ({ plan, isSelected, setSelectedPlan }) => {
  const { bg, border, text, hover } = getPlanColors(plan.name);

  return (
    <div
      className={`
        rounded-lg overflow-hidden cursor-pointer transition-all duration-300
        ${isSelected ? `border-2 ${border} shadow-lg scale-[1.02]` : 'border border-gray-300'}
      `}
      onClick={() => setSelectedPlan(plan.name)}
    >
      <div className={`text-white p-2 text-center text-lg font-semibold ${bg}`}>{plan.name}</div>
      <div className="p-5 text-center bg-white flex flex-col items-center">
        <div className={`text-3xl font-bold mb-1 ${text}`}>{plan.price}</div>
        <div className="text-sm text-gray-700 mb-2">{plan.eSigns}</div>
        <div className="text-xs text-gray-500 mb-6">{plan.pricePerEnvelope}</div>
        <button
          className={`
            py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200
            ${
              isSelected
                ? `${bg} text-white ${hover}`
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }
          `}
        >
          {plan.buttonText}
        </button>
        {plan.recommended && isSelected && (
          <div className="text-xs text-green-600 mt-2 font-medium">* Recommended</div>
        )}
      </div>
    </div>
  );
};
