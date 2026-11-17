import { useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";

import type { Locale } from "@/config/app";
import { getMessages } from "@/i18n";

/**
 * Back follows browser history, so it returns to the screen the player came
 * from (setup, picker, landing). A cold load has no in-app entry to go back to,
 * so it falls back to the landing page instead of leaving the site.
 */
export const BackLink = ({ lang }: { lang: Locale }) => {
	const label = getMessages(lang).common.back;
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
			aria-label={label}
			className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-card"
			onClick={goBack}
			title={label}
			type="button"
		>
			<ChevronLeftIcon aria-hidden="true" className="size-6" />
		</button>
	);
};
