import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- import useNavigate
import { useAuth } from "./AuthContext";

const SignIn = () => {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate(); // <-- initialize navigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await login(loginIdentifier, password);
      setSuccess("Successfully logged in!");
      setTimeout(() => {
        navigate("/"); // <-- redirect to homepage
      }, 1000); // 1 second delay to show success message
    } catch (err: any) {
      setError(err.response?.data?.error || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-5">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-extrabold text-gray-800">
            SᴛᴀᴄᴋHᴀᴄᴋ
          </h1>
          <p className="text-gray-500">
            Welcome Back in{" "}
            <span className="font-semibold">SᴛᴀᴄᴋHᴀᴄᴋ</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border-l-4 border-red-500 bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 rounded-lg border-l-4 border-green-500 bg-green-100 p-3 text-green-700">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="loginIdentifier"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Username or Email
            </label>
            <input
              type="text"
              id="loginIdentifier"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              required
              placeholder="Enter your username or email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="h-px flex-grow bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">or continue with</span>
          <div className="h-px flex-grow bg-gray-300"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 transition hover:bg-gray-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.18v2.98h5.32c-.23 1.23-1.38 3.6-4.32 3.6-2.6 0-4.73-2.15-4.73-4.77s2.13-4.77 4.73-4.77c1.48 0 2.47.63 3.04 1.17l2.09-2.02C17.04 5.7 15.39 5 13.17 5 9.07 5 5.73 8.36 5.73 12.46S9.07 19.9 13.17 19.9c3.77 0 6.26-2.64 6.26-6.36 0-.43-.05-.9-.08-1.34z"
              />
            </svg>
            Google
          </button>

          <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 transition hover:bg-gray-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.8-.26.8-.58v-2.24c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.73.08-.73 1.22.09 1.86 1.25 1.86 1.25 1.08 1.83 2.83 1.3 3.52.99.11-.78.42-1.3.77-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.93.43.38.82 1.1.82 2.22v3.29c0 .32.2.7.81.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
