import { type ReactNode, useEffect } from "react";

import { installAudioUnlock } from "@/lib/sound";
import { cn } from "@/lib/utils";

/**
 * The phone frame. Everything in the app lives inside this 430px column with
 * safe-area padding; desktop is handled by the phone gate, not by stretching.
 */
export const AppShell = ({
	children,
	footer,
	className,
}: {
	children: ReactNode;
	footer?: ReactNode;
	className?: string;
}) => {
	// One listener for the first interaction of the page load, then it detaches.
	useEffect(installAudioUnlock, []);

	return (
		<div
			className={cn(
				"mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background",
				className,
			)}
		>
			<div className="flex flex-1 flex-col px-safe pt-safe pb-6">
				{children}
			</div>
			{footer ? (
				// Sticks to the bottom so the main action stays reachable on long
				// lists (a full deck list, a setup form with many players).
				<div className="sticky bottom-0 z-10 mt-auto border-t-2 border-border bg-background px-safe pt-3 pb-safe">
					{footer}
				</div>
			) : null}
		</div>
	);
};
