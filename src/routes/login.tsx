import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GoogleLogin } from "@react-oauth/google";
import { authApi } from "@/lib/api";
import { useUser } from "@/contexts/UserContext";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loadUser } = useUser();

  const handleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authApi.verifyGoogleToken(credentialResponse.credential);
      localStorage.setItem('token', result.data.token);
      await loadUser(); // Load user data after successful login
      navigate({ to: '/' });
    } catch (err) {
      setError('Failed to complete login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Failed to login with Google. Please try again.');
  };

  return (
    <div className="flex h-[calc(100vh-var(--h-header))] items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome to DailyAct
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Track your daily activities efficiently
        </p>
        {error && (
          <div className="text-sm text-red-600 text-center mb-4">{error}</div>
        )}
        {loading && (
          <div className="text-sm text-blue-600 text-center mb-4">Logging you in...</div>
        )}
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
          />
        </div>
      </div>
    </div>
  );
}
