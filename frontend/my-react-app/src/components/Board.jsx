import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import ListComponent from "./ListComponent";
import CardModal from "./CardModal";

const Board = () => {
  const { boardId } = useParams();
  const { isGuest, user } = useAuth();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  // New List State
  const [newListTitle, setNewListTitle] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);

  // Modal State
  const [activeListId, setActiveListId] = useState(null); // For Creating
  const [editingCard, setEditingCard] = useState(null); // For Editing

  // Initial Fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (isGuest) {
        // Fetch Board
        const storedBoards = JSON.parse(
          localStorage.getItem("guest_boards") || "[]"
        );
        const foundBoard = storedBoards.find((b) => b.id === boardId);
        setBoard(foundBoard);

        // Fetch Lists & Cards
        const storedLists = JSON.parse(
          localStorage.getItem("guest_lists") || "[]"
        );
        const storedCards = JSON.parse(
          localStorage.getItem("guest_cards") || "[]"
        );

        const boardLists = storedLists
          .filter((l) => l.board_id === boardId)
          .map((l) => ({
            ...l,
            cards: storedCards.filter((c) => c.list_id === l.id),
          }));
        setLists(boardLists);
        setLoading(false);
      } else if (user) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          const token = session?.access_token;

          // Fetch Board
          const boardRes = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/boards/${boardId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (boardRes.ok) {
            setBoard(await boardRes.json());
          } else {
            setBoard(null);
          }

          // Fetch Lists
          const listsRes = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/lists/board/${boardId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (listsRes.ok) {
            setLists(await listsRes.json());
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [boardId, isGuest, user]);

  // --- Handlers ---

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    if (isGuest) {
      const newList = {
        id: crypto.randomUUID(),
        board_id: boardId,
        title: newListTitle,
        created_at: new Date().toISOString(),
      };
      const storedLists = JSON.parse(
        localStorage.getItem("guest_lists") || "[]"
      );
      localStorage.setItem(
        "guest_lists",
        JSON.stringify([...storedLists, newList])
      );

      setLists([...lists, { ...newList, cards: [] }]);
      setNewListTitle("");
      setIsAddingList(false);
    } else {
      // API
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/lists`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ board_id: boardId, title: newListTitle }),
          }
        );

        if (response.ok) {
          const listsRes = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/lists/board/${boardId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (listsRes.ok) setLists(await listsRes.json());
          setNewListTitle("");
          setIsAddingList(false);
        }
      } catch (error) {
        console.error("Error creating list:", error);
      }
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm("Delete this list and all its cards?")) return;

    if (isGuest) {
      const storedLists = JSON.parse(
        localStorage.getItem("guest_lists") || "[]"
      );
      const storedCards = JSON.parse(
        localStorage.getItem("guest_cards") || "[]"
      );

      const updatedLists = storedLists.filter((l) => l.id !== listId);
      const updatedCards = storedCards.filter((c) => c.list_id !== listId);

      localStorage.setItem("guest_lists", JSON.stringify(updatedLists));
      localStorage.setItem("guest_cards", JSON.stringify(updatedCards));

      setLists(lists.filter((l) => l.id !== listId));
    } else {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lists/${listId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setLists(lists.filter((l) => l.id !== listId));
      } catch (error) {
        console.error("Error deleting list:", error);
      }
    }
  };

  // Unified Handler for Create and Edit
  const handleSaveCard = async (cardData) => {
    const isEdit = !!cardData.id;
    const listId = activeListId; // Only relevant for create

    if (isGuest) {
      const storedCards = JSON.parse(
        localStorage.getItem("guest_cards") || "[]"
      );
      let updatedCardsStorage;
      let newCardObj;

      if (isEdit) {
        updatedCardsStorage = storedCards.map((c) =>
          c.id === cardData.id ? { ...c, ...cardData } : c
        );
        newCardObj = {
          ...storedCards.find((c) => c.id === cardData.id),
          ...cardData,
        };
      } else {
        newCardObj = {
          id: crypto.randomUUID(),
          list_id: listId,
          title: cardData.title,
          description: cardData.description,
          priority: cardData.priority,
          created_at: new Date().toISOString(),
        };
        updatedCardsStorage = [...storedCards, newCardObj];
      }
      localStorage.setItem("guest_cards", JSON.stringify(updatedCardsStorage));

      // Update State
      setLists(
        lists.map((list) => {
          if (isEdit) {
            // Check if card belongs to this list (simplification, assuming no move list during edit)
            const cardExists = list.cards?.find((c) => c.id === cardData.id);
            if (cardExists) {
              return {
                ...list,
                cards: list.cards.map((c) =>
                  c.id === cardData.id ? { ...c, ...cardData } : c
                ),
              };
            }
            return list;
          } else {
            if (list.id === listId) {
              return { ...list, cards: [...(list.cards || []), newCardObj] };
            }
            return list;
          }
        })
      );
    } else {
      // API
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (isEdit) {
          await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/cards/${cardData.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(cardData),
            }
          );
          // Update Local State Optimistically
          setLists(
            lists.map((list) => {
              const cardExists = list.cards?.find((c) => c.id === cardData.id);
              if (cardExists) {
                return {
                  ...list,
                  cards: list.cards.map((c) =>
                    c.id === cardData.id ? { ...c, ...cardData } : c
                  ),
                };
              }
              return list;
            })
          );
        } else {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/cards`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ list_id: listId, ...cardData }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            const newCard = data.card;
            setLists(
              lists.map((list) => {
                if (list.id === listId) {
                  return { ...list, cards: [...(list.cards || []), newCard] };
                }
                return list;
              })
            );
          }
        }
      } catch (error) {
        console.error("Error saving card:", error);
      }
    }

    // Close Modals
    setActiveListId(null);
    setEditingCard(null);
  };

  const handleDeleteCard = async (cardId) => {
    if (isGuest) {
      const storedCards = JSON.parse(
        localStorage.getItem("guest_cards") || "[]"
      );
      const updatedCards = storedCards.filter((c) => c.id !== cardId);
      localStorage.setItem("guest_cards", JSON.stringify(updatedCards));

      setLists(
        lists.map((list) => ({
          ...list,
          cards: list.cards ? list.cards.filter((c) => c.id !== cardId) : [],
        }))
      );
    } else {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cards/${cardId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        setLists(
          lists.map((list) => ({
            ...list,
            cards: list.cards ? list.cards.filter((c) => c.id !== cardId) : [],
          }))
        );
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    }
  };

  const handleMoveCard = (listId, cardId, direction) => {
    const listIndex = lists.findIndex((l) => l.id === listId);
    if (listIndex === -1) return;

    const list = lists[listIndex];
    const cardIndex = list.cards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) return;

    const newCards = [...list.cards];

    if (direction === "up") {
      if (cardIndex === 0) return; // Already at top
      [newCards[cardIndex - 1], newCards[cardIndex]] = [
        newCards[cardIndex],
        newCards[cardIndex - 1],
      ];
    } else {
      if (cardIndex === newCards.length - 1) return; // Already at bottom
      [newCards[cardIndex], newCards[cardIndex + 1]] = [
        newCards[cardIndex + 1],
        newCards[cardIndex],
      ];
    }

    // Update State
    const newLists = [...lists];
    newLists[listIndex] = { ...list, cards: newCards };
    setLists(newLists);

    if (isGuest) {
      // See persistence note in TaskSummary
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!board)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-gray-600">
          Board not found or you don't have access.
        </div>
      </div>
    );

  return (
    <div
      className="h-screen w-full flex flex-col"
      style={{
        backgroundColor: board.bg_color || "#ffffff",
        backgroundImage: board.img_url ? `url(${board.img_url})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Board Header */}
      <div className="bg-black/30 backdrop-blur-sm p-4 text-white flex justify-between items-center shadow-md shrink-0">
        <h1 className="text-2xl font-bold px-2">{board.title}</h1>
      </div>

      {/* Lists Canvas - Horizontal Scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        {/* ensure flex-row and no wrap for horizontal scrolling lists */}
        <div className="h-full flex flex-row flex-nowrap items-start p-4 space-x-4">
          {lists.map((list) => (
            <ListComponent
              key={list.id}
              list={list}
              onDeleteList={handleDeleteList}
              onAddCardClick={(id) => setActiveListId(id)}
              onDeleteCard={handleDeleteCard}
              onEditCard={(card) => setEditingCard(card)}
              onMoveCardUp={(lid, cid) => handleMoveCard(lid, cid, "up")}
              onMoveCardDown={(lid, cid) => handleMoveCard(lid, cid, "down")}
            />
          ))}

          {/* Add List Button/Form */}
          <div className="w-72 shrink-0">
            {!isAddingList ? (
              <button
                onClick={() => setIsAddingList(true)}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded text-left transition-colors flex items-center"
              >
                <span className="mr-2">+</span> Add another list
              </button>
            ) : (
              <div className="bg-gray-100 p-2 rounded shadow-md">
                <input
                  type="text"
                  className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500 mb-2"
                  placeholder="Enter list title..."
                  autoFocus
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateList(e);
                  }}
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCreateList}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700 font-medium"
                  >
                    Add List
                  </button>
                  <button
                    onClick={() => setIsAddingList(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unified Card Modal */}
      {(activeListId || editingCard) && (
        <CardModal
          card={editingCard}
          onClose={() => {
            setActiveListId(null);
            setEditingCard(null);
          }}
          onSave={handleSaveCard}
        />
      )}
    </div>
  );
};

export default Board;
