"use client";

import { useState } from "react";
import { ListColumn } from "./ListColumn";
import { AddListButton } from "./AddListButton";
import { LayoutDashboard, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Board as BoardType, List } from "@/lib/mock-data";

interface BoardProps {
  board: BoardType | undefined;
  onAddCard: (listId: string, cardTitle: string) => void;
  onAddList: (listTitle: string) => void;
  onDeleteCard: (listId: string, cardId: string) => void;
  onDeleteList: (listId: string) => void;
  onToggleCardComplete: (listId: string, cardId: string) => void;
  isLoading?: boolean;
}

function BoardSkeleton() {
  return (
    <div className="flex gap-4 p-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-72 shrink-0 rounded-xl border border-border bg-card">
          <div className="p-3">
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-2 px-3 pb-3">
            {[1, 2].map((j) => (
              <div key={j} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
          <div className="border-t border-border p-2">
            <div className="h-9 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface EmptyBoardProps {
  onAddList: (title: string) => void;
}

function EmptyBoard({ onAddList }: EmptyBoardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddList(title.trim());
      setTitle("");
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <LayoutDashboard className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold text-foreground">Create your first list</h2>
        <form onSubmit={handleSubmit} className="mt-4 w-72">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setIsAdding(false)}
            placeholder="Enter list title..."
            autoFocus
            className="w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="mt-2 flex items-center gap-2">
            <Button type="submit" size="sm" disabled={!title.trim()}>
              Add List
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsAdding(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <LayoutDashboard className="mb-4 h-16 w-16 text-muted-foreground" />
      <h2 className="mb-2 text-xl font-semibold text-foreground">No lists yet</h2>
      <p className="mb-4 text-muted-foreground">Get started by creating your first list</p>
      <Button className="gap-2" onClick={() => setIsAdding(true)}>
        <Plus className="h-4 w-4" />
        Create List
      </Button>
    </div>
  );
}

export function Board({ board, onAddCard, onAddList, onDeleteCard, onDeleteList, onToggleCardComplete, isLoading }: BoardProps) {
  if (isLoading) {
    return <BoardSkeleton />;
  }

  if (!board) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a board to get started</p>
      </div>
    );
  }

  if (board.lists.length === 0) {
    return <EmptyBoard onAddList={onAddList} />;
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto p-6 scrollbar-thin">
      {board.lists.map((list: List) => (
        <ListColumn
          key={list.id}
          list={list}
          onAddCard={onAddCard}
          onDeleteCard={onDeleteCard}
          onDeleteList={onDeleteList}
          onToggleCardComplete={onToggleCardComplete}
        />
      ))}
      <AddListButton onAdd={onAddList} />
    </div>
  );
}
