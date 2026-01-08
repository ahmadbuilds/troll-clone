import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

const Dashboard = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        if (!isGuest) {
          // Upload to Supabase Storage
          const fileExt = imageFile.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("Troll")
            .upload(filePath, imageFile);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("Troll").getPublicUrl(filePath);
          imageUrl = publicUrl;
        } else {
          // Guest: Convert to Base64 for local storage
          imageUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imageFile);
          });
        }
      }

      const newBoardBase = {
        title,
        bg_color: bgColor,
        img_url: imageUrl, // Backend uses img_url, Frontend/Sidebar used img_url/image_url?
        // Sidebar checks board.bg_color.
        // Backend 'createBoard' expects 'img_url'.
        // Let's stick to 'img_url'.
      };

      if (isGuest) {
        const boardId = crypto.randomUUID();
        const boardWithId = {
          ...newBoardBase,
          id: boardId,
          created_at: new Date().toISOString(),
        };

        const stored = JSON.parse(localStorage.getItem("guest_boards") || "[]");
        const updatedBoards = [...stored, boardWithId];
        localStorage.setItem("guest_boards", JSON.stringify(updatedBoards));

        // Dispatch event for Sidebar
        window.dispatchEvent(new Event("boardCreated"));

        navigate(`/board/${boardId}`);
      } else {
        // User: POST to Backend
        const payload = {
          ...newBoardBase,
          user_id: user.id,
        };

        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        const response = await fetch("http://localhost:5000/api/boards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create board");
        }

        const createdBoard = await response.json();
        // Dispatch event for Sidebar
        window.dispatchEvent(new Event("boardCreated"));

        // Navigate. Check if 'createdBoard' has 'board_id' or 'id'
        // Backend returns `newBoard`. boardModel.createBoard returns the inserted row.
        // DB schema: board_id uuid primary key.
        navigate(`/board/${createdBoard.board_id}`);
      }
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Error creating board: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome,{" "}
        {isGuest ? "Guest" : user?.username || user?.email?.split("@")[0]}!
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create a New Board
        </h2>

        <form onSubmit={handleCreateBoard} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Board Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Project Launch, Vacation Planning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-12 w-24 border border-gray-300 rounded cursor-pointer"
                />
                <span className="text-gray-500 text-sm">{bgColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors cursor-pointer"
              />
            </div>
          </div>

          {isGuest && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800 rounded-r">
              <p className="text-sm">
                <strong>Guest Mode:</strong> Boards are saved locally in your
                browser. Clearing cache will remove them.
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 cursor-pointer"
            >
              {uploading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Board"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
