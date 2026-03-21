"use client";

import { useSession, signIn } from "next-auth/react";
import { useBoards } from "@/lib/hooks/useBoards";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    signIn();
    return null;
  }

  const userId = session.user.id!;
  const { data: boards, isLoading, error } = useBoards(userId);

  if (isLoading) return <p>Loading boards...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div>
      <h1>Your Boards</h1>

      {boards?.map((board) => (
        <div key={board._id}>
          {board.title}
        </div>
      ))}
    </div>
  );
}