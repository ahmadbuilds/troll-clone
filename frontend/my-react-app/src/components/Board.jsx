import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

const Board = () => {
  const { boardId } = useParams();
  const { isGuest, user } = useAuth();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      if (isGuest) {
        const storedBoards = JSON.parse(
          localStorage.getItem("guest_boards") || "[]"
        );
        const found = storedBoards.find((b) => b.id === boardId);
        setBoard(found);
        setLoading(false);
      } else if (user) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          const token = session?.access_token;

          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/boards/${boardId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setBoard(data);
          } else {
            console.error("Failed to fetch board:", response.statusText);
            setBoard(null);
          }
        } catch (error) {
          console.error("Error fetching board:", error);
          setBoard(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBoard();
  }, [boardId, isGuest, user]);

  if (loading) return <div>Loading board...</div>;
  if (!board)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">
          Board not found or you don't have access.
        </div>
      </div>
    );

  return (
    <div
      className="h-screen w-full p-8"
      style={{
        backgroundColor: board.bg_color || "#ffffff",
        backgroundImage: board.img_url ? `url(${board.img_url})` : "none",
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
