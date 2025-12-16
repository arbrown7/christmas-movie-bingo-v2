const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');

loginButton.addEventListener('click', () => {
  window.location.href = 'https://christmas-movie-bingo-api.onrender.com/auth/google';
});

logoutButton.addEventListener('click', async () => {
  await fetch('https://christmas-movie-bingo-api.onrender.com/logout', { credentials: 'include' });
  window.location.reload();
});

async function checkAuth() {
  try {
    const res = await fetch('https://christmas-movie-bingo-api.onrender.com/api/user', {
      credentials: 'include'
    });
    const data = await res.json();

    if (data.loggedIn) {
      loginButton.style.display = 'none';
      logoutButton.style.display = 'inline-block';
      document.querySelector('.bingo-container').style.display = 'flex';
    } else {
      loginButton.style.display = 'inline-block';
      logoutButton.style.display = 'none';
      document.querySelector('.bingo-container').style.display = 'none';
    }
  } catch (err) {
    console.error(err);
  }
}

checkAuth();
