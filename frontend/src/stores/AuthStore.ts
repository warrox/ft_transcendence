type User = {
	id: string;
	is_2FA: boolean;
	name: string;
	surname: string;
	email: string;
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
				this.user = {
					id: userData.id,
					is_2FA: userData.is_2FA,
					name: userData.name,
					surname: userData.surname,
					email: userData.email
				};
				this.isLoggedIn = true;
				console.log("Authentication successful");
			} else {
				console.log(res);
				console.log("Authentication failed, status:", res.status);
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

// this.user = userData as User;
