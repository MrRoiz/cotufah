import type * as React from "react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * A form row: the fieldset that marks its control invalid, plus the error line.
 * The rest of the shadcn field API is added back when a screen needs it.
 */
const Field = ({ className, ...props }: React.ComponentProps<"fieldset">) => {
	return (
		<fieldset
			data-slot="field"
			className={cn(
				"group/field flex w-full min-w-0 flex-col gap-2 data-[invalid=true]:text-destructive *:w-full [&>.sr-only]:w-auto",
				className,
			)}
			{...props}
		/>
	);
};

const FieldError = ({
	className,
	children,
	errors,
	...props
}: React.ComponentProps<"div"> & {
	errors?: Array<{ message?: string } | undefined>;
}) => {
	const content = useMemo(() => {
		if (children) {
			return children;
		}

		if (!errors?.length) {
			return null;
		}

		const uniqueErrors = [
			...new Map(errors.map((error) => [error?.message, error])).values(),
		];

		if (uniqueErrors?.length === 1) {
			return uniqueErrors[0]?.message;
		}

		return (
			<ul className="ml-4 flex list-disc flex-col gap-1">
				{uniqueErrors.map((error) =>
					error?.message ? <li key={error.message}>{error.message}</li> : null,
				)}
			</ul>
		);
	}, [children, errors]);

	if (!content) {
		return null;
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			className={cn("font-normal text-destructive text-sm", className)}
			{...props}
		>
			{content}
		</div>
	);
};

export { Field, FieldError };
