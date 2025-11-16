import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function sanitizeHandle(raw) {
    return raw
      .trim()
      .toLowerCase()
      .replace(/^@/, "")        // quita @ si el usuario lo pone
      .replace(/\s+/g, "");     // sin espacios
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!displayName.trim()) {
      setError("Please enter a display name.");
      return;
    }
    if (!handle.trim()) {
      setError("Please choose a handle.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const cleanHandle = sanitizeHandle(handle);

    setLoading(true);
    try {
      // 1) Crear usuario en Firebase Auth
      await signup(
        email,
        password,
        displayName.trim(),
        handle.trim()
      );
      const user = cred.user;

      // 2) Actualizar el perfil de Auth (para currentUser.displayName)
      await updateProfile(user, {
        displayName: displayName.trim(),
      });

      // 3) Crear documento en Firestore /users/{uid}
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: displayName.trim(),
        handle: cleanHandle,            
        email: user.email,
        bio: "",
        avatarUrl: "",
        createdAt: serverTimestamp(),
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-title-row">
          <div className="auth-logo">t</div>
          <h1 className="auth-title">Create your account</h1>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Your display name"
            className="field"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Your handle (username)"
            className="field"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />

          <input
            type="email"
            required
            placeholder="Email"
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="Password"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="Confirm password"
            className="field"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#38bdf8" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
