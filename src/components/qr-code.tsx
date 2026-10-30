import { useEffect, useState } from "react";

/**
 * QR for "open this on your phone". The encoder is loaded on demand so the
 * landing/app shell doesn't pay for it until a QR is actually rendered.
 */
/** Absolute URL for a path on this origin; empty during SSR. */
export const useAbsoluteUrl = (path: string): string => {
	const [url, setUrl] = useState("");

	useEffect(() => {
		setUrl(`${window.location.origin}${path}`);
	}, [path]);

	return url;
};

export const QrCode = ({
	path,
	alt,
	className,
	size = 176,
}: {
	/** Path on this origin, e.g. `/es/games`. */
	path: string;
	alt: string;
	className?: string;
	size?: number;
}) => {
	const [src, setSrc] = useState("");
	const url = useAbsoluteUrl(path);

	useEffect(() => {
		let cancelled = false;

		if (!url) {
			return;
		}
		import("uqr").then(({ renderSVG }) => {
			if (cancelled) {
				return;
			}
			// Inline SVG as a data URI: no dangerouslySetInnerHTML, no request.
			setSrc(
				`data:image/svg+xml;utf8,${encodeURIComponent(renderSVG(url, { border: 1, ecc: "M" }))}`,
			);
		});

		return () => {
			cancelled = true;
		};
	}, [url]);

	if (!src) {
		return <div aria-hidden="true" className={className} />;
	}

	return (
		<img alt={alt} className={className} height={size} src={src} width={size} />
	);
};
