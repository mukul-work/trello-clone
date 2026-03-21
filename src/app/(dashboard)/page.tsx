"use client";

import { useSession, signIn } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    signIn(); // redirect to login
    return null;
  }

  return <div>Dashboard</div>;
}