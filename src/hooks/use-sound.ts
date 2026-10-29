import { useSyncExternalStore } from "react";

import {
	getSoundMuted,
	getSoundMutedServer,
	subscribeSound,
} from "@/lib/sound";

/** Mute state for the settings toggle; every consumer updates together. */
export const useSoundMuted = () =>
	useSyncExternalStore(subscribeSound, getSoundMuted, getSoundMutedServer);
