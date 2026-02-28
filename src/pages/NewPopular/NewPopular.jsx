import React, { useEffect, useState } from "react";
import "./NewPopular.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const NewPopular = () => {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("movie");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  const fetchItems = async (t, newPage = 1, reset = true) => {
    if (newPage === 1) setLoading(true);
    else setLoadingMore(true);

    const res = await fetch(
      `https://api.themoviedb.org/3/trending/${t}/week?language=en-US&page=${newPage}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      },
    );
    const data = await res.json();
    const results = data.results?.filter((m) => m.poster_path) || [];

    if (reset) setItems(results);
    else setItems((prev) => [...prev, ...results]);

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    setPage(1);
    fetchItems(type, 1, true);
  }, [type]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(type, nextPage, false);
  };

  return (
    <div className="np-page">
      <Navbar />

      <div className="np-hero">
        <h1>🔥 New & Popular</h1>
        <p>Trending this week on Netflix</p>
      </div>

      <div className="np-content">
        {/* Tabs */}
        <div className="np-tabs">
          <button
            className={`np-tab ${type === "movie" ? "active" : ""}`}
            onClick={() => setType("movie")}
          >
            🎬 Movies
          </button>
          <button
            className={`np-tab ${type === "tv" ? "active" : ""}`}
            onClick={() => setType("tv")}
          >
            📺 TV Shows
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="np-grid">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="np-skeleton"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="np-grid">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="np-card"
                  onClick={() =>
                    navigate(
                      type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`,
                    )
                  }
                >
                  <div className="np-rank">#{idx + 1 + (page - 1) * 20}</div>
                  <div className="np-poster">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title || item.name}
                    />
                    <div className="np-overlay">▶</div>
                  </div>
                  <p className="np-title">{item.title || item.name}</p>
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
      <Footer />
    </div>
  );
};

export default NewPopular;
