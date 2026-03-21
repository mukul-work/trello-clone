"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBoards, createBoard } from "@/lib/api/boards";

export function useBoards(userId: string) {
  const queryClient = useQueryClient();

  // 🔹 Fetch boards
  const query = useQuery({
    queryKey: ["boards", userId],
    queryFn: () => getBoards(userId),
  });

  // 🔹 Create board mutation
  const mutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", userId] });
    },
  });

  return {
    ...query,
    createBoard: mutation.mutate,
    creating: mutation.isPending,
  };
}