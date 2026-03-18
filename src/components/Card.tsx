"use client";

import { X, Circle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Card as CardType } from "@/lib/mock-data";

interface CardProps {
  card: CardType;
  onDelete: (cardId: string) => void;
  onToggleComplete: (cardId: string) => void;
}

export function Card({ card, onDelete, onToggleComplete }: CardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(card.id);
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(card.id);
  };

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring",
        card.completed && "opacity-60"
      )}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${card.title}${card.completed ? " (completed)" : ""}`}
    >
      <button
        onClick={handleToggleComplete}
        className="mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-primary focus:outline-none"
        aria-label={card.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {card.completed ? (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn(
          "text-sm font-medium text-card-foreground",
          card.completed && "line-through text-muted-foreground"
        )}>
          {card.title}
        </p>
        {card.description && (
          <p className={cn(
            "mt-1 text-xs text-muted-foreground line-clamp-2",
            card.completed && "line-through"
          )}>
            {card.description}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={handleDelete}
        aria-label={`Delete ${card.title}`}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
