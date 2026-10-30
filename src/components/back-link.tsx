import { useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import type { Locale } from "@/config/app";

/**
 * Back follows browser history, so it returns to the screen the player came
 * from (setup, picker, landing). A cold load has no in-app entry to go back to,
 * so it falls back to the landing page instead of leaving the site.
 */
export const BackLink = ({ label, lang }: { label: string; lang: Locale }) => {
	const router = useRouter();
	const navigate = useNavigate();

	const goBack = () => {
		if (router.history.canGoBack()) {
			router.history.back();
			return;
		}
		navigate({ params: { lang }, to: "/$lang" });
	};

	return (
		<button
			className="inline-flex min-h-12 w-fit items-center gap-1 font-bold text-muted-foreground text-sm"
			onClick={goBack}
			type="button"
		>
			<ArrowLeftIcon aria-hidden="true" className="size-4" />
			{label}
		</button>
	);
};
