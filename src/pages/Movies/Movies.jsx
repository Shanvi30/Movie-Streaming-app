import React, { useEffect, useState } from "react";
import "./Movies.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const GENRES = [
  { id: "", label: "All" },
  { id: "28", label: "Action" },
  { id: "35", label: "Comedy" },
  { id: "27", label: "Horror" },
  { id: "10749", label: "Romance" },
  { id: "878", label: "Sci-Fi" },
  { id: "18", label: "Drama" },
  { id: "16", label: "Animation" },
  { id: "53", label: "Thriller" },
];

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "primary_release_date.desc", label: "Latest" },
  { value: "revenue.desc", label: "Box Office" },
];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("popularity.desc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bollywood, setBollywood] = useState(false);
  const navigate = useNavigate();

  const fetchMovies = async (newPage = 1, reset = true) => {
    if (newPage === 1) setLoading(true);
    else setLoadingMore(true);

    let url;
    if (bollywood) {
      url = `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&sort_by=popularity.desc&page=${newPage}`;
    } else {
      url = `https://api.themoviedb.org/3/discover/movie?sort_by=${sort}&page=${newPage}${genre ? `&with_genres=${genre}` : ""}&vote_count.gte=100`;
    }

    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    });
    const data = await res.json();
    const results = data.results?.filter((m) => m.poster_path) || [];

    if (reset) setMovies(results);
    else setMovies((prev) => [...prev, ...results]);

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    setPage(1);
    fetchMovies(1, true);
  }, [genre, sort, bollywood]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage, false);
  };

  return (
    <div className="movies-page">
      <Navbar />
      <div className="movies-content">
        <h1 className="movies-heading">🎬 Movies</h1>

        {/* Filters */}
        <div className="movies-filters">
          <div className="genre-btns">
            <button
              className={`genre-btn ${bollywood ? "active" : ""}`}
              onClick={() => {
                setBollywood(true);
                setGenre("");
              }}
            >
              🎭 Bollywood
            </button>
            {GENRES.map((g) => (
              <button
                key={g.id}
                className={`genre-btn ${!bollywood && genre === g.id ? "active" : ""}`}
                onClick={() => {
                  setGenre(g.id);
                  setBollywood(false);
                }}
              >
                {g.label}
              </button>
            ))}
          </div>

          <select
            className="sort-select"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setBollywood(false);
            }}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="movies-grid">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="movie-skeleton"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="movies-grid">
              {movies.map((m) => (
                <div
                  key={m.id}
                  className="movie-card"
                  onClick={() => navigate(`/movie/${m.id}`)}
                >
                  <div className="movie-poster">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                      alt={m.title}
                    />
                    <div className="movie-overlay">▶</div>
                    <span className="movie-rating">
                      ⭐ {m.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  <p className="movie-title">{m.title}</p>
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

export default Movies;
