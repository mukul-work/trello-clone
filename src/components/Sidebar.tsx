"use client";

import { Plus, LayoutDashboard, ChevronRight, Menu, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Board } from "@/lib/mock-data";

interface SidebarProps {
  boards: Board[];
  selectedBoardId: string;
  onSelectBoard: (boardId: string) => void;
  isLoading?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ boards, selectedBoardId, onSelectBoard, isLoading, isCollapsed, onToggleCollapse }: SidebarProps) {
  if (isLoading) {
    return (
      <aside className={cn(
        "flex flex-col border-r border-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-14" : "w-64"
      )}>
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && <div className="h-4 w-20 animate-pulse rounded bg-muted" />}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            <span className="sr-only">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </Button>
        </div>
        {!isCollapsed && (
          <nav className="flex-1 space-y-1 px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
            ))}
          </nav>
        )}
      </aside>
    );
  }

  return (
    <aside className={cn(
      "flex flex-col border-r border-border bg-sidebar transition-all duration-300",
      isCollapsed ? "w-14" : "w-64"
    )}>
      <div className={cn("flex items-center p-4", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && <h2 className="text-sm font-medium text-muted-foreground">Your Boards</h2>}
        <div className="flex items-center gap-1">
          {!isCollapsed && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Create board</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            <span className="sr-only">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </Button>
        </div>
      </div>
      <nav className={cn("flex-1 space-y-1", isCollapsed ? "px-2" : "px-2")}>
        {isCollapsed ? (
          boards.map((board) => (
            <button
              key={board.id}
              onClick={() => onSelectBoard(board.id)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                selectedBoardId === board.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )}
              title={board.title}
            >
              <LayoutDashboard className="h-4 w-4" />
            </button>
          ))
        ) : boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <LayoutDashboard className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No boards yet</p>
            <Button variant="link" size="sm" className="mt-1 text-primary">
              Create your first board
            </Button>
          </div>
        ) : (
          boards.map((board) => (
            <button
              key={board.id}
              onClick={() => onSelectBoard(board.id)}
              className={cn(
                "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                selectedBoardId === board.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="truncate">{board.title}</span>
              </div>
              <ChevronRight
                className={cn(
                  "h-4 w-4 opacity-0 transition-opacity",
                  selectedBoardId === board.id ? "opacity-100" : "group-hover:opacity-50"
                )}
              />
            </button>
          ))
        )}
      </nav>
    </aside>
  );
}
