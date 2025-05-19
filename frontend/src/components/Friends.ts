	import { Div, P, Button, Input, Image } from "../lib/PongFactory";
	import { PongNode } from "../lib/PongNode";
	import { AuthStore } from "../stores/AuthStore";
	import { rerender } from "../router/router";

	type Friend = {
	id: number;
	name: string;
	surname: string;
	email: string;
	online: boolean;
	};

	let friendsList: Friend[] = [];
	let searchInput = "";
	let friendEmail = "";
	let hasLoaded = false;

	export function Friends(): PongNode<any> {
	// Fonction pour charger la liste d'amis

		
		const loadFriends = async () => {
			console.log("Loading friends...");
			try {
			const response = await fetch("/api/getFriends", {
				credentials: "include",
				headers: {
				"Content-Type": "application/json",
				},
			});

			if (!response.ok) throw new Error("Failed to fetch friends");

			friendsList = await response.json();
			console.log("Friends loaded:", friendsList);
			rerender(); // Force le re-rendu
			} catch (error) {
				console.error("Error loading friends:", error);
			}
		};

		if (!hasLoaded && friendsList.length === 0) {
			hasLoaded = true;
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

				console.log(data.message);
				await loadFriends();
			} catch (error) {
				console.error("Friend action error:", error);
			}
		};

		const handleAddFriend = async () => {
			if (friendEmail) {
			try {
				await handleFriendAction("add", friendEmail);
				friendEmail = ""; // Reset le champ
				await loadFriends(); // Recharge la liste
				rerender(); // Force le rendu
			} catch (error) {
				console.error("Erreur lors de l'ajout:", error);
			}
			}
		};

		console.log("friend list before filter", friendsList);
		
		const filteredFriends = friendsList.filter((friend) =>
			`${friend.name} ${friend.surname} ${friend.email}`
			.toLowerCase()
			.includes(searchInput.toLowerCase())
		);

		console.log("filtered Filter", filteredFriends);
		

		// Chargement initial
		if (friendsList.length === 0) {
			loadFriends();
		}

		console.log("friendsList len = ", friendsList.length);
		console.log("friend list = ", friendsList);
		

		return Div({
			class: "min-h-screen bg-yellow-400 flex flex-col items-center pt-20",
		}, [
			// Titre
			Div({ class: "text-3xl font-bold mb-8" }, [
			P({}, ["Mes Amis"]),
			]),

			// Barre de recherche
			Div({ class: "flex mb-6 w-full max-w-md" }, [
			Input({
				id: "searchFriends",
				type: "text",
				placeholder: "Rechercher un ami...",
				value: searchInput,
				class: "flex-grow p-2 rounded-l",
				onChange: () => {
				searchInput = (document.getElementById("searchFriends") as HTMLInputElement).value;
				rerender();
				},
			}),
			Button({
				id: "loadFriendButtron",
				class: "bg-blue-500 text-white p-2 rounded-r",
				onClick: loadFriends,
			}, [
				Image({ id: "loadFriendImg", src: "../assets/refresh.svg", class: "w-6 h-6" })
			])
			]),

			// Ajouter un ami
			Div({ class: "flex mb-8 w-full max-w-md" }, [
			Input({
				id: "addFriend",
				type: "text",
				placeholder: "Email de l'ami à ajouter",
				value: friendEmail,
				class: "flex-grow p-2 rounded-l",
				onChange: () => {
				friendEmail = (document.getElementById("addFriend") as HTMLInputElement).value;
				rerender();
				},
			}),
			Button({
				id: "addFriendsButton",
				class: "bg-green-500 text-white p-2 rounded-r",
				onClick: handleAddFriend,
			}, ["Ajouter"]),
			]),

			// Liste d'amis
			Div({
			class: "w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden",
			}, 
			filteredFriends.length > 0 
				? [
					...filteredFriends.map((friend) =>
					Div({
						class: `flex items-center justify-between p-4 border-b ${
						friend.online ? "bg-green-50" : ""
						}`,
					}, [
						Div({ class: "flex items-center" }, [
						Div({ class: "relative" }, [
							Image({
							id: "avatar",
							src: "../assets/avatar.png",
							class: "w-10 h-10 rounded-full",
							}),
							// friend.online && 
							Div({
								class: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white",
							})
						]),
						Div({ class: "ml-4" }, [
							P({ class: "font-medium" }, [`${friend.name} ${friend.surname}`]),
							P({ class: "text-gray-500 text-sm" }, [friend.email]),
						]),
						]),
						Button({
						id: `friend-${friend.id}-action`,
						class: "text-red-500 hover:text-red-700",
						onClick: () => handleFriendAction("del", friend.email),
						}, ["Supprimer"])
					])
					)
				]
				: [
						Div({ class: "p-4 text-center text-gray-500" }, [friendsList.length === 0 
							? "Vous n'avez pas encore d'amis" 
							: "Aucun ami trouvé"]
						)
					]
			)
		]);
}
