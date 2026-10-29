/**
 * Cues are synthesized, never bundled. Melodic cues are sine, alerts triangle
 * and the timer tick filtered noise, so each one is recognizable by timbre
 * alone. Volumes stay around 0.1: they sit under a conversation instead of
 * cutting through it.
 */
const STORAGE_KEY = "app.sound";
const MASTER_VOLUME = 0.24;
/** How many seconds of the timer get a tick. */
export const TICK_LAST_SECONDS = 10;

export type Cue = "tick" | "end" | "correct" | "pass";

declare global {
	interface Window {
		webkitAudioContext?: typeof AudioContext;
	}
}

const readMuted = (): boolean => {
	if (typeof window === "undefined") {
		return false;
	}
	try {
		return window.localStorage.getItem(STORAGE_KEY) === "off";
	} catch {
		return false;
	}
};

let context: AudioContext | null = null;
let master: GainNode | null = null;
let muted = readMuted();
const listeners = new Set<() => void>();

export const subscribeSound = (listener: () => void): (() => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

export const getSoundMuted = (): boolean => muted;

export const getSoundMutedServer = (): boolean => false;

export const setSoundMuted = (value: boolean) => {
	muted = value;
	try {
		window.localStorage.setItem(STORAGE_KEY, value ? "off" : "on");
	} catch {
		// Private mode with storage disabled: the toggle still works for this tab.
	}
	for (const listener of listeners) {
		listener();
	}
};

const audioContext = (): AudioContext | null => {
	if (typeof window === "undefined") {
		return null;
	}
	if (!context) {
		const Ctor = window.AudioContext ?? window.webkitAudioContext;
		if (!Ctor) {
			return null;
		}
		context = new Ctor();
	}
	return context;
};

/** Call from a tap: browsers keep the context suspended until a gesture. */
export const unlockSound = () => {
	const ctx = audioContext();
	if (ctx && ctx.state === "suspended") {
		void ctx.resume();
	}
};

/**
 * The usual pattern (Howler, Tone, most games): listen once for the first
 * interaction of any kind, resume there, then stop listening. `pointerdown`
 * covers mouse, touch and pen; `touchend` and `keydown` cover old iOS and
 * keyboards. Returns the cleanup for the effect.
 */
export const installAudioUnlock = (): (() => void) => {
	if (typeof window === "undefined" || context?.state === "running") {
		return () => undefined;
	}

	const events = ["pointerdown", "touchend", "keydown"] as const;
	const unlock = () => {
		unlockSound();
		for (const event of events) {
			window.removeEventListener(event, unlock);
		}
	};

	for (const event of events) {
		window.addEventListener(event, unlock, { passive: true });
	}

	return () => {
		for (const event of events) {
			window.removeEventListener(event, unlock);
		}
	};
};

/**
 * Every cue goes through one compressor: cues can be loud enough for a noisy
 * room without any single stack of notes clipping the phone speaker.
 */
const output = (ctx: AudioContext): AudioNode => {
	if (!master) {
		const compressor = ctx.createDynamicsCompressor();
		compressor.threshold.value = -20;
		compressor.knee.value = 12;
		compressor.ratio.value = 6;
		compressor.attack.value = 0.003;
		compressor.release.value = 0.2;
		master = ctx.createGain();
		master.connect(compressor).connect(ctx.destination);
	}
	return master;
};

type ToneOptions = { type?: OscillatorType; volume?: number };

const tone = (
	ctx: AudioContext,
	frequency: number,
	delay: number,
	duration: number,
	options: ToneOptions = {},
) => {
	const start = ctx.currentTime + delay;
	const volume = options.volume ?? MASTER_VOLUME;
	const oscillator = ctx.createOscillator();
	const gain = ctx.createGain();

	oscillator.type = options.type ?? "sine";
	oscillator.frequency.setValueAtTime(frequency, start);
	gain.gain.setValueAtTime(0.0001, start);
	gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
	gain.gain.setValueAtTime(volume, start + duration * 0.5);
	gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

	oscillator.connect(gain).connect(output(ctx));
	oscillator.start(start);
	oscillator.stop(start + duration + 0.02);
};

/** A short filtered noise burst: reads as a clock, not as a note. */
const tick = (ctx: AudioContext) => {
	const length = Math.floor(ctx.sampleRate * 0.03);
	const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
	const data = buffer.getChannelData(0);

	for (let i = 0; i < length; i += 1) {
		data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 4;
	}

	const source = ctx.createBufferSource();
	source.buffer = buffer;

	const filter = ctx.createBiquadFilter();
	filter.type = "highpass";
	filter.frequency.value = 2600;

	const gain = ctx.createGain();
	gain.gain.setValueAtTime(0.26, ctx.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

	source.connect(filter).connect(gain).connect(output(ctx));
	source.start();
};

/**
 * Toy marimba: the fundamental plus a quiet octave that dies sooner. Two sines
 * are enough to read as "wooden toy" instead of a test tone.
 */
const marimba = (
	ctx: AudioContext,
	frequency: number,
	delay: number,
	duration: number,
	volume: number,
) => {
	tone(ctx, frequency, delay, duration, { volume });
	tone(ctx, frequency * 2, delay, duration * 0.5, {
		type: "triangle",
		volume: volume * 0.35,
	});
};

/** Cartoon slide: the pitch moves, which is what makes it read as playful. */
const glide = (
	ctx: AudioContext,
	from: number,
	to: number,
	delay: number,
	duration: number,
	volume: number,
	type: OscillatorType = "sine",
) => {
	const start = ctx.currentTime + delay;
	const oscillator = ctx.createOscillator();
	const gain = ctx.createGain();

	oscillator.type = type;
	oscillator.frequency.setValueAtTime(from, start);
	oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);
	gain.gain.setValueAtTime(0.0001, start);
	gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
	gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

	oscillator.connect(gain).connect(ctx.destination);
	oscillator.start(start);
	oscillator.stop(start + duration + 0.02);
};

const cues: Record<Cue, (ctx: AudioContext) => void> = {
	tick,
	// Three urgent beeps (the part everyone recognizes as "time") and then a
	// descending marimba tail, so it still ends on the app's tone.
	end: (ctx) => {
		[0, 0.18, 0.36].forEach((delay) => {
			tone(ctx, 1174.66, delay, 0.12, { type: "triangle", volume: 0.24 });
		});
		const notes = [1046.5, 880, 698.46, 523.25];
		notes.forEach((frequency, index) => {
			marimba(
				ctx,
				frequency,
				0.62 + index * 0.08,
				index === 3 ? 0.4 : 0.14,
				0.2,
			);
		});
		tone(ctx, 261.63, 0.86, 0.4, { type: "triangle", volume: 0.14 });
	},
	// Four rising notes with the last one held: the "yes!" of the game.
	correct: (ctx) => {
		[523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
			marimba(ctx, frequency, index * 0.06, index === 3 ? 0.4 : 0.2, 0.2);
		});
	},
	// Attack note, then a deflating slide: audible on a phone speaker, still
	// the comic opposite of `correct`.
	pass: (ctx) => {
		marimba(ctx, 587.33, 0, 0.16, 0.26);
		glide(ctx, 523.25, 261.63, 0.05, 0.36, 0.3, "triangle");
	},
};

export const playSound = (cue: Cue) => {
	if (muted) {
		return;
	}
	const ctx = audioContext();
	if (!ctx) {
		return;
	}
	if (ctx.state === "suspended") {
		void ctx.resume();
	}
	cues[cue](ctx);
};
