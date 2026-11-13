/** The fuchsia-bulleted list the legal clauses use. */
export const DocumentList = ({ items }: { items: string[] }) => {
	return (
		<ul className="flex flex-col gap-2">
			{items.map((item) => (
				<li className="flex gap-2" key={item}>
					<span aria-hidden="true" className="font-bold text-accent-fuchsia">
						•
					</span>
					{item}
				</li>
			))}
		</ul>
	);
};
