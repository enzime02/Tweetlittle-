// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import MyPosts from "./pages/MyPosts";
import "./App.css";

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-100">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // El loader global ya se maneja en PrivateRoute,
    // pero esto cubre las rutas públicas
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/new"
        element={
          <PrivateRoute>
            <NewPost />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:uid"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        }
      />
      <Route
        path="/myposts"
        element={
          <PrivateRoute>
            <MyPosts />
          </PrivateRoute>
        }
      />

      <Route
        path="/login"
        element={currentUser ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={currentUser ? <Navigate to="/" replace /> : <Signup />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Navbar />
          <main className="max-w-4xl mx-auto px-4 pt-20 pb-10">
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
