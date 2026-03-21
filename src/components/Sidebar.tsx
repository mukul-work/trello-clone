"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [boards, setBoards] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetchBoards();
  }, []);

  async function fetchBoards() {
    const res = await fetch("/api/boards");
    const data = await res.json();
    setBoards(data);
  }

  return (
    <aside
      style={{
        width: 240,
        background: "#0f172a",
        borderRight: "1px solid #1f2937",
        padding: 16,
      }}
    >
      <h2 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}>
        TaskFlow
      </h2>

      <div
        style={{
          fontSize: 12,
          color: "#9ca3af",
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        Boards
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {boards.map((board) => {
          const active = pathname === `/board/${board._id}`;

          return (
            <div
              key={board._id}
              onClick={() =>
                (window.location.href = `/board/${board._id}`)
              }
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                cursor: "pointer",
                background: active ? "#1f2937" : "transparent",
                fontSize: 14,
              }}
            >
              {board.title}
            </div>
          );
        })}
      </div>
    </aside>
  );
}