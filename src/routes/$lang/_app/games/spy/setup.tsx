import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { BackLink } from "@/components/back-link";
import { CategoryField } from "@/components/category-field";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { app } from "@/config/app";
import { type CategoryChoice, isCategoryChoice } from "@/data/schema";
import { createPlayersSchema } from "@/games/spy/setup-schema";
import { MIN_PLAYERS } from "@/games/spy/use-spy-round";
import { getMessages, interpolate } from "@/i18n";

const MAX_PLAYERS = 12;

const SpySetup = () => {
	const { lang } = Route.useParams();
	const { category = "clasico" } = Route.useSearch();
	const m = getMessages(lang);
	const navigate = useNavigate();
	const nextPlayerId = useRef(MIN_PLAYERS + 1);
	const [spies, setSpies] = useState(1);
	const schema = useMemo(() => createPlayersSchema(m), [m]);

	const form = useForm({
		defaultValues: {
			players: Array.from({ length: MIN_PLAYERS }, (_, index) => ({
				id: index + 1,
				name: "",
			})),
		},
		validators: { onMount: schema, onChange: schema },
		onSubmit: ({ value }) => {
			const names = value.players.map((player) => player.name.trim());
			navigate({
				to: "/$lang/games/spy/play",
				params: { lang },
				search: {
					category,
					players: names.map(encodeURIComponent).join("|"),
					spies: Math.min(spies, Math.max(1, names.length - 1)),
				},
			});
		},
	});

	return (
		<AppShell
			footer={
				<form.Subscribe selector={(state) => state.canSubmit}>
					{(canSubmit) => (
						<Button
							className="w-full"
							disabled={!canSubmit}
							form="spy-setup"
							size="lg"
							type="submit"
							variant={canSubmit ? "sticker" : "outline"}
						>
							{m.spy.start}
						</Button>
					)}
				</form.Subscribe>
			}
		>
			<form
				className="flex flex-1 flex-col"
				id="spy-setup"
				noValidate
				onSubmit={(event) => {
					event.preventDefault();
					form.handleSubmit();
				}}
			>
				<header className="flex flex-col gap-3 pt-6 pb-6">
					<BackLink label={m.common.back} lang={lang} />
					<h1 className="font-display text-4xl uppercase">
						{m.games.spy.name}
					</h1>
					<p className="text-muted-foreground">{m.spy.setupIntro}</p>
				</header>

				<section className="flex flex-col gap-3">
					<h2 className="font-bold text-lg">{m.spy.playersTitle}</h2>
					<form.Field name="players" mode="array">
						{(field) => (
							<div className="flex flex-col gap-2">
								<ul className="flex flex-col gap-2">
									{field.state.value.map((player, index) => (
										<li className="flex items-start gap-2" key={player.id}>
											<form.Field name={`players[${index}].name`}>
												{(sub) => {
													const invalid =
														sub.state.meta.isTouched && !sub.state.meta.isValid;
													return (
														<Field className="flex-1" data-invalid={invalid}>
															<Label
																className="sr-only"
																htmlFor={`player-${index}`}
															>
																{interpolate(m.spy.playerLabel, {
																	n: index + 1,
																})}
															</Label>
															<Input
																aria-invalid={invalid}
																autoComplete="off"
																className="h-12"
																id={`player-${index}`}
																name={sub.name}
																onBlur={sub.handleBlur}
																onChange={(event) =>
																	sub.handleChange(event.target.value)
																}
																placeholder={interpolate(m.spy.playerLabel, {
																	n: index + 1,
																})}
																value={sub.state.value}
															/>
															{invalid && (
																<FieldError errors={sub.state.meta.errors} />
															)}
														</Field>
													);
												}}
											</form.Field>
											<Button
												aria-label={m.spy.removePlayer}
												className="size-12 shrink-0"
												disabled={field.state.value.length <= MIN_PLAYERS}
												onClick={() => field.removeValue(index)}
												size="icon"
												type="button"
												variant="outline"
											>
												<XIcon aria-hidden="true" />
											</Button>
										</li>
									))}
								</ul>

								<form.Subscribe
									selector={(state) =>
										state.values.players.filter((player) => player.name.trim())
											.length
									}
								>
									{(filled) =>
										filled < MIN_PLAYERS ? (
											<p className="text-center text-muted-foreground text-xs">
												{m.spy.minPlayers}
											</p>
										) : null
									}
								</form.Subscribe>

								<Button
									disabled={field.state.value.length >= MAX_PLAYERS}
									onClick={() =>
										field.pushValue({ id: nextPlayerId.current++, name: "" })
									}
									type="button"
									variant="outline"
								>
									<PlusIcon aria-hidden="true" />
									{m.spy.addPlayer}
								</Button>
							</div>
						)}
					</form.Field>
				</section>

				<section className="mt-8 flex flex-col gap-3">
					<h2 className="font-bold text-lg">{m.spy.spiesTitle}</h2>
					<p className="text-muted-foreground text-sm">{m.spy.spiesHint}</p>
					<form.Subscribe selector={(state) => state.values.players.length}>
						{(count) => {
							const maxSpies = Math.max(1, count - 1);
							return (
								<div className="flex items-center gap-4 rounded-xl border-2 border-border p-3">
									<Button
										aria-label={m.spy.removePlayer}
										disabled={spies <= 1}
										onClick={() => setSpies((value) => Math.max(1, value - 1))}
										size="icon"
										type="button"
										variant="outline"
									>
										<MinusIcon aria-hidden="true" />
									</Button>
									<span className="flex-1 text-center font-display text-3xl">
										{Math.min(spies, maxSpies)}
									</span>
									<Button
										aria-label={m.spy.addPlayer}
										disabled={spies >= maxSpies}
										onClick={() =>
											setSpies((value) => Math.min(maxSpies, value + 1))
										}
										size="icon"
										type="button"
										variant="outline"
									>
										<PlusIcon aria-hidden="true" />
									</Button>
								</div>
							);
						}}
					</form.Subscribe>
				</section>

				<CategoryField
					category={category}
					locale={lang}
					onChange={(value) =>
						navigate({
							to: "/$lang/games/spy/setup",
							params: { lang },
							search: { category: value },
							replace: true,
						})
					}
				/>
			</form>
		</AppShell>
	);
};

export const Route = createFileRoute("/$lang/_app/games/spy/setup")({
	// In the URL so the deck survives a trip to "Manage decks" and back.
	validateSearch: (
		search: Record<string, unknown>,
	): { category?: CategoryChoice } => ({
		category: isCategoryChoice(search.category) ? search.category : undefined,
	}),
	head: ({ params }) => {
		const m = getMessages(params.lang);
		return {
			meta: [
				{ name: "robots", content: "noindex" },
				{ title: `${m.games.spy.name} — ${app.name}` },
				{ name: "description", content: m.spy.setupIntro },
			],
		};
	},
	component: SpySetup,
});
