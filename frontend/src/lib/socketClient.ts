type WebSocketEvent = {
	type: "friend_status";
	payload: {
		userId: number;
		online: boolean;
	};
};

type Callback = (event: WebSocketEvent) => void;

let socket: WebSocket | null = null;
const listeners: Callback[] = [];

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

export function removeWebSocketListener(callback: Callback) {
	const index = listeners.indexOf(callback);
	if (index !== -1) {
		listeners.splice(index, 1);
	}
}
let shouldReconnect = true;
export function initWebSocketClient(url: string, token: string) {
	shouldReconnect = true;
	const connect = () => {
		const ws = new WebSocket(url);

		ws.addEventListener("open", () => {
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

export function sendWebSocketMessage(data: any) {
	if (socket && socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify(data));
	} else {
		console.warn("❗ Impossible d'envoyer, WebSocket non connecté");
	}
}
