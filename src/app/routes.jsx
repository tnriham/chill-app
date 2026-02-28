import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth.js";

import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";

import Film from "../pages/Film.jsx";
import Series from "../pages/Series.jsx";
import MyList from "../pages/MyList.jsx";
import Profile from "../pages/Profile.jsx";
import Subscribe from "../pages/Subscribe.jsx";
import Payment from "../pages/Payment.jsx";

import WatchFilm from "../pages/WatchFilm.jsx";
import WatchSeries from "../pages/WatchSeries.jsx";

function RequireAuth({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  return isLoggedIn() ? <Navigate to="/" replace /> : children;
}

const routes = [
  // ✅ Beranda (sesuai mockup): setelah login masuk sini
  {
    path: "/",
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
  },

  // ✅ Auth pages (kalau sudah login, gak bisa balik ke login/register)
  {
    path: "/login",
    element: (
      <PublicOnly>
        <Login />
      </PublicOnly>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnly>
        <Register />
      </PublicOnly>
    ),
  },

  // ✅ Pages lain (wajib login)
  { path: "/film", element: <RequireAuth><Film /></RequireAuth> },
  { path: "/series", element: <RequireAuth><Series /></RequireAuth> },
  { path: "/my-list", element: <RequireAuth><MyList /></RequireAuth> },
  { path: "/profile", element: <RequireAuth><Profile /></RequireAuth> },
  { path: "/subscribe", element: <RequireAuth><Subscribe /></RequireAuth> },
  { path: "/payment", element: <RequireAuth><Payment /></RequireAuth> },

  { path: "/watch/film/:id", element: <RequireAuth><WatchFilm /></RequireAuth> },
  { path: "/watch/series/:id", element: <RequireAuth><WatchSeries /></RequireAuth> },

  // ✅ fallback
  { path: "*", element: <Navigate to="/" replace /> },
];

export default routes;
