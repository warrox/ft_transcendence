import { Div, P, Button, Input, Image } from "../lib/PongFactory";
import { PongNode } from "../lib/PongNode";
import { rerender } from "../router/router";
import { addWebSocketListener} from '../lib/socketClient.ts';
import { t } from "i18next";
import i18n from "i18next";

type Friend = {
	id: number;
	name: string;
	surname: string;
	email: string;
	online: boolean;
	avatar_path: string;
};

const state = {
	friendsList: [] as Friend[],
	friendEmail: "",
	search: "",
	loading: false,
	socket: null as WebSocket | null,
};

export function Friends(): PongNode<any> {
	let socketInitialized = false;

	const loadFriends = async () => {
		state.loading = true;
		try {
			const response = await fetch("/api/getFriends", {
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) throw new Error("Failed to fetch friends");

			state.friendsList = await response.json();
			console.log("Friends loaded:", state.friendsList);
			rerender();

			if (!socketInitialized) {
				socketInitialized = true;
				addWebSocketListener((event) => {
					if (event.type === "friend_status") {
						const { userId, online } = event.payload;
						const friend = state.friendsList.find(f => f.id === userId);
						if (friend) {
							friend.online = online;
							console.log(`Friend ${friend.name} is now ${online ? "online" : "offline"}`);
							rerender();
						}
					}
				});
			}
		} catch (error) {
			console.error("Error loading friends:", error);
		} finally {
			state.loading = false;
		}
	};


	if (!state.loading && state.friendsList.length === 0) {
		state.loading = true;
		loadFriends().catch(console.error);
	}

	const handleFriendAction = async (action: "add" | "del", friendEmail?: string) => {
		try {
			const response = await fetch("/api/friends", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					action,
					emailClient: friendEmail,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Action failed");
			}
			console.log("data friends api: ", data);

			console.log(data.message);
			await loadFriends();
		} catch (error) {
			console.error("Friend action error:", error);
		}
	};

	const handleAddFriend = async () => {
		if (state.friendEmail) {
			try {
				await handleFriendAction("add", state.friendEmail);
				state.friendEmail = "";
			} catch (error) {
				console.error("Erreur lors de l'ajout:", error);
			}
		}
	};

	const handleDeleteFriend = async (friendTodel: string) => {
		try {
			await handleFriendAction("del", friendTodel);
		} catch (e) {
			console.error("Erreur lors de l'ajout: ", e);
		}
	}

	const filteredFriends = state.friendsList.filter((friend) =>
		`${friend.name} ${friend.surname} ${friend.email}`
			.toLowerCase()
			.includes(state.search.toLowerCase())
	);

	if (!state.loading && state.friendsList.length === 0) {
		loadFriends();
	}

	return Div({
		class: "min-h-screen bg-yellow-400 flex flex-col items-center pt-20",
	}, [
		// Titre
		Div({ class: "text-3xl font-bold mb-8" }, [
			P({}, [t("friends.my_friends")]),
		]),
		// Ajouter un ami
		Div({ class: "flex mb-8 w-full max-w-md" }, [
			Input({
				id: "addFriend",
				type: "text",
				placeholder: t("friends.add_friend_email_placeholder"),
				value: state.friendEmail,
				class: "flex-grow p-2 rounded border",
				onChange: () => {
					state.friendEmail = (document.getElementById("addFriend") as HTMLInputElement).value;
				},
			}),
			Button({
				id: "addFriendsButton",
				class: "ml-2 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded",
				onClick: handleAddFriend,
			}, [t("friends.add")]),
		]),

		// Liste d'amis
		Div({
			class: "w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden",
		},
			filteredFriends.length > 0
				? [
					...filteredFriends.map((friend) =>
						Div({
							class: `flex items-center justify-between p-4 border-b ${friend.online ? "bg-green-50" : ""
								}`,
						}, [
							Div({ class: "flex items-center" }, [
								Div({ class: "relative" }, [
									!friend.avatar_path ?
										Image({
											id: "avatar",
											src: "../assets/avatar.png",
											class: "w-10 h-10 rounded-full",
										}) :
										Image({
											id: "avatar",
											src: `${friend.avatar_path}`,
											class: "w-10 h-10 rounded-full",
										}),
									friend.online ?
										Div({
											class: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white",
										}) :
										Div({}),
								]),
								Div({ class: "ml-4" }, [
									P({ class: "font-medium" }, [`${friend.name} ${friend.surname}`]),
									P({ class: "text-gray-500 text-sm" }, [friend.email]),
								]),
							]),
							Button({
								id: `friend-${friend.id}-action`,
								class: "text-red-500 hover:text-red-700",
								onClick: () => handleDeleteFriend(friend.email),
							}, [t("friends.remove")]),
						])
					)
				]
				: [
					Div({ class: "p-4 text-center text-gray-500" }, [state.friendsList.length === 0
						? t("friends.no_friends_yet")
						: t("friends.no_friend_found")]
					)
				]
		)
	]);
}
