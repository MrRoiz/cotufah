import { useEffect, useState } from "react";

/** Absolute URL for a path on this origin; empty during SSR. */
export const useAbsoluteUrl = (path: string): string => {
	const [url, setUrl] = useState("");

	useEffect(() => {
		setUrl(`${window.location.origin}${path}`);
	}, [path]);

	return url;
};
