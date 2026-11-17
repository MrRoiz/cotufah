import { useEffect, useState } from "react";

import { type LastRound, readLastRound } from "@/games/last-round";

/**
 * The last round started on this phone. Read after mount: storage does not
 * exist on the server, and reading it during render would break hydration.
 */
export const useLastRound = (): LastRound | null => {
	const [lastRound, setLastRound] = useState<LastRound | null>(null);

	useEffect(() => {
		setLastRound(readLastRound());
	}, []);

	return lastRound;
};
