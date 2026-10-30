/**
 * English copy — the source of truth for every message.
 *
 * `es.ts` is typed against this, so a missing Spanish string is a type error
 * instead of a silent English fallback. Use `{placeholders}` for values; the
 * only Spanish allowed outside `es.ts` is deck content.
 */
export const en = {
	common: {
		appTagline: "party games for your crew",
		home: "Home",
		settings: "Settings",
		soon: "Coming soon",
		legal: "Legal",
		about: "About us",
		play: "Play",
		back: "Back",
		language: "Language",
		theme: "Theme",
		light: "Light",
		dark: "Dark",
		system: "System",
	},
	gate: {
		badge: "Phone only",
		title: "{app} is played on a phone",
		body: "One phone goes around the room. Scan this and it opens right there.",
		fallback: "Or type this address on your phone:",
		qrAlt: "QR code to open {app} on your phone",
		hint: "Nothing to install. Nothing is saved.",
	},
	category: {
		title: "Deck",
		body: "Pick what the round is about. Mixed pulls from all of them.",
		mixed: "Mixed",
		mixedBody: "A bit of everything.",
		change: "Change",
		sheetTitle: "Pick the deck",
		packs: {
			clasico: {
				name: "The usual",
				body: "The words we always had, no theme.",
			},
			movies: { name: "Movies", body: "Titles to guess or act out." },
			disney: { name: "Disney", body: "Old and new Disney classics." },
			actors: { name: "Actors", body: "Faces everyone knows." },
			objects: { name: "Objects", body: "Things lying around the house." },
			kitchen: { name: "Kitchen", body: "Pots, pans and cooking." },
			gaming: { name: "Gaming", body: "Games, consoles and screens." },
			animals: { name: "Animals", body: "Bugs, beasts and pets." },
			music: { name: "Music", body: "Instruments, rhythms and stage." },
			sports: { name: "Sports", body: "Fields, feats and medals." },
			food: { name: "Food", body: "Dishes and cravings." },
			places: { name: "Places", body: "Spots you end up in." },
		},
	},
	decks: {
		title: "My decks",
		subtitle:
			"Words you write yourself. They live on this phone and nowhere else.",
		createTitle: "New deck",
		nameLabel: "Deck name",
		namePlaceholder: "Mom's birthday",
		wordsLabel: "Words",
		wordsHint: "One per line. Between {min} and {max}.",
		wordsPlaceholder: "piñata\nbirthday cake\ngrandma",
		save: "Save deck",
		saveChanges: "Save changes",
		edit: "Edit",
		editTitle: "Edit deck",
		wordCount: { one: "{count} word", other: "{count} words" },
		empty: "No custom decks yet. Write one and it shows up in both games.",
		notFound: "That deck is no longer on this phone.",
		share: "Share",
		remove: "Delete",
		removeConfirm: "Tap again to delete",
		shareTitle: "Share “{name}”",
		shareBody:
			"Scan this on the other phone. The words travel inside the link.",
		shareTooBig:
			"This deck is too long for a QR code. Remove a few words and share it again.",
		copy: "Copy link",
		copied: "Link copied",
		pickerTitle: "Your decks",
		pickerEmpty: "None yet.",
		manage: "Manage decks",
		nameError: "Write a name.",
		wordsError: "Add between {min} and {max} words, one per line.",
		wordLengthError: "Each word can be up to {max} characters.",
		limitError: "You already have {max} decks. Delete one to make room.",
		saveError:
			"This browser wouldn't save the deck. Check private mode or free space.",
		removeError: "This browser wouldn't delete the deck. Try again.",
		importedTitle: "Deck added",
		importedBody: "“{name}” is now on this phone, with {count} words.",
		importFailedTitle: "That link is broken",
		importFailedBody:
			"The deck did not arrive complete. Ask for a new QR and scan it again.",
		importSaveTitle: "Couldn't save it",
		importHome: "Back home",
		importSee: "See my decks",
	},
	home: {
		kicker: "Party games",
		intro:
			"{app} is one phone passed around the room: Spy, Charades, and whatever comes next. No accounts, no installs and no loading screens that make you think it broke.",
		cta: "Play now",
		ctaDesktop: "Open it on your phone",
		qrHint: "Scan with your phone camera",
		qrFallback: "or type this address:",
		gamesTitle: "Two games, one phone",
		gamesSubtitle:
			"Spy and Charades to start with. The third one is still in the oven.",
		packsTitle: "{count} decks per game",
		packsBody:
			"The usual one and {themed} themed packs, for when the crew wants a change.",
		customTitle: "Your own words",
		customBody:
			"Write a deck on your phone and hand it to another phone with a QR code. It lives on yours: no account, no cloud.",
		howTitle: "How it works",
		step1Title: "Pick a game",
		step1Body:
			"Spy or Charades. One phone, no accounts, nothing to install. Yes, it sounds suspicious.",
		step2Title: "Pass the phone",
		step2Body:
			"Everyone sees their role or their word, then hands it on. No peeking.",
		step3Title: "Play",
		step3Body:
			"Argue, act it out, keep score. Then go again, because the loser wants a rematch.",
		quotesTitle: "What the crew says",
		quotesSubtitle: "Real testimonials, names changed for safety.",
		quotes: [
			{
				quote:
					"They accused me of being the spy and I was. Next time I will not laugh that weird.",
				author: "Camila, 27",
			},
			{
				quote: "I did not understand the rules, but I won.",
				author: "my mum",
			},
			{
				quote: "We played one round and now we do not talk.",
				author: "Saturday's crew",
			},
		],
		whyTitle: "No accounts, no data, no nonsense",
		whyBody:
			"No email, no saved games, no ads, no tracking. The game lives on the phone in your hand, not on a server that follows you.",
		footerNote:
			"Made for actual crews. Nothing is saved, not even the embarrassment.",
	},
	games: {
		title: "Games",
		subtitle: "Pick what the room is in the mood for.",
		spy: {
			name: "Spy",
			tagline: "One of you is lying",
			players: "3+ players",
			body: "Everyone gets the same word except one person. Talk it out and find the spy.",
		},
		charades: {
			name: "Charades",
			tagline: "Phone on your forehead",
			players: "2+ players",
			body: "Guess the word before the timer runs out. Tilt the phone to pass.",
		},
	},
	spy: {
		setupIntro:
			"Everyone gets the same word except the spies. Talk it out and find them.",
		playersTitle: "Players",
		playerLabel: "Player {n}",
		addPlayer: "Add player",
		removePlayer: "Remove",
		spiesTitle: "Spies",
		spiesHint: "How many liars this round.",
		start: "Deal the roles",
		minPlayers: "Name at least 3 players.",
		nameTooShort: "Names need at least {min} letters.",
		duplicateNames: "Each player needs a different name.",
		handoffLabel: "Pass the phone to",
		dealBody: "Nobody else should look at the screen.",
		holdToSee: "Hold to see your role",
		yourWord: "Your word",
		youAreSpy: "You are the spy",
		spyHint: "You don't know the word. Listen and play along.",
		next: "Done, next",
		startDiscussion: "Start the discussion",
		discussTitle: "Who is the spy?",
		discussBody: "Talk, ask, lie. Then vote.",
		timeUp: "Time is up",
		pause: "Pause",
		resume: "Resume",
		voteTitle: "Who do you accuse?",
		voteBody: "Pick one and reveal.",
		reveal: "Reveal",
		spyLabelOne: "The spy was",
		spyLabelMany: "The spies were",
		theWordWas: "The word was",
		caught: "You caught them!",
		escaped: "They got away",
		again: "Another round",
		changePlayers: "Change players",
	},
	charades: {
		setupIntro:
			"Phone on your forehead: guess the word before the clock runs out.",
		durationTitle: "Round length",
		duration60: "60 seconds",
		duration90: "90 seconds",
		duration120: "2 minutes",
		start: "Start",
		introTitle: "Phone on your forehead",
		introBody: "Hold the phone to your forehead with the screen facing out.",
		tiltCorrect: "Tilt down",
		tiltCorrectHint: "Correct",
		tiltPass: "Tilt up",
		tiltPassHint: "Pass",
		checkingSensor: "Checking the sensor…",
		tapLeft: "Tap the left half",
		tapRight: "Tap the right half",
		needsHttps:
			"Sensors only work over HTTPS. Open the app with https://, or use the buttons.",
		noMotion: "We could not use the sensor here. Use the buttons.",
		startRound: "Start round",
		correct: "Correct",
		pass: "Pass",
		resultsTitle: "Time is up",
		resultsCorrect: "Correct",
		resultsPassed: "Passed",
		again: "Another round",
		changeSettings: "Change settings",
		wordsLeft: "Out of words",
	},
	legal: {
		kicker: "The fine print",
		title: "Nobody reads this",
		intro:
			"And if you got this far, thank you: you are the first person. The second was my mum, and she was only looking for the close button. This is a game about passing a phone around and shouting words: no accounts, no database, no ads, no tracking. Breathe, we are not spying on you.",
		notLawyers:
			"Legal notice: we are not lawyers, obviously. If you need a real one, hire one; we know a bit of code, but nothing about law.",
		termsTitle: "The crew rules",
		termsBody:
			"Do not harass, do not threaten and do not ruin anyone's evening: real life already does that. If a word offends someone, switch decks and carry on.",
		openSourceTitle: "Open source",
		openSourceBody:
			"If something breaks, send a PR with the fix; if you do not feel like it, open an issue and tell us calmly (all caps ruins it). We also take translations, new jokes and PRs disguised as jokes. And yes, there are humans on the other side: we are not a bot (yet). And if the bug only happens on your 2011 phone, send a photo: we like archaeology.",
		termsWarranty:
			"The game ships as is: with its words, its bugs and its bad jokes. We do not promise it runs on the 2011 phone you inherited from your aunt, nor that the same aunt understands charades. If the app crashes, give it some air, count to ten and open it again.",
		liabilityTitle: "Please do not sue us",
		liabilityBody:
			"If the crew argues, someone gets offended or the phone ends up on the floor, it was not the game: it was physics and pride. There is no insurance, no compensation and no office. Our legal fund is a piggy bank full of popcorn.",
		privacyTitle: "Privacy (we do not know who you are)",
		privacyIntro:
			"And we are not hiding it: there is no database. Our backend is a JSON of words and a server that hands them out like snacks. That is the whole mystery. In fact, so far the only thing we know is that you exist.",
		privacyList: [
			"Zero accounts, zero emails, zero passwords. Nothing to hack, not even for a bored hacker.",
			"Zero saved matches. Close the tab and your crew becomes an urban legend.",
			"Zero analytics, zero ads, zero trackers. We do not sell data because we have no data to sell (nor any talent for selling it).",
			"In your browser we keep two things: the theme and the language. That is the whole trail: no footprints, no crumbs.",
			"The server hands out words and forgets you. No profiles, no history, no follow-up calls.",
			"There is no unsubscribe button because there is nothing to unsubscribe from.",
			"Want to erase the little we keep? Clear the site data and done: not a trace.",
		],
		dataTitle: "Data we do NOT have",
		dataList: [
			"Your name. We do not ask, we do not store, we do not want it.",
			"Your location. We know you are at some party, that is it.",
			"Your camera and microphone. We never touch them: charades only uses the motion sensor.",
			"Your payment details. There is nothing to buy: no premium, no coins, no extra lives.",
		],
		cookiesTitle: "Cookies (one, and it does not even taste like a cookie)",
		cookiesBody:
			"Yes, there is one: we store your language so we do not have to ask every time you come in. The theme lives in your browser and does not leave it. No tracking, no ads, no one's pixels. If you want actual cookies, try the bakery down the street.",
		faqTitle: "Questions nobody asked",
		faq: [
			{
				q: "Do you sell my data?",
				a: "We have no data. It is not that we are honest: there is simply nothing to sell.",
			},
			{
				q: "Are there ads?",
				a: "No. Not one. Play in peace.",
			},
			{
				q: "Can I play drunk?",
				a: "You can. After two drinks, everyone looks like the spy.",
			},
		],
		changesTitle: "Changes and jurisdiction",
		changesBody:
			"If we change these terms we update this page. We cannot email you because we do not have your email, so check back now and then. Any dispute gets settled with rock, paper, scissors: the loser buys the buñuelos.",
		footer:
			"Last updated: whenever someone remembered this page existed. Not legal advice, it is a game.",
	},
	about: {
		kicker: "The story nobody asked for",
		title: "So who are these people?",
		intro:
			"I am not a company. There is no office, no boss, no Monday meeting. I am one person with a phone and a list of words that grew more than it should have.",
		sections: [
			{
				title: "Why {app}?",
				body: "Were you expecting the long story of how I found the name? Spoiler: there is not one, it just sounds funny. The name was already taken, so I added an h at the end and it became {app}. The h is silent, like this app's growth projections.",
			},
			{
				title: "Why pass-the-phone games?",
				body: "Because nobody wants to install anything to play for a while: one phone, a crew and words. No accounts, no downloads and no ads cutting the round in half.",
			},
			{
				title: "How did this start?",
				body: "One Friday I wanted to play something like this at a party. I looked for apps: 200 megabytes, ads and half the deck behind a paywall. So I made my own, and here I am: two Saturdays later.",
			},
			{
				title: "So who are you?",
				body: "One person. I write the words, press the buttons and laugh at my own jokes.",
			},
			{
				title: "How do I reach you?",
				body: "Through the repo. The issues, the ideas and the jokes that did not make it are all there. If you want something, open one: there are humans on the other side.",
			},
		],
		footer:
			"If you liked it, pass the phone to someone. If you did not, pass it anyway: the game is a group thing.",
	},
	settings: {
		title: "Settings",
		subtitle: "Language, theme, and the boring stuff.",
		languageBody: "Remembered on this device, not on an account.",
		themeBody: "System follows your phone's dark mode.",
		soundTitle: "Sound",
		soundBody:
			"Short cues for the countdown, the end of a round and each answer. The iPhone silent switch still wins.",
		decksTitle: "Custom decks",
		decksBody:
			"Write your own words. They stay on this phone; share them with a QR.",
		aboutTitle: "About",
		aboutBody: "{app} stores nothing: no accounts, no database, no tracking.",
	},
};

export type Messages = typeof en;
