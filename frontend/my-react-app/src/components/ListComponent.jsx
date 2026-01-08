import React, { useState } from "react";
import CardComponent from "./CardComponent";

const ListComponent = ({
  list,
  onDeleteList,
  onAddCardClick,
  onDeleteCard,
  onEditCard,
  onMoveCardUp,
  onMoveCardDown,
}) => {
  return (
    <div className="bg-gray-100 rounded-lg w-72 max-h-full flex flex-col shrink-0 mr-4">
      {/* List Header */}
      <div className="p-3 font-semibold text-gray-700 flex justify-between items-center handle">
        <h3 className="truncate">{list.title}</h3>
        <button
          onClick={() => onDeleteList(list.id)}
          className="text-gray-400 hover:text-red-600 px-2"
          title="Delete List"
        >
          ✕
        </button>
      </div>

      {/* Cards Container */}
      <div className="px-2 overflow-y-auto min-h-[10px]">
        {list.cards &&
          list.cards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              onDelete={onDeleteCard}
              onEdit={onEditCard}
              onMoveUp={() => onMoveCardUp(list.id, card.id)}
              onMoveDown={() => onMoveCardDown(list.id, card.id)}
            />
          ))}
      </div>

      {/* Add Card Footer */}
      <div className="p-2">
        <button
          onClick={() => onAddCardClick(list.id)}
          className="w-full text-left text-gray-600 hover:bg-gray-200 p-2 rounded flex items-center transition-colors"
        >
          <span className="mr-2">+</span> Add a card
        </button>
      </div>
    </div>
  );
};

export default ListComponent;
