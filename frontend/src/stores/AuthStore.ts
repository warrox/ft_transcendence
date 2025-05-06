type User = {
	id: string;
	is_2FA: boolean;
	name: string;
	surname: string;
	email: string;
	password: string;
};

export const AuthStore = {
	isLoggedIn: false,
	user: null as null | User,
	
	async fetchMe(): Promise<void> {
		try {
			const res = await fetch("/api/me", {
				credentials: "include",
				headers: {
					'Content-Type': 'application/json',
				},
			});

			console.log("Response status:", res.status);

			if (res.ok) {
				const userData = await res.json();
				console.log("User data received:", userData);
				this.user = userData as User;
				// this.user = {
				// 	id: userData.id,
				// 	is_2FA: userData.is_2FA,
				// 	name: userData.name,
				// 	surname: userData.surname,
				// 	email: userData.email
				// };
				this.isLoggedIn = true;
				console.log("Authentication successful");
			} else {
				const errorData = await res.json();
				console.log("Authentication failed, status:", res.status);
				console.log("Error from back : ", errorData.error);
				this.resetAuthState();
			}
		} catch (err) {
			console.error("Error fetching user data:", err);
			this.resetAuthState();
		}
	},

	resetAuthState(): void {
		this.user = null;
		this.isLoggedIn = false;
	}
};

