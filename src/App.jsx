import React, { useEffect, useState } from "react";
import Home from "./pages/Home/Home";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import Player from "./pages/Player/Player";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import Watchlist from "./pages/Watchlist/Watchlist";
import Movies from "./pages/Movies/Movies";
import TVShows from "./pages/TVShows/TVShows";
import NewPopular from "./pages/NewPopular/NewPopular";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound/NotFound";
import { auth } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let unsubscribe;

    const handleAuth = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          toast.success("Welcome! Logged in with Google 🎉");
        }
      } catch (error) {
        console.error("Redirect error:", error);
      } finally {
        setAuthReady(true);
        unsubscribe = onAuthStateChanged(auth, (user) => {
          const isLoginPage = window.location.pathname === "/login";
          if (user && isLoginPage) {
            navigate("/");
          } else if (!user && !isLoginPage) {
            navigate("/login");
          }
        });
      }
    };

    handleAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!authReady) return null;

  return (
    <div>
      <ScrollToTop />
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/tv/:id" element={<MovieDetail />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tvshows" element={<TVShows />} />
        <Route path="/new-popular" element={<NewPopular />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default App;
