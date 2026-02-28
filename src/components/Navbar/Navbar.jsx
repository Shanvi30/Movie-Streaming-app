import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { logout } from "../../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const navRef = useRef();
  const bellRef = useRef();
  const searchRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBell, setShowBell] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const prevWatchlistIds = useRef(null);

  const getActiveNav = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path === "/tvshows") return "TV Shows";
    if (path === "/movies") return "Movies";
    if (path === "/new-popular") return "New & Popular";
    if (path === "/watchlist") return "My List";
    return "";
  };
  const activeNav = getActiveNav();
  const searchType = location.pathname === "/tvshows" ? "tv" : "movie";

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle("nav-dark", window.scrollY >= 80);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      fetch(
        `https://api.themoviedb.org/3/search/${searchType}?query=${encodeURIComponent(searchQuery)}&language=en-US&page=1`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          },
        },
      )
        .then((r) => r.json())
        .then((r) => {
          setSearchResults(r.results?.slice(0, 6) || []);
          setSearching(false);
        })
        .catch(() => setSearching(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, searchType]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close bell on outside click
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowBell(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsub();
  }, []);

  // Real-time notifications
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "notifications"),
      where("uid", "==", currentUser.uid),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(
        snap.docs.map((d) => ({ firestoreId: d.id, ...d.data() })),
      );
    });
    return () => unsub();
  }, [currentUser]);

  // Watch watchlist changes → auto notification
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "watchlist"),
      where("uid", "==", currentUser.uid),
    );
    const unsub = onSnapshot(q, async (snap) => {
      const currentIds = new Set(snap.docs.map((d) => d.id));
      if (prevWatchlistIds.current === null) {
        prevWatchlistIds.current = currentIds;
        return;
      }
      const newDocs = snap.docs.filter(
        (d) => !prevWatchlistIds.current.has(d.id),
      );
      for (const d of newDocs) {
        const movie = d.data();
        if (movie?.title) {
          await addDoc(collection(db, "notifications"), {
            uid: currentUser.uid,
            text: `"${movie.title}" added to watchlist! 🎬`,
            time: "Just now",
            createdAt: new Date(),
            read: false,
          }).catch(console.error);
        }
      }
      prevWatchlistIds.current = currentIds;
    });
    return () => unsub();
  }, [currentUser]);

  const deleteNotification = async (e, firestoreId) => {
    e.stopPropagation();
    await deleteDoc(doc(db, "notifications", firestoreId)).catch(console.error);
  };

  const clearAll = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;
    const q = query(
      collection(db, "notifications"),
      where("uid", "==", currentUser.uid),
    );
    const snap = await getDocs(q);
    await Promise.all(
      snap.docs.map((d) => deleteDoc(doc(db, "notifications", d.id))),
    );
  };

  const handleResultClick = (item) => {
    navigate(searchType === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`);
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const avatarSrc = localStorage.getItem("netflix_avatar") || profile_img;
  const displayName =
    localStorage.getItem("netflix_display_name") ||
    auth.currentUser?.displayName ||
    "Netflix User";

  return (
    <div ref={navRef} className="navbar">
      <div className="navbar-left">
        <img
          src={logo}
          alt="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        {/* Hamburger */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Desktop nav links */}
        <ul>
          <li
            className={activeNav === "Home" ? "active" : ""}
            onClick={() => navigate("/")}
          >
            Home
          </li>
          <li
            className={activeNav === "TV Shows" ? "active" : ""}
            onClick={() => navigate("/tvshows")}
          >
            TV Shows
          </li>
          <li
            className={activeNav === "Movies" ? "active" : ""}
            onClick={() => navigate("/movies")}
          >
            Movies
          </li>
          <li
            className={activeNav === "New & Popular" ? "active" : ""}
            onClick={() => navigate("/new-popular")}
          >
            New & Popular
          </li>
          <li
            className={activeNav === "My List" ? "active" : ""}
            onClick={() => navigate("/watchlist")}
          >
            My List
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        {/* Search */}
        <div className="search-container" ref={searchRef}>
          <div className={`search-box ${showSearch ? "expanded" : ""}`}>
            <img
              src={search_icon}
              className="icons"
              alt="search"
              onClick={() => setShowSearch(!showSearch)}
            />
            {showSearch && (
              <input
                type="text"
                className="search-input"
                placeholder={
                  searchType === "tv"
                    ? "Search TV shows..."
                    : "Search movies..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            )}
          </div>
          {showSearch && (searchResults.length > 0 || searching) && (
            <div className="search-dropdown">
              {searching ? (
                <div className="search-loading">Searching...</div>
              ) : (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="search-result-item"
                    onClick={() => handleResultClick(item)}
                  >
                    {item.backdrop_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${item.backdrop_path}`}
                        alt={item.title || item.name}
                      />
                    ) : (
                      <div className="no-img">🎬</div>
                    )}
                    <div className="search-result-info">
                      <p className="result-title">{item.title || item.name}</p>
                      <p className="result-year">
                        {(item.release_date || item.first_air_date)?.slice(
                          0,
                          4,
                        )}
                        &nbsp;·&nbsp;⭐{" "}
                        {item.vote_average > 0
                          ? item.vote_average.toFixed(1)
                          : "New"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Bell */}
        <div
          className="bell-container"
          ref={bellRef}
          onClick={() => setShowBell(!showBell)}
        >
          <img src={bell_icon} className="icons" alt="notifications" />
          {notifications.length > 0 && (
            <span className="bell-badge">{notifications.length}</span>
          )}
          {showBell && (
            <div className="bell-dropdown">
              <div className="bell-header">
                <p className="bell-title">Notifications</p>
                {notifications.length > 0 && (
                  <span className="bell-clear" onClick={clearAll}>
                    Clear all
                  </span>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="bell-empty">
                  <p>🔔 No notifications yet</p>
                  <p>Add a movie to watchlist!</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.firestoreId} className="bell-item">
                    <span className="bell-dot" />
                    <div className="bell-item-content">
                      <p className="bell-text">{n.text}</p>
                      <p className="bell-time">{n.time}</p>
                    </div>
                    <button
                      className="bell-delete"
                      onClick={(e) => deleteNotification(e, n.firestoreId)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Profile — flex-shrink:0 so it never gets cut by search bar */}
        <div className="navbar-profile">
          <img src={avatarSrc} className="profile" alt="profile" />
          <img src={caret_icon} alt="caret" />
          <div className="dropdown">
            <div className="dropdown-header">
              <img src={avatarSrc} alt="profile" />
              <div>
                <p className="dropdown-name">{displayName}</p>
                <p className="dropdown-email">
                  {auth.currentUser?.email || ""}
                </p>
              </div>
            </div>
            <hr className="dropdown-divider" />
            <p className="dropdown-item" onClick={() => navigate("/watchlist")}>
              ❤️ My Watchlist
            </p>
            <p className="dropdown-item" onClick={() => navigate("/settings")}>
              ⚙️ Settings
            </p>
            <hr className="dropdown-divider" />
            <p
              className="dropdown-item signout"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Sign Out of Netflix
            </p>
          </div>
        </div>
      </div>

      {/* Mobile menu — Netflix logo at top */}
      {menuOpen && (
        <>
          <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
          <ul className="mobile-menu">
            {/* Logo at top of mobile menu */}
            <li className="mobile-menu-logo-item">
              <img
                src={logo}
                alt="Netflix"
                className="mobile-menu-logo"
                onClick={() => { navigate("/"); setMenuOpen(false); }}
              />
            </li>
            <li
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
            >
              🏠 Home
            </li>
            <li
              onClick={() => {
                navigate("/tvshows");
                setMenuOpen(false);
              }}
            >
              📺 TV Shows
            </li>
            <li
              onClick={() => {
                navigate("/movies");
                setMenuOpen(false);
              }}
            >
              🎬 Movies
            </li>
            <li
              onClick={() => {
                navigate("/new-popular");
                setMenuOpen(false);
              }}
            >
              🔥 New & Popular
            </li>
            <li
              onClick={() => {
                navigate("/watchlist");
                setMenuOpen(false);
              }}
            >
              ❤️ My List
            </li>
            <li
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              🚪 Sign Out
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default Navbar;