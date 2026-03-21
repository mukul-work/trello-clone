"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return (
      <div>
        <p>Not logged in</p>
        <button onClick={() => signIn()}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome {session.user?.email}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}