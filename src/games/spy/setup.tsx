import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon, XIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Locale } from "@/config/app";
import type { CategoryChoice } from "@/decks/categories";
import { CategoryField } from "@/decks/components/category-field";
import { SpyCountField } from "@/games/spy/components/spy-count-field";
import {
	clampSpyCount,
	MAX_PLAYERS,
	MIN_PLAYERS,
	serializePlayers,
} from "@/games/spy/rules";
import { createPlayersSchema } from "@/games/spy/setup-schema";
import { getMessages, interpolate } from "@/i18n";
import { AppShell } from "@/layout/app-shell";
import { AppPageHeader } from "@/ui/app-page-header";
import { Button } from "@/ui/button";
import { Field, FieldError } from "@/ui/field";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

export const SpySetup = ({
	lang,
	category,
}: {
	lang: Locale;
	category: CategoryChoice;
}) => {
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
					players: serializePlayers(names),
					spies: clampSpyCount(spies, names.length),
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
				<AppPageHeader
					lang={lang}
					subtitle={m.spy.setupIntro}
					title={m.games.spy.name}
				/>

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
													const label = interpolate(m.spy.playerLabel, {
														n: index + 1,
													});
													return (
														<Field className="flex-1" data-invalid={invalid}>
															<Label
																className="sr-only"
																htmlFor={`player-${index}`}
															>
																{label}
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
																placeholder={label}
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

				<form.Subscribe selector={(state) => state.values.players.length}>
					{(count) => (
						<SpyCountField
							m={m}
							onChange={setSpies}
							playerCount={count}
							spies={spies}
						/>
					)}
				</form.Subscribe>

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
