import { useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";

export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const success = login(username, password);
    if (!success) {
      setError("Invalid credentials. Hint: chef / recipe123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🍳 Recipe Collection
          </h1>
          <p className="text-gray-600 mt-2">Sign in to manage your recipes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Sign In
          </button>

          <p className="text-center text-sm text-gray-500">
            Demo credentials:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">chef</code> /{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">recipe123</code>
          </p>
        </form>
      </div>
    </div>
  );
}
