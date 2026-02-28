# 🎬 Netflix Clone

A full-featured Netflix Clone built with **React.js** and **Firebase**, featuring movie trail data from TMDB API, Google Authentication, Watchlist, Notifications, and much more!

---

## ✨ Features

### 🔐 Authentication

- Email & Password Sign Up / Sign In
- **Google Sign-In** (One click login)
- Persistent login session (stays logged in after refresh)
- Secure logout

### 🏠 Home Page

- **Dynamic Hero Banner** — Auto-rotating trending movies with fade animation
- Hero navigation with arrows and dot indicators
- Movie rating, year, and HD badge on banner
- **Play** and **More Info** buttons
- Multiple movie carousels (Popular, Blockbuster, Hindi, Upcoming, etc.)

### 🎬 Movies Page

- Browse all movies with **genre filters** (Action, Comedy, Horror, Romance, Sci-Fi, Drama, Animation, Thriller)
- **Bollywood** section filter
- Sort by Most Popular, Top Rated, Latest, Box Office
- Infinite **Load More** pagination

### 📺 TV Shows Page

- Browse TV Shows with tabs — Trending, Top Rated, Popular, Airing Today, On The Air
- Infinite **Load More** pagination

### 🔥 New & Popular Page

- Weekly trending Movies & TV Shows
- **#Rank numbers** displayed on cards
- Switch between Movies and TV Shows

### 🎥 Movie Detail Page

- Full movie info — Rating, Year, Runtime, Genres
- **Play Trailer** in modal popup (YouTube)
- **Top Cast** section with actor photos
- **More Like This** similar movies section
- Add/Remove from Watchlist button

### ❤️ Watchlist (My List)

- Save movies to watch later
- Real-time sync with Firebase Firestore
- Remove movies from watchlist
- Sorted by most recently added

### 🔔 Notifications

- **Real-time bell notifications** when movie is added to watchlist
- Notification badge count on bell icon
- Delete individual notifications
- Clear all notifications

### 🔍 Search

- Live search with debounce (no lag)
- Search results with movie poster, year, and rating
- Context-aware search (Movies on Movies page, TV on TV Shows page)
- Click result to go to detail page

### ⚙️ Settings Page

- Update display name
- Change profile avatar
- Account information display

### 🎨 UI/UX

- Fully **Responsive** — Mobile, Tablet, Desktop
- **3 equal cards** per row on mobile screens
- Smooth animations and transitions
- Netflix-style dark theme
- Scroll to top button
- Active navigation highlighting
- Mobile hamburger menu
- Scroll-aware navbar (transparent → dark)

---

## 🛠️ Technologies Used

### Frontend

| Technology           | Purpose                   |
| -------------------- | ------------------------- |
| **React.js**         | Frontend framework        |
| **React Router DOM** | Page routing & navigation |
| **Vite**             | Fast build tool           |
| **CSS3**             | Styling & animations      |

### Backend & Database

| Technology                  | Purpose                                |
| --------------------------- | -------------------------------------- |
| **Firebase Authentication** | User login & signup                    |
| **Cloud Firestore**         | Database for watchlist & notifications |
| **Firebase Persistence**    | Keep user logged in                    |

### APIs

| API               | Purpose                   |
| ----------------- | ------------------------- |
| **TMDB API**      | Real movie & TV show data |
| **YouTube Embed** | Movie trailers            |

### Libraries

| Library            | Purpose             |
| ------------------ | ------------------- |
| **React Toastify** | Toast notifications |
| **React Router**   | Client-side routing |

### Deployment

| Tool       | Purpose              |
| ---------- | -------------------- |
| **Vercel** | Hosting & deployment |

---

## 📁 Project Structure

```
netflix-clone/
├── public/
│   └── background_banner.jpg
├── src/
│   ├── assets/          # Images, icons
│   ├── components/
│   │   ├── Navbar/      # Navigation bar
│   │   ├── Footer/      # Footer
│   │   ├── TitleCards/  # Movie carousel cards
│   │   ├── FAQ/         # FAQ section
│   │   ├── LoginF/      # Login footer
│   │   └── ReasonsToJoin/ # Features section
│   ├── pages/
│   │   ├── Home/        # Home page
│   │   ├── Login/       # Login & Signup
│   │   ├── Movies/      # Movies browse page
│   │   ├── TVShows/     # TV Shows page
│   │   ├── NewPopular/  # New & Popular page
│   │   ├── MovieDetail/ # Movie detail page
│   │   ├── Watchlist/   # My List page
│   │   ├── Player/      # Video player page
│   │   ├── Settings/    # User settings
│   │   └── NotFound/    # 404 page
│   ├── firebase.js      # Firebase config & functions
│   ├── App.jsx          # Main app with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── vercel.json          # Vercel deployment config
├── package.json
└── vite.config.js
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/netflix-clone.git
cd netflix-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

```env
VITE_TMDB_TOKEN=your_tmdb_token_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Open in Browser

```
http://localhost:5173
```

---

---

## 🌐 Deployment (Vercel)

### vercel.json (required for React Router)

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 👩‍💻 Developer

Made with ❤️

---

## 📄 License

This project is for educational purposes only. Netflix name and logo are trademarks of Netflix, Inc.

---
