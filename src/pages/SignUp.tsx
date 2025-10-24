import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { 
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  getIdToken
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase/config"; 
import { useAuth } from "./AuthContext";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // separate loading states
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);

  const navigate = useNavigate();
  const { updateUserAfterSocialLogin } = useAuth();

  // Register user in Django backend and get JWT token
  const registerInBackend = async (firebaseUser: any, backendUsername: string, password?: string) => {
    const idToken = await getIdToken(firebaseUser);

    const response = await fetch('http://localhost:8000/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // do NOT put the Firebase idToken in Authorization header unless backend expects it
      },
      body: JSON.stringify({
        username: backendUsername,
        email: firebaseUser.email,
        full_name: name.trim(),
        firebase_uid: firebaseUser.uid,
        provider: 'email',
        password: password,            // <- include password
        confirm_password: password,    // <- include confirm_password (serializer expects it may be present)
        id_token: idToken
      })
    });

    if (!response.ok) {
      const e = await response.json();
      throw new Error(e?.error || JSON.stringify(e) || 'Backend registration failed');
    }
    return await response.json();
  };

  // Sync social user with Django backend
  const syncSocialUserWithBackend = async (firebaseUser: any) => {
    try {
      const idToken = await getIdToken(firebaseUser);
      
      const response = await fetch('http://localhost:8000/api/auth/firebase-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'user',
          full_name: firebaseUser.displayName || '',
          avatar_url: firebaseUser.photoURL || '',
          provider: firebaseUser.providerData[0]?.providerId || 'google',
          id_token: idToken
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Backend sync failed');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Backend sync failed');
    }
  };

  // Store JWT token and user data
  const handleLoginSuccess = (token: string, userData: any) => {
    // Store token in localStorage
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    // Set authorization header for future requests
    // This would typically be handled in an axios interceptor or fetch wrapper
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setError("");
    setSuccess(false);

    if (!username.trim()) {
      setError("Username is required");
      setLoadingForm(false);
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      setLoadingForm(false);
      return;
    }

    try {
      // 1. Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email.trim(), 
        password
      );
      
      // 2. Update Firebase profile
      await updateProfile(userCredential.user, {
        displayName: name.trim()
      });

      // 3. Register in Django backend and get JWT token
      const backendResponse = await registerInBackend(userCredential.user, username.trim(), password);
      
      // 4. Store JWT token and user data
      handleLoginSuccess(backendResponse.token, backendResponse.user);

      console.log("Signup successful:", userCredential.user);
      setSuccess(true);

      // Clear form fields
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err: any) {
      console.error("Signup error:", err);
      
      // Handle specific Firebase errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError("This email is already registered. Please use a different email or sign in.");
          break;
        case 'auth/invalid-email':
          setError("Invalid email address format.");
          break;
        case 'auth/weak-password':
          setError("Password is too weak. Please use a stronger password.");
          break;
        case 'auth/operation-not-allowed':
          setError("Email/password accounts are not enabled. Please contact support.");
          break;
        default:
          if (err.message.includes('Backend registration failed')) {
            setError("Account created in Firebase but failed to sync with backend. Please contact support.");
          } else {
            setError(err.message || "Registration failed. Please try again.");
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

      console.log("Google signup successful:", result.user);
      setSuccess(true);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err: any) {
      console.error("Google signup error:", err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Google signup was cancelled.");
      } else if (err.message.includes('Backend sync failed')) {
        setError("Google authentication successful but backend sync failed. Please contact support.");
      } else {
        setError(err.message || "Google signup failed. Please try again.");
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

      console.log("GitHub signup successful:", result.user);
      setSuccess(true);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err: any) {
      console.error("GitHub signup error:", err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError("GitHub signup was cancelled.");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError("An account already exists with the same email but different sign-in method.");
      } else if (err.message.includes('Backend sync failed')) {
        setError("GitHub authentication successful but backend sync failed. Please contact support.");
      } else {
        setError(err.message || "GitHub signup failed. Please try again.");
      }
    } finally {
      setLoadingGithub(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-5">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">SᴛᴀᴄᴋHᴀᴄᴋ</h1>
        <p className="text-gray-600">
          The most comprehensive platform for Developers
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md mb-10">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-600 text-green-800 p-4 mb-4 rounded">
            ✅ Registration successful! Redirecting to dashboard...
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loadingForm}
            className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 mb-4 ${
              loadingForm ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loadingForm ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Social Login moved to bottom */}
        <div className="flex flex-col space-y-3 mt-6">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loadingGoogle}
            className={`w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center ${
              loadingGoogle ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.786-1.664-4.153-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.67-0.069-1.325-0.189-1.971h-9.811z" />
            </svg>
            {loadingGoogle ? "Signing up..." : "Sign up with Google"}
          </button>

          <button
            type="button"
            onClick={handleGitHubAuth}
            disabled={loadingGithub}
            className={`w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center ${
              loadingGithub ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            {loadingGithub ? "Signing up..." : "Sign up with GitHub"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;