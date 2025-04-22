import { Outlet, createRootRoute } from "@tanstack/react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";
import { UserProvider, useUser } from "../contexts/UserContext";

function Root() {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-background font-sans antialiased">
			<Header user={user} />
			<Outlet />
			<TanStackRouterDevtools />
		</div>
	);
}

export const Route = createRootRoute({
	component: () => (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<UserProvider>
				<Root />
			</UserProvider>
		</GoogleOAuthProvider>
	),
});
