import React, { useState, useEffect } from "react";

const CardModal = ({ card, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (card) {
      setTitle(card.title || "");
      setDescription(card.description || "");
      setPriority(card.priority || "Medium");
    } else {
      setTitle("");
      setDescription("");
      setPriority("Medium");
    }
  }, [card]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      ...(card ? { id: card.id } : {}),
      title,
      description,
      priority,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            {card ? "Edit Card" : "Add New Card"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix login bug"
              autoFocus={!card}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex justify-end pt-2 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium"
            >
              {card ? "Save Changes" : "Create Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardModal;
