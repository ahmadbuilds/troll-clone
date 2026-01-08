import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const Board = () => {
  const { boardId } = useParams();
  const { isGuest } = useAuth();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      if (isGuest) {
        const storedBoards = JSON.parse(
          localStorage.getItem("guest_boards") || "[]"
        );
        // In local storage we might use IDs or just index? Assuming we generate IDs.
        const found = storedBoards.find((b) => b.id === boardId);
        setBoard(found);
        setLoading(false);
      } else {
        const { data, error } = await supabase
          .from("board")
          .select("*")
          .eq("id", boardId)
          .single();

        if (error) {
          console.error("Error fetching board:", error);
        } else {
          setBoard(data);
        }
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardId, isGuest]);

  if (loading) return <div>Loading board...</div>;
  if (!board) return <div>Board not found.</div>;

  return (
    <div
      className="h-screen w-full p-8"
      style={{
        backgroundColor: board.bg_color || "#ffffff",
        backgroundImage: board.image_url ? `url(${board.image_url})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/80 p-6 rounded-lg shadow backdrop-blur-sm max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{board.title}</h1>
      </div>
    </div>
  );
};

export default Board;
