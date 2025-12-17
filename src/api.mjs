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
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movieData),
  });

  if (!res.ok) {
    const error = new Error('Request failed');
    error.status = res.status;
    throw error;
  }

  return res.json();
}
