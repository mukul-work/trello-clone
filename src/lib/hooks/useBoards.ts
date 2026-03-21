import { useQuery } from "@tanstack/react-query";
import { getBoards } from "@/lib/api/boards";
import { useSession } from "next-auth/react";

export function useBoards() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["boards", session?.user?.id],
    queryFn: () => getBoards(session!.user!.id),
    enabled: !!session?.user?.id,
  });
}