/**
 * Device motion capability, shared by the tilt gesture and the intro probe:
 * what counts as a real sensor reading and which platforms gate it.
 */

type PermissionRequester = {
	requestPermission?: () => Promise<"granted" | "denied" | "default">;
};

/** |g| ≈ 9.8 on a real accelerometer; browsers with no sensor emit zeros. */
export const hasGravity = (event: DeviceMotionEvent): boolean => {
	const gravity = event.accelerationIncludingGravity;
	if (!gravity) {
		return false;
	}
	const magnitude = Math.hypot(gravity.x ?? 0, gravity.y ?? 0, gravity.z ?? 0);
	return magnitude > 3;
};

/** iOS 13+ gates motion sensors behind a user gesture; every other platform does not. */
export const isIosDevice = (): boolean => {
	const ua = navigator.userAgent;
	return (
		/iPad|iPhone|iPod/.test(ua) ||
		(/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
	);
};

/**
 * Must be called from a tap. Whether it is granted only changes which controls
 * the round offers, and the round detects that from the events themselves.
 */
export const requestMotionPermission = async (): Promise<void> => {
	if (typeof DeviceMotionEvent === "undefined") {
		return;
	}

	const requester = DeviceMotionEvent as unknown as PermissionRequester;
	if (typeof requester.requestPermission !== "function") {
		return;
	}

	try {
		await requester.requestPermission();
	} catch {
		// Denied: the round falls back to the tap zones.
	}
};
