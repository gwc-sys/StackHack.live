import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  getIdToken
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase/config";
import { useAuth } from "./AuthContext";

// Use Vite env var for backend base URL, fallback to localhost
const BACKEND_URL: string = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Separate loading states
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);

  const navigate = useNavigate();
  const { updateUserAfterSocialLogin } = useAuth();

  // Authenticate user in Django backend and get JWT token
  const authenticateInBackend = async (loginIdentifier: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginIdentifier, // backend accepts username or email here
          password: password
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(err?.error || JSON.stringify(err));
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Backend authentication failed');
    }
  };

  // Sync social user with Django backend
  const syncSocialUserWithBackend = async (firebaseUser: any) => {
    try {
      const idToken = await getIdToken(firebaseUser);

      const response = await fetch(`${BACKEND_URL}/auth/firebase-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'user',
          full_name: firebaseUser.displayName || '',
          avatar_url: firebaseUser.photoURL || '',
          provider: firebaseUser.providerData[0]?.providerId || 'google',
          id_token: idToken    // pass the Firebase id token in the JSON body
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Sync failed' }));
        throw new Error(err?.error || JSON.stringify(err));
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Backend sync failed');
    }
  };

  // Store JWT token and user data
  const handleLoginSuccess = (token: string, userData: any) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setError("");
    setSuccess("");

    try {
      // 1. Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email.trim(),
        password
      );
      
      // 2. Authenticate in Django backend and get JWT token
      const backendResponse = await authenticateInBackend(email.trim(), password);
      
      // 3. Store JWT token and user data
      handleLoginSuccess(backendResponse.token, backendResponse.user);

      console.log("Signin successful:", userCredential.user);
      setSuccess("Successfully logged in!");

      // Redirect to homepage after 1 second
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err: any) {
      console.error("Signin error:", err);
      
      // Handle specific Firebase errors
      switch (err.code) {
        case 'auth/invalid-email':
          setError("Invalid email address format.");
          break;
        case 'auth/user-disabled':
          setError("This account has been disabled.");
          break;
        case 'auth/user-not-found':
          setError("No account found with this email.");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/invalid-credential':
          setError("Invalid login credentials.");
          break;
        case 'auth/too-many-requests':
          setError("Too many failed attempts. Please try again later.");
          break;
        case 'auth/network-request-failed':
          setError("Network error. Please check your connection.");
          break;
        default:
          if (err.message.includes('Backend authentication failed')) {
            setError("Firebase authentication successful but backend sync failed. Please contact support.");
          } else {
            setError(err.message || "Sign in failed. Please try again.");
          }
      }
    } finally {
      setLoadingForm(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoadingGoogle(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Sync with Django backend and get JWT token
      const backendResponse = await syncSocialUserWithBackend(result.user);
      
      // Store JWT token and user data
      updateUserAfterSocialLogin(backendResponse.token, backendResponse.user);

      console.log("Google signin successful:", result.user);
      setSuccess("Successfully signed in with Google!");
      
      // Redirect to homepage
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err: any) {
      console.error("Google signin error:", err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Google signin was cancelled.");
      } else if (err.message.includes('Backend sync failed')) {
        setError("Google authentication successful but backend sync failed. Please contact support.");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError("An account already exists with the same email but different sign-in method.");
      } else {
        setError(err.message || "Google signin failed. Please try again.");
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleGitHubAuth = async () => {
    setLoadingGithub(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, githubProvider);
      
      // Sync with Django backend and get JWT token
      const backendResponse = await syncSocialUserWithBackend(result.user);
      
      // Store JWT token and user data
      updateUserAfterSocialLogin(backendResponse.token, backendResponse.user);

      console.log("GitHub signin successful:", result.user);
      setSuccess("Successfully signed in with GitHub!");
      
      // Redirect to homepage
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err: any) {
      console.error("GitHub signin error:", err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError("GitHub signin was cancelled.");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError("An account already exists with the same email but different sign-in method.");
      } else if (err.message.includes('Backend sync failed')) {
        setError("GitHub authentication successful but backend sync failed. Please contact support.");
      } else {
        setError(err.message || "GitHub signin failed. Please try again.");
      }
    } finally {
      setLoadingGithub(false);
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
            Welcome Back to{" "}
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
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
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
            disabled={loadingForm}
            className={`w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
              loadingForm ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loadingForm ? "Signing In..." : "Sign In"}
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
          <button
            onClick={handleGoogleAuth}
            disabled={loadingGoogle}
            className={`flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 transition hover:bg-gray-50 ${
              loadingGoogle ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.18v2.98h5.32c-.23 1.23-1.38 3.6-4.32 3.6-2.6 0-4.73-2.15-4.73-4.77s2.13-4.77 4.73-4.77c1.48 0 2.47.63 3.04 1.17l2.09-2.02C17.04 5.7 15.39 5 13.17 5 9.07 5 5.73 8.36 5.73 12.46S9.07 19.9 13.17 19.9c3.77 0 6.26-2.64 6.26-6.36 0-.43-.05-.9-.08-1.34z"
              />
            </svg>
            {loadingGoogle ? "Signing in..." : "Sign in with Google"}
          </button>

          <button
            onClick={handleGitHubAuth}
            disabled={loadingGithub}
            className={`flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 transition hover:bg-gray-50 ${
              loadingGithub ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.8-.26.8-.58v-2.24c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.73.08-.73 1.22.09 1.86 1.25 1.86 1.25 1.08 1.83 2.83 1.3 3.52.99.11-.78.42-1.3.77-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.93.43.38.82 1.1.82 2.22v3.29c0 .32.2.7.81.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {loadingGithub ? "Signing in..." : "Sign in with GitHub"}
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
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