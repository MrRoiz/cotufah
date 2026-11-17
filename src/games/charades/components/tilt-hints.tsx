import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import type { Messages } from "@/i18n";

/** A reminder along the stage's bottom edge of which tilt means what. */
export const TiltHints = ({ m }: { m: Messages }) => (
	<div className="flex w-full items-center justify-between gap-3">
		<span className="inline-flex items-center gap-2 rounded-full border-2 border-accent-fuchsia px-3.5 py-1.5 font-extrabold text-accent-fuchsia text-sm">
			<ArrowUpIcon aria-hidden="true" className="size-4" />
			{`${m.charades.tiltPass}: ${m.charades.pass}`}
		</span>
		<span className="inline-flex items-center gap-2 rounded-full border-2 border-accent-lime px-3.5 py-1.5 font-extrabold text-accent-lime text-sm">
			<ArrowDownIcon aria-hidden="true" className="size-4" />
			{`${m.charades.tiltCorrect}: ${m.charades.correct}`}
		</span>
	</div>
);
