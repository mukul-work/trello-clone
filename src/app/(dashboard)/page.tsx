"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();

  const [boards, setBoards] = useState<any[]>([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      signIn("google");
      return;
    }

    fetchBoards();
  }, [session, status]);

  async function fetchBoards() {
    const res = await fetch("/api/boards");
    const data = await res.json();
    setBoards(data);
  }

  async function handleCreateBoard() {
    if (!newBoardTitle.trim()) return;

    await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newBoardTitle }),
    });

    setNewBoardTitle("");
    fetchBoards();
  }

  async function handleDeleteBoard(id: string) {
    await fetch(`/api/boards?id=${id}`, { method: "DELETE" });
    fetchBoards();
  }

  if (status === "loading") return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ marginBottom: 30, fontSize: 28 }}>
        Your Boards
      </h1>

      <div style={{ marginBottom: 30, display: "flex", gap: 10 }}>
        <input
          placeholder="Create a new board..."
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "none",
            outline: "none",
            width: 250,
            background: "#1e293b",
            color: "white",
          }}
        />
        <button
          onClick={handleCreateBoard}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "#3b82f6",
            color: "white",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          Create
        </button>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {boards.map((board) => (
          <div
            key={board._id}
            style={{
              width: 220,
              height: 120,
              padding: 15,
              borderRadius: 12,
              backdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            <span
              onClick={() =>
                (window.location.href = `/board/${board._id}`)
              }
              style={{ fontSize: 16 }}
            >
              {board.title}
            </span>

            <button
              onClick={() => handleDeleteBoard(board._id)}
              style={{
                background: "transparent",
                border: "none",
                color: "#ef4444",
                alignSelf: "flex-end",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}