import React, { useEffect, useState } from "react";
import "./TVShows.css";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const TABS = [
  { key: "trending/tv/week", label: "Trending" },
  { key: "tv/top_rated", label: "Top Rated" },
  { key: "tv/popular", label: "Popular" },
  { key: "tv/airing_today", label: "Airing Today" },
  { key: "tv/on_the_air", label: "On The Air" },
];

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [activeTab, setActiveTab] = useState("trending/tv/week");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  const fetchShows = async (tab, newPage = 1, reset = true) => {
    if (newPage === 1) setLoading(true);
    else setLoadingMore(true);

    const res = await fetch(
      `https://api.themoviedb.org/3/${tab}?language=en-US&page=${newPage}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      },
    );
    const data = await res.json();
    const results = data.results?.filter((s) => s.poster_path) || [];

    if (reset) setShows(results);
    else setShows((prev) => [...prev, ...results]);

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    setPage(1);
    fetchShows(activeTab, 1, true);
  }, [activeTab]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchShows(activeTab, nextPage, false);
  };

  return (
    <div className="tvshows-page">
      <Navbar />
      <div className="tvshows-content">
        <h1 className="tvshows-heading">📺 TV Shows</h1>

        {/* Tabs */}
        <div className="tv-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tv-tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="tvshows-grid">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="tv-skeleton"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="tvshows-grid">
              {shows.map((s) => (
                <div
                  key={s.id}
                  className="tv-card"
                  onClick={() => navigate(`/tv/${s.id}`)}
                >
                  <div className="tv-poster">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${s.poster_path}`}
                      alt={s.name}
                    />
                    <div className="tv-overlay">▶</div>
                    <span className="tv-rating">
                      ⭐ {s.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  <p className="tv-title">{s.name}</p>
                </div>
              ))}
            </div>
            <button
              className="load-more-btn"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TVShows;
