"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BoardPage() {
  const params = useParams();
  const boardId = params.id as string;

  const [lists, setLists] = useState<any[]>([]);
  const [cardsMap, setCardsMap] = useState<{ [key: string]: any[] }>({});
  const [newListTitle, setNewListTitle] = useState("");

  useEffect(() => {
    if (!boardId) return;
    fetchLists();
  }, [boardId]);

  async function fetchLists() {
    const res = await fetch(`/api/lists?boardId=${boardId}`);
    const data = await res.json();
    setLists(data);

    data.forEach((list: any) => fetchCards(list._id));
  }

  async function fetchCards(listId: string) {
    const res = await fetch(`/api/cards?listId=${listId}`);
    const data = await res.json();

    setCardsMap((prev) => ({ ...prev, [listId]: data }));
  }

  async function handleCreateList() {
    if (!newListTitle.trim()) return;

    await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        boardId,
        title: newListTitle,
        order: lists.length,
      }),
    });

    setNewListTitle("");
    fetchLists();
  }

  return (
    <div>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>
        Board
      </h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        {lists.map((list) => (
          <ListColumn
            key={list._id}
            list={list}
            cards={cardsMap[list._id] || []}
          />
        ))}

        <div
          style={{
            width: 260,
            padding: 12,
            borderRadius: 8,
            border: "1px dashed #374151",
          }}
        >
          <input
            placeholder="Add list"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 8,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #374151",
              background: "#111827",
              color: "#e5e7eb",
            }}
          />

          <button
            onClick={handleCreateList}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add List
          </button>
        </div>
      </div>
    </div>
  );
}

function ListColumn({ list, cards }: any) {
  return (
    <div
      style={{
        width: 260,
        background: "#111827",
        borderRadius: 8,
        padding: 12,
        border: "1px solid #1f2937",
      }}
    >
      <div
        style={{
          marginBottom: 10,
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {list.title}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cards.map((card: any) => (
          <div
            key={card._id}
            style={{
              padding: 10,
              borderRadius: 6,
              background: "#1f2937",
              border: "1px solid #374151",
              fontSize: 14,
            }}
          >
            {card.title}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 13,
          color: "#9ca3af",
          cursor: "pointer",
        }}
      >
        + Add Card
      </div>
    </div>
  );
}