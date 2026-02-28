import React, { useEffect, useState } from "react";
import "./MovieDetail.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";

const MovieDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isTV = location.pathname.startsWith("/tv/");

  const [detail, setDetail] = useState(null);
  const [credits, setCredits] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistDocId, setWatchlistDocId] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const type = isTV ? "tv" : "movie";

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    };
    const base = `https://api.themoviedb.org/3/${type}/${id}`;

    Promise.all([
      fetch(`${base}?language=en-US`, { headers }).then((r) => r.json()),
      fetch(`${base}/credits?language=en-US`, { headers }).then((r) =>
        r.json(),
      ),
      fetch(`${base}/videos?language=en-US`, { headers }).then((r) => r.json()),
      fetch(`${base}/similar?language=en-US&page=1`, { headers }).then((r) =>
        r.json(),
      ),
    ])
      .then(([detailData, creditsData, videosData, similarData]) => {
        setDetail(detailData);
        setCredits(creditsData.cast?.slice(0, 8) || []);
        setVideos(videosData.results || []);
        setSimilar(
          similarData.results?.filter((m) => m.poster_path).slice(0, 12) || [],
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, type]);

  // Check watchlist
  useEffect(() => {
    const checkWatchlist = async () => {
      const user = auth.currentUser;
      if (!user || !id) return;
      const q = query(
        collection(db, "watchlist"),
        where("uid", "==", user.uid),
        where("movieId", "==", String(id)),
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setInWatchlist(true);
        setWatchlistDocId(snap.docs[0].id);
      }
    };
    checkWatchlist();
  }, [id]);

  const toggleWatchlist = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (inWatchlist) {
      await deleteDoc(doc(db, "watchlist", watchlistDocId));
      setInWatchlist(false);
      setWatchlistDocId(null);
      toast.info("Removed from watchlist");
    } else {
      const ref = await addDoc(collection(db, "watchlist"), {
        uid: user.uid,
        movieId: String(id),
        title: detail?.title || detail?.name,
        poster_path: detail?.poster_path,
        release_date: detail?.release_date || detail?.first_air_date,
        vote_average: detail?.vote_average,
        addedAt: new Date(),
      });
      setInWatchlist(true);
      setWatchlistDocId(ref.id);
      toast.success("Added to watchlist! 🎬");
    }
  };

  const trailerKey =
    videos.find((v) => v.type === "Trailer" && v.site === "YouTube")?.key ||
    videos.find((v) => v.site === "YouTube")?.key;

  if (loading) {
    return (
      <div className="detail-loading">
        <Navbar />
        <div className="detail-spinner"></div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="detail-loading">
        <Navbar />
        <p style={{ color: "#fff", textAlign: "center", marginTop: "200px" }}>
          Not found.
        </p>
      </div>
    );
  }

  const title = detail.title || detail.name;
  const year = (detail.release_date || detail.first_air_date)?.slice(0, 4);
  const runtime = detail.runtime
    ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}m`
    : detail.number_of_seasons
      ? `${detail.number_of_seasons} Season${detail.number_of_seasons > 1 ? "s" : ""}`
      : "";

  return (
    <div className="movie-detail">
      <Navbar />

      {/* Backdrop */}
      {detail.backdrop_path && (
        <div
          className="detail-backdrop"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${detail.backdrop_path})`,
          }}
        />
      )}

      <div className="detail-content">
        {/* Poster + Info */}
        <div className="detail-main">
          <div className="detail-poster">
            {detail.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${detail.poster_path}`}
                alt={title}
              />
            ) : (
              <div className="poster-placeholder">🎬</div>
            )}
          </div>

          <div className="detail-info">
            {isTV && <span className="tv-badge">📺 TV Series</span>}
            <h1 className="detail-title">{title}</h1>

            <div className="detail-meta">
              <span className="meta-rating">
                ⭐ {detail.vote_average?.toFixed(1)}
              </span>
              <span className="meta-votes">
                {detail.vote_count?.toLocaleString()} votes
              </span>
              {year && <span className="meta-year">{year}</span>}
              {runtime && <span className="meta-runtime">{runtime}</span>}
            </div>

            <div className="detail-genres">
              {detail.genres?.map((g) => (
                <span key={g.id} className="genre-tag">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="detail-overview">{detail.overview}</p>

            <div className="detail-actions">
              {trailerKey && (
                <button
                  className="btn-play"
                  onClick={() => setShowTrailer(true)}
                >
                  ▶ Play Trailer
                </button>
              )}
              <button
                className={`btn-watchlist ${inWatchlist ? "in-list" : ""}`}
                onClick={toggleWatchlist}
              >
                {inWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
              </button>
              <button className="btn-back" onClick={() => navigate(-1)}>
                ← Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Cast */}
        {credits.length > 0 && (
          <div className="detail-section">
            <h2>Top Cast</h2>
            <div className="cast-grid">
              {credits.map((actor) => (
                <div key={actor.id} className="cast-card">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "https://via.placeholder.com/80x80?text=?"
                    }
                    alt={actor.name}
                  />
                  <p className="cast-name">{actor.name}</p>
                  <p className="cast-char">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="detail-section">
            <h2>More Like This</h2>
            <div className="similar-grid">
              {similar.map((m) => (
                <div
                  key={m.id}
                  className="similar-card"
                  onClick={() =>
                    navigate(isTV ? `/tv/${m.id}` : `/movie/${m.id}`)
                  }
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                    alt={m.title || m.name}
                  />
                  <p>{m.title || m.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div
            className="trailer-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="trailer-close"
              onClick={() => setShowTrailer(false)}
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="trailer"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MovieDetail;
