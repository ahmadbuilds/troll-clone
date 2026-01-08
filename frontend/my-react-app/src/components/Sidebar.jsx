import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

const Sidebar = () => {
  const { user, isGuest, logout } = useAuth();
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  // Fetch Boards
  useEffect(() => {
    fetchBoards();
    // Add event listener for custom event to trigger refresh
    window.addEventListener("boardCreated", fetchBoards);
    return () => {
      window.removeEventListener("boardCreated", fetchBoards);
    };
  }, [isGuest, user]);

  const fetchBoards = async () => {
    if (isGuest) {
      const stored = JSON.parse(localStorage.getItem("guest_boards") || "[]");
      setBoards(stored);
    } else if (user) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        const response = await fetch(
          `http://localhost:5000/api/boards?user_id=${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setBoards(data);
        } else {
          console.error("Failed to fetch boards");
        }
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    }
  };

  const handleDeleteBoard = async (e, boardId) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this board?")) return;

    if (isGuest) {
      const updatedBoards = boards.filter((b) => b.id !== boardId);
      localStorage.setItem("guest_boards", JSON.stringify(updatedBoards));
      setBoards(updatedBoards);
      if (window.location.pathname.includes(boardId)) {
        navigate("/dashboard");
      }
    } else {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        const response = await fetch(
          `http://localhost:5000/api/boards/${boardId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          setBoards(boards.filter((b) => b.board_id !== boardId)); // Note: Postgres ID often 'board_id' or 'id', check DB schema. DB sql says 'board_id'.
          // Wait, db.sql says `board_id uuid primary key`.
          // boardService.getBoards returns columns.
          // Let's check what `board_id` is named in the returned JSON.
          // Usually it returns whatever the DB column is.
          // If I need to be sure, I should check the returned data structure or assume `board_id` based on SQL.
          // However, common convention might map it or not.
          // Let's assume `board_id` initially but I'll add a fallback filter just in case or console log if I could.
          // Safest is to check both or just filter by ID if I know it.
          // I'll stick to board_id based on `create table boards (board_id ...)`
          if (window.location.pathname.includes(boardId)) {
            navigate("/dashboard");
          }
        } else {
          console.error("Failed to delete board");
        }
      } catch (error) {
        console.error("Error deleting board:", error);
      }
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col pt-5 px-4 flex-shrink-0">
      <h2
        className="text-2xl font-bold mb-6 px-2 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        Troll Boards
      </h2>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-xs uppercase text-gray-400 font-semibold mb-2 px-2">
          Your Boards
        </h3>
        <nav className="space-y-1">
          {boards.map((board) => {
            // Handle ID difference: user boards might have 'board_id', guest boards 'id'.
            const bId = board.board_id || board.id;
            return (
              <div
                key={bId}
                className="group flex items-center justify-between"
              >
                <NavLink
                  to={`/board/${bId}`}
                  className={({ isActive }) =>
                    `flex-1 flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2 inline-block flex-shrink-0"
                    style={{ backgroundColor: board.bg_color || "#ccc" }}
                  ></span>
                  <span className="truncate">{board.title}</span>
                </NavLink>
                <button
                  onClick={(e) => handleDeleteBoard(e, bId)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                  title="Delete Board"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="py-4 border-t border-gray-700">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none cursor-pointer"
        >
          + Create New Board
        </button>
        <button
          onClick={logout}
          className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
