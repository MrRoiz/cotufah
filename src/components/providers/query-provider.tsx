import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

/**
 * Deck and round data is fetched on the client with Query, so screens can show
 * their own `isPending` state instead of blocking navigation on a loader.
 */
const createQueryClient = () =>
	new QueryClient({
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
	// One client per mounted tree, so a server render never shares a cache
	// across requests.
	const [queryClient] = useState(createQueryClient);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
