const API_BASE = 'https://christmas-movie-bingo-api.onrender.com/api';

export async function fetchBingoPrompts() {
  const res = await fetch(`${API_BASE}/bingo`, {
    credentials: 'include'
  });
  return res.json();
}

export async function fetchMovies() {
  const res = await fetch(`${API_BASE}/movies`, {
    credentials: 'include'
  });
  return res.json();
}

export async function submitMovie(movieData) {
  const res = await fetch(`${API_BASE}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(movieData),
  });
  return res.json();
}
