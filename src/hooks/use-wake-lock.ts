import { useEffect } from "react";

/**
 * Keeps the screen awake while a round is in progress.
 *
 * The Screen Wake Lock is dropped by the browser whenever the page is hidden
 * (tab switch, app background, phone call), so it has to be re-requested on
 * `visibilitychange`. It also needs a secure context and, on iOS, a real user
 * gesture — entering play comes from a tap, and the re-request happens after a
 * tap-driven session, so both are satisfied.
 *
 * Unsupported browsers (older iOS) simply keep their normal sleep behaviour.
 */
export const useWakeLock = (active = true) => {
	useEffect(() => {
		if (!active) {
			return;
		}
		if (typeof navigator === "undefined" || !("wakeLock" in navigator)) {
			return;
		}

		let sentinel: WakeLockSentinel | null = null;
		let disposed = false;

		const acquire = async () => {
			if (disposed || document.visibilityState !== "visible") {
				return;
			}
			try {
				const lock = await navigator.wakeLock.request("screen");
				if (disposed) {
					await lock.release();
					return;
				}
				sentinel = lock;
			} catch {
				// Denied or unsupported: the timer still works, the screen may sleep.
			}
		};

		const onVisibilityChange = () => {
			if (document.visibilityState === "visible" && !sentinel) {
				void acquire();
			}
		};

		void acquire();
		document.addEventListener("visibilitychange", onVisibilityChange);

		return () => {
			disposed = true;
			document.removeEventListener("visibilitychange", onVisibilityChange);
			void sentinel?.release().catch(() => {});
			sentinel = null;
		};
	}, [active]);
};
