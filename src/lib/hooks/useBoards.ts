"use client";

import { useQuery } from "@tanstack/react-query";
import { getBoards } from "@/lib/api/boards";

export function useBoards(userId: string) {
  return useQuery({
    queryKey: ["boards", userId],
    queryFn: () => getBoards(userId),
  });
}