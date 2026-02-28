import React, { useEffect, useState, useCallback } from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import play_icon from '../../assets/play_icon.png'
import info_icon from '../../assets/info_icon.png'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?language=en-US`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        const filtered = r.results?.filter((m) => m.backdrop_path && m.overview).slice(0, 8)
        setMovies(filtered || [])
      })
      .catch(console.error)
  }, [])

  const changeTo = useCallback((index) => {
    setFade(false)
    setTimeout(() => {
      setCurrentIndex(index)
      setFade(true)
    }, 400)
  }, [])

  useEffect(() => {
    if (movies.length === 0) return
    const timer = setInterval(() => {
      changeTo((prev) => (prev + 1) % movies.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [movies, changeTo])

  const heroMovie = movies[currentIndex]

  return (
    <div className='home'>
      <Navbar />

      <div className='hero'>
        {/* Dynamic background */}
        <div
          className={`banner-bg ${fade ? 'fade-in' : 'fade-out'}`}
          style={{
            backgroundImage: heroMovie?.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`
              : 'none',
          }}
        />
        <div className='hero-overlay' />
        <div className='hero-bottom-fade' />

        {/* Arrows */}
        <button
          className='hero-arrow hero-arrow-left'
          onClick={() => changeTo((currentIndex - 1 + movies.length) % movies.length)}
        >‹</button>
        <button
          className='hero-arrow hero-arrow-right'
          onClick={() => changeTo((currentIndex + 1) % movies.length)}
        >›</button>

        {heroMovie && (
          <div className={`hero-caption ${fade ? 'fade-in' : 'fade-out'}`}>
            <div className='hero-meta'>
              <span className='hero-rating'>⭐ {heroMovie.vote_average > 0 ? heroMovie.vote_average.toFixed(1) : 'New'}</span>
              <span className='hero-year'>{heroMovie.release_date?.slice(0, 4)}</span>
              <span className='hero-badge'>HD</span>
            </div>
            <h1 className='hero-title'>{heroMovie.title}</h1>
            <p className='hero-overview'>
              {heroMovie.overview?.length > 160
                ? heroMovie.overview.slice(0, 160) + '...'
                : heroMovie.overview}
            </p>
            <div className='hero-btns'>
              <button className='btn' onClick={() => navigate(`/player/${heroMovie.id}`)}>
                <img src={play_icon} alt='play' />Play
              </button>
              <button className='btn dark-btn' onClick={() => navigate(`/movie/${heroMovie.id}`)}>
                <img src={info_icon} alt='info' />More Info
              </button>
            </div>
          </div>
        )}

        {/* Dot Indicators */}
        {movies.length > 0 && (
          <div className='hero-dots'>
            {movies.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${i === currentIndex ? 'active' : ''}`}
                onClick={() => changeTo(i)}
              />
            ))}
          </div>
        )}
      </div>

      <div className='more-cards'>
        <TitleCards title={'Popular on Netflix'} category={'now_playing'} />
        <TitleCards title={'Blockbuster Movies'} category={'top_rated'} />
        <TitleCards title={'Hindi Movies'} category={'hindi'} />
        <TitleCards title={'Only on Netflix'} category={'popular'} />
        <TitleCards title={'Upcoming'} category={'upcoming'} />
        <TitleCards title={'Top Picks for you'} category={'now_playing'} />
      </div>

      <Footer />
    </div>
  )
}

export default Home