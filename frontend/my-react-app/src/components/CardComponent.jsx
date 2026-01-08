const CardComponent = ({ card, onDelete, onEdit, onMoveUp, onMoveDown }) => {
  const getPriorityColor = (p) => {
    switch (p) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      onClick={() => onEdit(card)}
      className="bg-white p-3 rounded shadow-sm mb-2 group relative hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer transition-all"
    >
      <div className="pr-16 break-words font-medium text-gray-800">
        {card.title}
      </div>
      {card.description && (
        <div className="text-xs text-gray-500 mt-1 truncate">
          {card.description}
        </div>
      )}
      <div className="mt-2 flex">
        {card.priority && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getPriorityColor(
              card.priority
            )}`}
          >
            {card.priority}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex flex-col items-center space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="text-gray-400 hover:text-red-500 p-1"
          title="Delete Card"
        >
          ✕
        </button>
        <div className="flex flex-col">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(card.id);
            }}
            className="text-gray-400 hover:text-indigo-600 p-0.5 text-xs font-bold"
            title="Move Up"
          >
            ▲
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(card.id);
            }}
            className="text-gray-400 hover:text-indigo-600 p-0.5 text-xs font-bold"
            title="Move Down"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
