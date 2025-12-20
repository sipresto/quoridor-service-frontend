import {makeAiMove} from "../services/gameService.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export function useMakeAiMove(gameId: string) {
    const queryClient = useQueryClient()

    const {mutate: triggerAiMove, isPending, isError, error} = useMutation({
        mutationFn: () => makeAiMove(gameId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['gameState', gameId]})
        }
    })

    return {triggerAiMove, isPending, isError, error}
}