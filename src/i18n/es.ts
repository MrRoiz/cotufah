import type { Messages } from "@/i18n/en";

/**
 * Spanish copy. Written for Colombia: casual, funny, no Spain-Spanish.
 * Typed against `en`, so a forgotten key fails `pnpm typecheck`.
 */
export const es: Messages = {
	common: {
		appTagline: "juegos pa' tu parche",
		home: "Inicio",
		games: "Juegos",
		settings: "Ajustes",
		soon: "Pronto",
		legal: "Legal",
		about: "Quiénes somos",
		play: "Jugar",
		language: "Idioma",
		theme: "Tema",
		light: "Claro",
		dark: "Oscuro",
		system: "Sistema",
	},
	gate: {
		badge: "Solo celular",
		title: "{app} se juega en el celular",
		body: "Un solo celular va de mano en mano. Escanea esto y se abre ahí mismo.",
		fallback: "O escribe esta dirección en tu celular:",
		qrAlt: "Código QR para abrir {app} en tu celular",
		hint: "No hay nada que instalar. No se guarda nada.",
	},
	category: {
		title: "Baraja",
		body: "Escoge de qué va la ronda. La mezcla agarra de todas.",
		mixed: "Mezcla",
		mixedBody: "Un poco de todo.",
		change: "Cambiar",
		sheetTitle: "Escoge la baraja",
		packs: {
			clasico: {
				name: "De siempre",
				body: "Las palabras de siempre, sin tema fijo.",
			},
			movies: { name: "Películas", body: "Títulos para adivinar o actuar." },
			disney: { name: "Disney", body: "Clásicos y nuevos de Disney." },
			actors: { name: "Actores", body: "Caras que todos conocen." },
			objects: { name: "Objetos", body: "Cosas que tienes en la casa." },
			kitchen: { name: "Cocina", body: "Trastes y comida de cocina." },
			gaming: { name: "Videojuegos", body: "Juegos, consolas y pantallas." },
			animals: { name: "Animales", body: "Bichos, bestias y mascotas." },
			music: { name: "Música", body: "Instrumentos, ritmos y tarima." },
			sports: { name: "Deportes", body: "Canchas, gestas y medallas." },
			food: { name: "Comida", body: "Platos y antojos." },
			places: { name: "Lugares", body: "Sitios donde uno termina." },
		},
	},
	home: {
		kicker: "Juegos de fiesta",
		intro:
			"{app} es un solo celular que va de mano en mano: Espía, Charadas y lo que venga. Sin cuentas, sin descargas y sin pantallas de carga que te hagan pensar que se dañó.",
		cta: "Jugar ahora",
		ctaDesktop: "Ábrelo en tu celular",
		qrHint: "Escanea con la cámara del celular",
		qrFallback: "o escribe esta dirección:",
		gamesTitle: "Dos juegos, un celular",
		gamesSubtitle:
			"Espía y Charadas para empezar. El tercero está en el horno.",
		packsTitle: "{count} barajas por juego",
		packsBody:
			"La de siempre y {themed} temáticas, para cuando el parche pide cambiar.",
		howTitle: "Cómo se juega",
		step1Title: "Escoge un juego",
		step1Body:
			"Espía o Charadas. Un celular, sin cuentas y sin instalar nada. Sí, suena sospechoso.",
		step2Title: "Pasa el celular",
		step2Body:
			"Cada uno ve su rol o su palabra y se lo pasa al siguiente. Sin mirar de reojo.",
		step3Title: "Jueguen",
		step3Body:
			"Discutan, actúen, sumen puntos. Y otra ronda, que el que pierde pide revancha.",
		quotesTitle: "Lo que dice el parche",
		quotesSubtitle: "Testimonios reales, nombres cambiados por seguridad.",
		quotes: [
			{
				quote: "Me acusaron de espía y era. La próxima vez no me río tan raro.",
				author: "Camila, 27",
			},
			{
				quote: "No entendí las reglas, pero gané.",
				author: "mi mamá",
			},
			{
				quote: "Jugamos una ronda y ahora no nos hablamos.",
				author: "el parche del sábado",
			},
		],
		whyTitle: "Sin cuentas, sin datos, sin vueltas",
		whyBody:
			"Sin correo, sin partidas guardadas, sin anuncios, sin rastreo. El juego vive en el celular que tienes en la mano, no en un servidor que te sigue.",
		footerNote:
			"Hecho pa' parches de verdad. No se guarda nada, ni las vergüenzas.",
	},
	games: {
		title: "Juegos",
		subtitle: "Escojan lo que el parche tenga ganas de jugar.",
		spy: {
			name: "Espía",
			tagline: "Uno de ustedes está mintiendo",
			players: "3+ jugadores",
			body: "Todos reciben la misma palabra menos uno. Hablen y descubran al espía.",
		},
		charades: {
			name: "Charadas",
			tagline: "Celular en la frente",
			players: "2+ jugadores",
			body: "Adivina la palabra antes de que se acabe el tiempo. Inclina para pasar.",
		},
	},
	spy: {
		setupIntro:
			"Todos reciben la misma palabra menos los espías. Hablen y descubran quién miente.",
		playersTitle: "Jugadores",
		playerLabel: "Jugador {n}",
		addPlayer: "Agregar jugador",
		removePlayer: "Quitar",
		spiesTitle: "Espías",
		spiesHint: "Cuántos van a mentir en esta ronda.",
		start: "Repartir roles",
		minPlayers: "Ponle nombre a por lo menos 3 jugadores.",
		nameTooShort: "Los nombres necesitan al menos {min} letras.",
		duplicateNames: "Cada jugador necesita un nombre distinto.",
		handoffLabel: "Pásale el celular a",
		dealBody: "Que nadie más mire la pantalla.",
		holdToSee: "Mantén presionado para ver tu rol",
		yourWord: "Tu palabra",
		youAreSpy: "Eres el espía",
		spyHint: "No sabes la palabra. Escucha y disimula.",
		next: "Listo, siguiente",
		startDiscussion: "Empezar la discusión",
		discussTitle: "¿Quién es el espía?",
		discussBody: "Hablen, pregunten, mientan. Y voten.",
		timeUp: "Se acabó el tiempo",
		pause: "Pausa",
		resume: "Seguir",
		voteTitle: "¿A quién acusan?",
		voteBody: "Escojan a uno y revelen.",
		reveal: "Revelar",
		spyLabelOne: "El espía era",
		spyLabelMany: "Los espías eran",
		theWordWas: "La palabra era",
		caught: "¡Lo cogieron!",
		escaped: "Se les escapó",
		again: "Otra ronda",
		changePlayers: "Cambiar jugadores",
	},
	charades: {
		setupIntro:
			"Celular en la frente: adivina la palabra antes de que se acabe el tiempo.",
		durationTitle: "Duración",
		duration60: "60 segundos",
		duration90: "90 segundos",
		duration120: "2 minutos",
		start: "Empezar",
		introTitle: "Celular en la frente",
		introBody: "Ponte el celular en la frente con la pantalla hacia afuera.",
		tiltCorrect: "Inclina hacia abajo",
		tiltCorrectHint: "Correcto",
		tiltPass: "Inclina hacia arriba",
		tiltPassHint: "Pasar",
		checkingSensor: "Revisando el sensor…",
		tapLeft: "Toca la mitad izquierda",
		tapRight: "Toca la mitad derecha",
		needsHttps:
			"Los sensores solo funcionan por HTTPS. Abre la app con https:// o usa los botones.",
		noMotion: "No pudimos usar el sensor. Usa los botones.",
		startRound: "Empezar ronda",
		correct: "Correcto",
		pass: "Pasar",
		resultsTitle: "Se acabó el tiempo",
		resultsCorrect: "Acertadas",
		resultsPassed: "Pasadas",
		again: "Otra ronda",
		changeSettings: "Cambiar ajustes",
		wordsLeft: "Se acabaron las palabras",
	},
	legal: {
		kicker: "La letra pequeña",
		title: "Nadie lee esto",
		intro:
			"Y si llegaste hasta acá, gracias: eres la primera persona. La segunda fue mi mamá, y solo buscaba el botón de cerrar. Esto es un juego de pasar el celular y gritar palabras: sin cuentas, sin base de datos, sin anuncios, sin rastreo. Respira, que no te estamos espiando.",
		notLawyers:
			"Aviso legal: no somos abogados, obvio. Si necesitas uno de verdad, contrata uno; nosotros sabemos un poco de código, pero de leyes nada.",
		termsTitle: "Las reglas del parche",
		termsBody:
			"No acoses, no amenaces y no le dañes la noche a nadie: para eso ya está la vida real. Si una palabra ofende a alguien, cambien de baraja y sigan.",
		openSourceTitle: "Código abierto",
		openSourceBody:
			"Si algo se rompe, manda un PR con el arreglo; si no te animas, abre un issue y cuéntanos con calma (todo en mayúsculas lo arruina). También recibimos traducciones, chistes nuevos y PRs disfrazados de chistes. Y sí, del otro lado hay humanos: no somos un bot (todavía). Y si el bug solo pasa en tu celular del 2011, mándanos una foto: nos gusta la arqueología.",
		termsWarranty:
			"El juego va tal cual: con sus palabras, sus bugs y sus chistes malos. No prometemos que corra en el celular del 2011 que heredaste de tu tía, ni que esa misma tía entienda las charadas. Si la app se cae, dale aire, cuenta hasta diez y vuelve a abrirla.",
		liabilityTitle: "No nos demandes (porfa)",
		liabilityBody:
			"Si el parche se pelea, si alguien se ofende o si el celular termina en el piso, no fue el juego: fue la física y el orgullo. No hay seguro, no hay indemnización y no hay oficina. Nuestro fondo legal es una alcancía llena de cotufas.",
		privacyTitle: "Privacidad (no sabemos quién eres)",
		privacyIntro:
			"Y no es que lo escondamos: no hay base de datos. Nuestro backend es un JSON con palabras y un servidor que las reparte como arepas. Ese es todo el misterio. De hecho, hasta ahora solo sabemos que tú existes.",
		privacyList: [
			"Cero cuentas, cero correos, cero contraseñas. No hay nada que hackear, ni para un hacker aburrido.",
			"Cero partidas guardadas. Cierras la pestaña y tu parche se vuelve leyenda urbana.",
			"Cero analítica, cero anuncios, cero rastreadores. No vendemos datos porque no tenemos datos que vender (ni talento para venderlos).",
			"En tu navegador guardamos dos cosas: el tema y el idioma. Ese es todo el rastro: ni huellas, ni migas.",
			"El servidor reparte palabras y se olvida de ti. Sin perfiles, sin historial, sin llamadas al otro día.",
			"No hay botón de «darse de baja» porque no hay nada de qué darse de baja.",
			"¿Quieres borrar lo poquito que guardamos? Limpia los datos del sitio y listo: ni rastro.",
		],
		dataTitle: "Datos que NO tenemos",
		dataList: [
			"Tu nombre. No lo pedimos, no lo guardamos, no lo queremos.",
			"Tu ubicación. Sabemos que estás en algún parche, nada más.",
			"Tu cámara y tu micrófono. Ni los tocamos: para charadas solo usamos el sensor de movimiento.",
			"Tu forma de pago. No hay nada que comprar: ni premium, ni monedas, ni vidas extra.",
		],
		cookiesTitle: "Cookies (una, y ni sabe a galleta)",
		cookiesBody:
			"Sí, hay una: guardamos tu idioma para no preguntártelo cada vez que entras. El tema vive en tu navegador y de ahí no sale. Nada de rastreo, nada de anuncios, nada de píxeles de nadie. Si quieres galletas de verdad, ve a la panadería de la esquina.",
		faqTitle: "Preguntas que nadie hizo",
		faq: [
			{
				q: "¿Venden mis datos?",
				a: "No tenemos datos. No es que seamos honestos: es que no hay nada que vender.",
			},
			{
				q: "¿Tiene anuncios?",
				a: "No. Ni uno. Puedes jugar tranquilo.",
			},
			{
				q: "¿Puedo jugar borracho?",
				a: "Puedes. Con dos copas encima, todos parecen el espía.",
			},
		],
		changesTitle: "Cambios y jurisdicción",
		changesBody:
			"Si cambiamos estos términos, actualizamos esta página. No podemos avisarte por correo porque no tenemos tu correo, así que revísala de vez en cuando. Cualquier disputa la resolvemos a piedra, papel o tijera: el que pierda paga los buñuelos.",
		footer:
			"Última actualización: cuando alguien se acordó de que esta página existía. No es asesoría legal, es un juego.",
	},
	about: {
		kicker: "La historia que nadie pidió",
		title: "¿Y estos quiénes son?",
		intro:
			"No soy una empresa. No hay oficina, ni jefe, ni reunión de los lunes. Soy una persona con un celular y una lista de palabras que creció más de la cuenta.",
		sections: [
			{
				title: "¿Por qué {app}?",
				body: "¿Esperabas la larga historia de cómo encontré el nombre? Spoiler: no la hay, solo suena chistoso y ya. El nombre ya estaba tomado, así que le agregué una h al final y quedó {app}. La h es muda, igual que las proyecciones de crecimiento de esta app.",
			},
			{
				title: "¿Por qué juegos de pasar el celular?",
				body: "Porque nadie quiere instalar nada para jugar un rato: un celular, un parche y palabras. Sin cuentas, sin descargas y sin anuncios que te partan la ronda por la mitad.",
			},
			{
				title: "¿Cómo empezó esto?",
				body: "Un viernes quise jugar algo así en un parche. Busqué apps: 200 megas, anuncios y media baraja detrás de un pago. Así que hice la mía, y aquí estoy: dos sábados después.",
			},
			{
				title: "¿Y tú quién eres?",
				body: "Una persona. Escribo las palabras, aprieto los botones y me río de mis propios chistes.",
			},
			{
				title: "¿Cómo te contacto?",
				body: "Por el repo. Ahí están los issues, las ideas y los chistes que no cupieron en el juego. Si quieres algo, abre uno: del otro lado hay humanos.",
			},
		],
		footer:
			"Si te gustó, pásale el celular a alguien. Si no, pásaselo igual: el juego es de a varios.",
	},
	settings: {
		title: "Ajustes",
		subtitle: "Idioma, tema y lo aburrido.",
		languageBody: "Se recuerda en este celular, no en una cuenta.",
		themeBody: "Sistema sigue el modo oscuro de tu celular.",
		aboutTitle: "Acerca de",
		aboutBody:
			"{app} no guarda nada: sin cuentas, sin base de datos, sin rastreo.",
	},
};
