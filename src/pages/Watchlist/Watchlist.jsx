import React, { useEffect, useState } from "react";
import "./Watchlist.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { db, auth } from "../../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubSnapshot = null;

    // onAuthStateChanged wait karta hai jab tak Firebase auth
    // properly initialize ho jaye — refresh pe bhi kaam karta hai
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        setWatchlist([]);
        return;
      }

      const q = query(
        collection(db, "watchlist"),
        where("uid", "==", user.uid)
      );

      unsubSnapshot = onSnapshot(q, (snap) => {
        const items = snap.docs.map((d) => ({ firestoreId: d.id, ...d.data() }));
        items.sort((a, b) => b.addedAt?.toDate?.() - a.addedAt?.toDate?.());
        setWatchlist(items);
        setLoading(false);
      });
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);

  const removeFromWatchlist = async (e, firestoreId) => {
    e.stopPropagation();
    await deleteDoc(doc(db, "watchlist", firestoreId));
    toast.info("Removed from watchlist");
  };

  return (
    <div className="watchlist-page">
      <Navbar />
      <div className="watchlist-content">
        <h1 className="watchlist-title">❤️ My Watchlist</h1>

        {loading ? (
          <div className="watchlist-loading">
            <div className="wl-spinner"></div>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="watchlist-empty">
            <p>🎬 Your watchlist is empty</p>
            <button onClick={() => navigate("/movies")}>Browse Movies</button>
          </div>
        ) : (
          <div className="watchlist-grid">
            {watchlist.map((item) => (
              <div
                key={item.firestoreId}
                className="wl-card"
                onClick={() => navigate(`/movie/${item.movieId}`)}
              >
                <div className="wl-poster">
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title}
                    />
                  ) : (
                    <div className="wl-no-poster">🎬</div>
                  )}
                  <button
                    className="wl-remove"
                    onClick={(e) => removeFromWatchlist(e, item.firestoreId)}
                  >
                    ✕
                  </button>
                </div>
                <div className="wl-info">
                  <p className="wl-title">{item.title}</p>
                  <p className="wl-year">{item.release_date?.slice(0, 4)}</p>
                  {item.vote_average > 0 && (
                    <p className="wl-rating">
                      ⭐ {item.vote_average?.toFixed(1)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Watchlist;