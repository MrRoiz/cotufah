import {
	DicesIcon,
	FilmIcon,
	Gamepad2Icon,
	type LucideIcon,
	MapPinIcon,
	MusicIcon,
	PackageIcon,
	PawPrintIcon,
	PizzaIcon,
	SparklesIcon,
	StarIcon,
	TrophyIcon,
	UtensilsIcon,
} from "lucide-react";

import type { packChoices } from "@/data/schema";

/** One icon per deck, shared by the setup picker and the landing. */
export const packIcons: Record<(typeof packChoices)[number], LucideIcon> = {
	clasico: DicesIcon,
	movies: FilmIcon,
	disney: SparklesIcon,
	actors: StarIcon,
	objects: PackageIcon,
	kitchen: UtensilsIcon,
	gaming: Gamepad2Icon,
	animals: PawPrintIcon,
	music: MusicIcon,
	sports: TrophyIcon,
	food: PizzaIcon,
	places: MapPinIcon,
};
