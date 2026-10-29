import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

/**
 * Deck and round data is fetched on the client with Query, so screens can show
 * their own `isPending` state instead of blocking navigation on a loader.
 */
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Decks are static JSON: no need to refetch on focus.
			staleTime: 5 * 60 * 1000,
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

export const QueryProvider = ({ children }: { children: ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
