"use client";

import { useState } from "react";
import { Plus, Inbox, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "./Card";
import { AddCardModal } from "./AddCardModal";
import type { List, Card as CardType } from "@/lib/mock-data";

interface ListColumnProps {
  list: List;
  onAddCard: (listId: string, cardTitle: string) => void;
  onDeleteCard: (listId: string, cardId: string) => void;
  onDeleteList: (listId: string) => void;
  onToggleCardComplete: (listId: string, cardId: string) => void;
}

export function ListColumn({ list, onAddCard, onDeleteCard, onDeleteList, onToggleCardComplete }: ListColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCard = (title: string) => {
    onAddCard(list.id, title);
  };

  const handleDeleteCard = (cardId: string) => {
    onDeleteCard(list.id, cardId);
  };

  const handleToggleComplete = (cardId: string) => {
    onToggleCardComplete(list.id, cardId);
  };

  return (
    <>
      <div className="flex w-72 shrink-0 flex-col rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-card-foreground">{list.title}</h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {list.cards.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDeleteList(list.id)}
            aria-label={`Delete ${list.title} list`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex max-h-[calc(100vh-280px)] flex-1 flex-col gap-2 overflow-y-auto px-3 pb-2 scrollbar-thin">
          {list.cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Inbox className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No cards yet</p>
            </div>
          ) : (
            list.cards.map((card: CardType) => (
              <Card key={card.id} card={card} onDelete={handleDeleteCard} onToggleComplete={handleToggleComplete} />
            ))
          )}
        </div>

        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        </div>
      </div>

      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCard}
        listTitle={list.title}
      />
    </>
  );
}
