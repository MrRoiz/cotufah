import { MAX_PLAYERS } from "@/games/spy/rules";
import { interpolate, type Messages } from "@/i18n";

const MIN_NAME_LENGTH = 3;

/**
 * Checks one name before it joins the list, so the list itself is always
 * valid: at least three letters, unique for the round, and room left.
 * Returns the message to show, or `null` when the name can be added.
 */
export const validatePlayerName = ({
	m,
	name,
	players,
}: {
	m: Messages;
	name: string;
	players: string[];
}): string | null => {
	if (players.length >= MAX_PLAYERS) {
		return interpolate(m.spy.maxPlayers, { max: MAX_PLAYERS });
	}

	if (name.length < MIN_NAME_LENGTH) {
		return interpolate(m.spy.nameTooShort, { min: MIN_NAME_LENGTH });
	}

	const key = name.toLocaleLowerCase();
	const isTaken = players.some((player) => player.toLocaleLowerCase() === key);
	if (isTaken) {
		return m.spy.duplicateNames;
	}

	return null;
};
