import { ScriptOnce } from "@tanstack/react-router";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

/**
 * Theme provider for TanStack Start, following the shadcn recipe:
 * `ScriptOnce` injects a pre-hydration script (no flash), the choice lives in
 * localStorage under a brand-free key, and the `dark` class goes on <html>.
 *
 * Colors are never duplicated here: the browser-chrome color is read from the
 * `--background` token on <html>, so src/styles.css stays the only palette.
 */
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = {
	children: ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
};

/** Brand-free on purpose: a rename must not reset anyone's theme. */
const DEFAULT_STORAGE_KEY = "app.theme";

const getThemeScript = (storageKey: string, defaultTheme: Theme) => {
	const key = JSON.stringify(storageKey);
	const fallback = JSON.stringify(defaultTheme);

	return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);e.style.colorScheme=r;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',getComputedStyle(e).backgroundColor)}catch(e){}})();`;
};

const ThemeProviderContext = createContext<ThemeProviderState | null>(null);

const syncBrowserChrome = () => {
	const meta = document.querySelector('meta[name="theme-color"]');
	if (!meta) {
		return;
	}
	// Resolved from the CSS token, so light and dark both stay in one place.
	meta.setAttribute(
		"content",
		getComputedStyle(document.documentElement).backgroundColor,
	);
};

const applyTheme = (theme: Theme): ResolvedTheme => {
	const root = document.documentElement;
	root.classList.remove("light", "dark");

	const resolved: ResolvedTheme =
		theme === "system"
			? window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light"
			: theme;

	root.classList.add(resolved);
	root.style.colorScheme = resolved;
	syncBrowserChrome();

	return resolved;
};

export const ThemeProvider = ({
	children,
	defaultTheme = "system",
	storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) => {
	const [theme, setThemeState] = useState<Theme>(defaultTheme);
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(
		defaultTheme === "system" ? "light" : defaultTheme,
	);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		let stored: string | null = null;
		try {
			stored = localStorage.getItem(storageKey);
		} catch {
			stored = null;
		}
		setThemeState(
			stored === "light" || stored === "dark" || stored === "system"
				? stored
				: defaultTheme,
		);
		setMounted(true);
	}, [defaultTheme, storageKey]);

	useEffect(() => {
		if (!mounted) {
			return;
		}
		setResolvedTheme(applyTheme(theme));
	}, [theme, mounted]);

	useEffect(() => {
		if (!mounted || theme !== "system") {
			return;
		}

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => setResolvedTheme(applyTheme("system"));
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, [theme, mounted]);

	const setTheme = (next: Theme) => {
		try {
			localStorage.setItem(storageKey, next);
		} catch {
			// Private mode: switches this session, forgets on reload.
		}
		setThemeState(next);
	};

	return (
		<ThemeProviderContext value={{ theme, resolvedTheme, setTheme }}>
			<ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
			{children}
		</ThemeProviderContext>
	);
};

export const useTheme = (): ThemeProviderState => {
	const context = useContext(ThemeProviderContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
