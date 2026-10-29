import { createFileRoute, notFound } from "@tanstack/react-router";
import { CheckIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { app } from "@/config/app";

const TokensPage = () => {
	const { theme, resolvedTheme } = useTheme();
	return (
		<AppShell
			footer={
				<div className="flex items-center justify-between gap-3">
					<div className="font-medium text-muted-foreground text-sm">
						{theme} · {resolvedTheme}
					</div>
					<ModeToggle locale="es" />
				</div>
			}
		>
			<header className="flex flex-col gap-2 pt-4 pb-6">
				<span className="w-fit -rotate-2 rounded-full border-2 border-foreground bg-accent-lime px-3 py-1 font-bold text-accent-ink text-xs uppercase tracking-widest shadow-sticker-sm">
					styleguide
				</span>
				<h1 className="text-display font-display uppercase">{app.name}</h1>
				<p className="text-muted-foreground">
					{app.tagline[app.defaultLocale]}
				</p>
			</header>

			<div className="flex flex-col gap-10">
				<Section
					title="Semantic tokens"
					description="Everything reads from these. No component may hardcode a color."
				>
					<div className="grid grid-cols-3 gap-3">
						<Swatch className="bg-background" token="background" />
						<Swatch className="bg-foreground" token="foreground" />
						<Swatch className="bg-card" token="card" />
						<Swatch className="bg-primary" token="primary" />
						<Swatch className="bg-secondary" token="secondary" />
						<Swatch className="bg-muted" token="muted" />
						<Swatch className="bg-accent" token="accent" />
						<Swatch className="bg-destructive" token="destructive" />
						<Swatch className="bg-border" token="border" />
						<Swatch className="bg-input" token="input" />
						<Swatch className="bg-ring" token="ring" />
						<Swatch className="bg-popover" token="popover" />
					</div>
				</Section>

				<Section
					title="Accents"
					description="Accent fills always carry ink text. That is the contrast rule."
				>
					<div className="grid grid-cols-2 gap-3">
						<Swatch
							className="bg-accent-lime"
							token="accent-lime"
							note="correct · CTA"
						/>
						<Swatch
							className="bg-accent-fuchsia"
							token="accent-fuchsia"
							note="attention"
						/>
						<Swatch
							className="bg-accent-cyan"
							token="accent-cyan"
							note="info"
						/>
						<Swatch className="bg-accent-plum" token="accent-plum" note="spy" />
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="rounded-full border-2 border-foreground bg-accent-lime px-3 py-1 font-bold text-accent-ink text-xs">
							INK ON LIME
						</span>
						<span className="rounded-full border-2 border-foreground bg-accent-fuchsia px-3 py-1 font-bold text-accent-ink text-xs">
							INK ON FUCHSIA
						</span>
						<span className="rounded-full border-2 border-foreground bg-accent-cyan px-3 py-1 font-bold text-accent-ink text-xs">
							INK ON CYAN
						</span>
					</div>
				</Section>

				<Section
					title="Game palettes"
					description="Spy = plum noir. Charades = lime heat."
				>
					<div className="flex flex-col gap-3">
						<div className="flex items-end justify-between rounded-xl border-2 border-foreground bg-linear-to-br from-game-spy-from to-game-spy-to p-4 text-game-spy-foreground">
							<span className="font-bold text-lg">Espía</span>
							<Badge
								variant="outline"
								className="border-game-spy-foreground text-game-spy-foreground"
							>
								spy
							</Badge>
						</div>
						<div className="flex items-end justify-between rounded-xl border-2 border-foreground bg-linear-to-br from-game-charades-from to-game-charades-to p-4 text-game-charades-foreground">
							<span className="font-bold text-lg">Charadas</span>
							<Badge
								variant="outline"
								className="border-game-charades-foreground text-game-charades-foreground"
							>
								charades
							</Badge>
						</div>
					</div>
				</Section>

				<Section
					title="Type"
					description="One family, two registers: display for shouting, text for reading."
				>
					<div className="flex flex-col gap-3">
						<p className="font-display text-display uppercase">Parche</p>
						<p className="font-bold text-2xl">Heading two</p>
						<p className="font-bold text-lg">Heading three</p>
						<p>
							Body copy at 16px — the smallest size the app is allowed to use in
							a form.
						</p>
						<p className="text-muted-foreground text-sm">
							Muted supporting copy
						</p>
						<p className="font-mono text-xs">mono / params / ids</p>
					</div>
				</Section>

				<Section
					title="Buttons"
					description="Minimum 48px tall. Press sinks the sticker shadow."
				>
					<div className="flex flex-col gap-3">
						<Button variant="sticker" size="lg">
							<SparklesIcon aria-hidden="true" />
							Jugar ahora
						</Button>
						<Button>Default</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="destructive">Destructive</Button>
						<Button variant="link">Link</Button>
						<div className="flex flex-wrap items-center gap-3">
							<Button size="sm">Small</Button>
							<Button size="icon" aria-label="Icon button">
								<CheckIcon aria-hidden="true" />
							</Button>
							<Button
								size="icon-lg"
								variant="outline"
								aria-label="Large icon button"
							>
								<CheckIcon aria-hidden="true" />
							</Button>
						</div>
						<Button disabled>Disabled</Button>
					</div>
				</Section>

				<Section title="Badges">
					<div className="flex flex-wrap items-center gap-2">
						<Badge>Default</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="outline">Outline</Badge>
						<Badge variant="destructive">Destructive</Badge>
						<Badge className="border-2 border-foreground bg-accent-plum text-background">
							<SparklesIcon aria-hidden="true" />
							Nuevo
						</Badge>
						<Badge className="border-2 border-foreground bg-accent-lime text-accent-ink">
							Correct
						</Badge>
					</div>
				</Section>

				<Section
					title="Form controls"
					description="16px minimum so iOS never zooms on focus."
				>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="demo-name">Nombre del parche</Label>
							<Input id="demo-name" placeholder="Los tramposillos" />
						</div>
						<div className="flex items-center justify-between gap-4 rounded-lg border-2 border-border p-3">
							<div className="flex flex-col">
								<Label htmlFor="demo-toggle">Modo parche</Label>
								<span className="text-muted-foreground text-xs">
									Se reinicia en cada ronda
								</span>
							</div>
							<Switch id="demo-toggle" />
						</div>
						<Tabs defaultValue="espia">
							<TabsList>
								<TabsTrigger value="espia">Espía</TabsTrigger>
								<TabsTrigger value="charadas">Charadas</TabsTrigger>
							</TabsList>
							<TabsContent value="espia" className="pt-3">
								<Card size="sm">
									<CardHeader>
										<CardTitle>Un espía entre ustedes</CardTitle>
									</CardHeader>
								</Card>
							</TabsContent>
							<TabsContent value="charadas" className="pt-3">
								<Card size="sm">
									<CardHeader>
										<CardTitle>Celular en la frente</CardTitle>
									</CardHeader>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</Section>

				<Section title="Cards">
					<Card>
						<CardHeader>
							<CardTitle>Sticker card</CardTitle>
							<CardDescription>
								2px outline, 28px radius, no blur.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm">
								Hard shadows are reserved for buttons and badges, so cards stay
								quiet.
							</p>
						</CardContent>
						<CardFooter>
							<Button size="sm" variant="outline">
								Footer action
							</Button>
						</CardFooter>
					</Card>
					<Card className="border-2 border-foreground shadow-sticker">
						<CardHeader>
							<CardTitle>Promoted card</CardTitle>
							<CardDescription>
								When one card has to win the screen.
							</CardDescription>
						</CardHeader>
					</Card>
					<div className="flex flex-col gap-2">
						<Skeleton className="h-10 w-full rounded-lg" />
						<Skeleton className="h-10 w-2/3 rounded-lg" />
					</div>
				</Section>

				<Section
					title="Overlays"
					description="Bottom sheet is the default; dialog is for blocking decisions."
				>
					<div className="flex flex-wrap gap-3">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline">Open sheet</Button>
							</SheetTrigger>
							<SheetContent
								side="bottom"
								className="rounded-t-2xl border-t-2 border-foreground"
							>
								<SheetHeader>
									<SheetTitle>Confirmar acción</SheetTitle>
									<SheetDescription>
										Este es el ejemplo de una hoja que sube desde abajo.
									</SheetDescription>
								</SheetHeader>
								<SheetFooter className="flex-col gap-2 pt-4">
									<Button variant="sticker">Aceptar</Button>
									<Button variant="ghost">Mejor no</Button>
								</SheetFooter>
							</SheetContent>
						</Sheet>

						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline">Open dialog</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>¿Salir de la partida?</DialogTitle>
									<DialogDescription>
										Se pierde el puntaje de esta ronda.
									</DialogDescription>
								</DialogHeader>
								<DialogFooter className="gap-2">
									<Button variant="destructive">Salir</Button>
									<Button variant="ghost">Seguir jugando</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>

						<Button
							variant="secondary"
							onClick={() => toast.success("Ronda guardada")}
						>
							Toast
						</Button>
					</div>
				</Section>

				<Separator className="border-t-2" />
				<p className="pb-6 text-muted-foreground text-xs">
					Dev-only route. Not shipped in production builds.
				</p>
			</div>
		</AppShell>
	);
};
export const Route = createFileRoute("/dev/tokens")({
	beforeLoad: () => {
		if (!import.meta.env.DEV) {
			throw notFound();
		}
	},
	component: TokensPage,
});

const Swatch = ({
	className,
	token,
	note,
}: {
	className: string;
	token: string;
	note?: string;
}) => {
	return (
		<div className="flex flex-col gap-1.5">
			<div
				className={`h-14 w-full rounded-lg border-2 border-border ${className}`}
			/>
			<div className="font-mono text-[0.7rem] leading-tight text-foreground">
				{token}
			</div>
			{note ? (
				<div className="text-[0.65rem] leading-tight text-muted-foreground">
					{note}
				</div>
			) : null}
		</div>
	);
};

const Section = ({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) => {
	return (
		<section className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<h2 className="font-bold text-xl">{title}</h2>
				{description ? (
					<p className="text-muted-foreground text-sm">{description}</p>
				) : null}
			</div>
			{children}
		</section>
	);
};
