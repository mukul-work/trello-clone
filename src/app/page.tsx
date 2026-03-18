"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Board } from "@/components/Board";
import { boards as initialBoards, type Board as BoardType, type Card } from "@/lib/mock-data";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setBoards(initialBoards);
      setSelectedBoardId(initialBoards[0]?.id || "");
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const selectedBoard = boards.find((b) => b.id === selectedBoardId);

  // Filter cards based on search query
  const filteredBoard = selectedBoard && searchQuery.trim()
    ? {
        ...selectedBoard,
        lists: selectedBoard.lists.map((list) => ({
          ...list,
          cards: list.cards.filter(
            (card) =>
              card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              card.description?.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        })),
      }
    : selectedBoard;

  const handleAddCard = (listId: string, cardTitle: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) => {
        if (board.id !== selectedBoardId) return board;
        return {
          ...board,
          lists: board.lists.map((list) => {
            if (list.id !== listId) return list;
            const newCard: Card = {
              id: `c${Date.now()}`,
              title: cardTitle,
            };
            return {
              ...list,
              cards: [...list.cards, newCard],
            };
          }),
        };
      })
    );
  };

  const handleAddList = (listTitle: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) => {
        if (board.id !== selectedBoardId) return board;
        return {
          ...board,
          lists: [
            ...board.lists,
            {
              id: `l${Date.now()}`,
              title: listTitle,
              cards: [],
            },
          ],
        };
      })
    );
  };

  const handleDeleteCard = (listId: string, cardId: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) => {
        if (board.id !== selectedBoardId) return board;
        return {
          ...board,
          lists: board.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              cards: list.cards.filter((card) => card.id !== cardId),
            };
          }),
        };
      })
    );
  };

  const handleDeleteList = (listId: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) => {
        if (board.id !== selectedBoardId) return board;
        return {
          ...board,
          lists: board.lists.filter((list) => list.id !== listId),
        };
      })
    );
  };

  const handleToggleCardComplete = (listId: string, cardId: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) => {
        if (board.id !== selectedBoardId) return board;
        return {
          ...board,
          lists: board.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              cards: list.cards.map((card) => {
                if (card.id !== cardId) return card;
                return { ...card, completed: !card.completed };
              }),
            };
          }),
        };
      })
    );
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={setSelectedBoardId}
          isLoading={isLoading}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 overflow-hidden bg-background">
          {selectedBoard && (
            <div className="flex h-12 items-center border-b border-border px-6">
              <h1 className="text-lg font-semibold text-foreground">{selectedBoard.title}</h1>
            </div>
          )}
          <div className="h-[calc(100%-3rem)]">
            <Board
              board={filteredBoard}
              onAddCard={handleAddCard}
              onAddList={handleAddList}
              onDeleteCard={handleDeleteCard}
              onDeleteList={handleDeleteList}
              onToggleCardComplete={handleToggleCardComplete}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
