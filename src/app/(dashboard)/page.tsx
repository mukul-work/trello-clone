"use client";

import { useSession, signIn } from "next-auth/react";
import { useBoards } from "@/lib/hooks/useBoards";

export default function DashboardPage() {
  // 🔹 1. Auth state
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    signIn();
    return null;
  }

  // 🔹 2. Extract userId from session
  const userId = session.user.id!;

  // 🔹 3. Fetch + mutate boards
  const {
    data: boards,
    isLoading,
    error,
    createBoard,
    creating,
  } = useBoards(userId);

  // 🔹 4. Create board handler
  function handleCreate() {
    createBoard({
      title: "New Board",
      ownerId: userId,
    });
  }

  // 🔹 5. Loading + error states
  if (isLoading) return <p>Loading boards...</p>;
  if (error) return <p>Something went wrong</p>;

  // 🔹 6. UI
  return (
    <div style={{ padding: 20 }}>
      <h1>Your Boards</h1>

      <button onClick={handleCreate} disabled={creating}>
        {creating ? "Creating..." : "Create Board"}
      </button>

      <div style={{ marginTop: 20 }}>
        {boards?.map((board) => (
          <div
            key={board._id}
            style={{
              padding: 10,
              border: "1px solid #ccc",
              marginBottom: 10,
            }}
          >
            {board.title}
          </div>
        ))}
      </div>
    </div>
  );
}