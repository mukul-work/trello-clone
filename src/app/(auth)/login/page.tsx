"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome to Trello Clone</h1>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        style={{
          padding: 10,
          background: "black",
          color: "white",
          border: "none",
        }}
      >
        Continue with Google
      </button>
    </div>
  );
}