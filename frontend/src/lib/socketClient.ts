// socketClient.ts
// Type des événements reçus via WebSocket (tu peux ajouter d'autres types si nécessaire)
type WebSocketEvent = {
	type: "friend_status"; // 🔁 Ajoute ici d'autres types si besoin, ex: "message", "notification", etc.
	payload: {
		userId: number;
		online: boolean;
	};
};

// Type de fonction callback à appeler quand un message est reçu
type Callback = (event: WebSocketEvent) => void;

let socket: WebSocket | null = null;
const listeners: Callback[] = []; // Liste des fonctions à appeler sur chaque message

// ✅ Ajoute un listener
export function addWebSocketListener(callback: Callback) {
	listeners.push(callback);
}

export function disconnectWebSocketClient() {
	shouldReconnect = false;
	if (socket && socket.readyState === WebSocket.OPEN) {
		console.log("❎ Déconnexion manuelle du WebSocket");
		socket.close();
	}
	socket = null;
}

// ❌ Retire un listener
export function removeWebSocketListener(callback: Callback) {
	const index = listeners.indexOf(callback);
	if (index !== -1) {
		listeners.splice(index, 1);
	}
}
let shouldReconnect = true;
// 👉 Initialise et connecte le WebSocket
export function initWebSocketClient(url: string, token: string) {
	// Récupère ton token d’authentification depuis le stockage local
	// const token = localStorage.getItem("access_token"); // 🔁 Change selon ton système d'authentification
	shouldReconnect = true;
	const connect = () => {
		const ws = new WebSocket(url); // 💡 Ex: "wss://your-server.com/ws"

		ws.addEventListener("open", () => {
			// Authentifie immédiatement après la connexion
			if (token) {
				console.log("✅ WebSocket connecté");
				ws.send(JSON.stringify({ type: "auth", token }));
			}
		});

		ws.addEventListener("message", (event) => {
			try {
				const data: WebSocketEvent = JSON.parse(event.data);
				console.log("📩 Message reçu:", data);
				listeners.forEach(cb => cb(data));
			} catch (e) {
				console.error("❌ Message invalide:", event.data);
			}
		});

		ws.addEventListener("error", (err) => {
			console.error("❌ Erreur WebSocket", err);
		});

		ws.addEventListener("close", () => {
			socket = null;
			if (shouldReconnect) {
				console.warn("🔌 WebSocket fermé. Nouvelle tentative dans 5s...");
				setTimeout(connect, 5000);
			}
		});
		socket = ws;
	};

	connect();
}

// 🚀 Fonction pour envoyer un message via WebSocket
export function sendWebSocketMessage(data: any) {
	if (socket && socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify(data));
	} else {
		console.warn("❗ Impossible d'envoyer, WebSocket non connecté");
	}
}



// // MY SINGLETON EH OUAIS

// type WSMessage = {
// 	type: string;
// 	[key: string]: any;
// };

// type InitWebSocketParams = {
// 	url: string;
// 	onMessage?: (data: MessageEvent) => void;
// 	onOpen?: (ws: WebSocket) => void;
// 	onClose?: () => void;
// 	retryDelay?: number;
// };

// let socket: WebSocket | null = null;

// export function initWebSocketClient({
// 	url,
// 	onMessage,
// 	onOpen,
// 	onClose,
// 	retryDelay = 5000,
// }: InitWebSocketParams): void {
// 	if (socket && socket.readyState <= 1) return;

// 	const connect = () => {
// 		socket = new WebSocket(url);

// 		socket.addEventListener("open", () => {
// 			console.log("WebSocket connected");

// 			const token = localStorage.getItem("access_token");
// 			if (token) {
// 				const authMessage: WSMessage = {
// 					type: "auth",
// 					token,
// 				};
// 				socket!.send(JSON.stringify(authMessage));
// 			}

// 			onOpen?.(socket!);
// 		});// let socket: WebSocket | null = null;

// // export function connectSocket(userId: string): void {
// // 	if (socket && socket.readyState === WebSocket.OPEN) {
// // 		console.log("Socket déjà connectée");
// // 		return;
// // 	}

// // 	socket = new WebSocket(`ws://localhost:3000/ws`);

// // 	socket.addEventListener("open", () => {
// // 		console.log("WebSocket connecté");
// // 	});

// // 	socket.addEventListener("message", (event) => {
// // 		console.log("Message reçu :", event.data);
// // 	});

// // 	socket.addEventListener("close", () => {
// // 		console.log("WebSocket fermé");
// // 	});

// // 	socket.addEventListener("error", (err) => {
// // 		console.error("Erreur WebSocket :", err);
// // 	});
// // }

// // export function disconnectSocket(): void {
// // 	if (socket) {
// // 		console.log("Websocket ferme...");
// // 		socket.close();
// // 		socket = null;
// // 	}
// // }

// // export function sendMessage(msg: string): void {
// // 	if (socket && socket.readyState === WebSocket.OPEN) {
// // 		socket.send(msg);
// // 	} else {
// // 		console.warn("WebSocket non connectée");
// // 	}
// // }

// // export function getSocket(): WebSocket | null {
// // 	return socket;
// // }

// // websocketClient.ts




// // MY SINGLETON EH OUAIS

// type WSMessage = {
// 	type: string;
// 	[key: string]: any;
// };

// type InitWebSocketParams = {
// 	url: string;
// 	onMessage?: (data: MessageEvent) => void;
// 	onOpen?: (ws: WebSocket) => void;
// 	onClose?: () => void;
// 	retryDelay?: number;
// };

// let socket: WebSocket | null = null;

// export function initWebSocketClient({
// 	url,
// 	onMessage,
// 	onOpen,
// 	onClose,
// 	retryDelay = 5000,
// }: InitWebSocketParams): void {
// 	if (socket && socket.readyState <= 1) return;

// 	const connect = () => {
// 		socket = new WebSocket(url);

// 		socket.addEventListener("open", () => {
// 			console.log("WebSocket connected");

// 			const token = localStorage.getItem("access_token");
// 			if (token) {
// 				const authMessage: WSMessage = {
// 					type: "auth",
// 					token,
// 				};
// 				socket!.send(JSON.stringify(authMessage));
// 			}

// 			onOpen?.(socket!);
// 		});

// 		socket.addEventListener("message", (event) => {
// 			console.log("WebSocket message:", event.data);
// 			onMessage?.(event);
// 		});

// 		socket.addEventListener("close", () => {
// 			console.log(`WebSocket closed. Reconnecting in ${retryDelay}s...`);
// 			onClose?.();
// 			setTimeout(connect, retryDelay);
// 		});
// 	};

// 	connect();
// }

// export function getSocket(): WebSocket | null {
// 	return socket;
// }


// 		socket.addEventListener("message", (event) => {
// 			console.log("WebSocket message:", event.data);
// 			onMessage?.(event);
// 		});

// 		socket.addEventListener("close", () => {
// 			console.log(`WebSocket closed. Reconnecting in ${retryDelay}s...`);
// 			onClose?.();
// 			setTimeout(connect, retryDelay);
// 		});
// 	};

// 	connect();
// }

// export function getSocket(): WebSocket | null {
// 	return socket;
// }
