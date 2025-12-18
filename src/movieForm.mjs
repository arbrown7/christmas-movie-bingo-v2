import { submitMovie } from './api.mjs';

export function setupMovieForm() {
    const form = document.getElementById('ratingForm');
    const feedback = document.getElementById('ratingFeedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const movieData = {
            timestamp: getFormattedTimestamp(),
            title: clean(form.movieTitle.value),
            mainCharacterName: clean(form.mainCharacterName.value),
            mainCharacterOccupation: clean(form.mainCharacterOccupation.value),
            mainCharacterHometown: clean(form.mainCharacterHometown.value),
            mainCharacterCurrentCity: clean(form.mainCharacterCurrentCity.value),
            mainCharacterLoveInterest: clean(form.mainCharacterLoveInterest.value),
            loveInterestOccupation: clean(form.loveInterestOccupation.value),
            conflict: clean(form.conflict.value),
            howChristmasIsSaved: clean(form.howChristmasIsSaved.value),
            lessonLearned: clean(form.lessonLearned.value),
            movieRating: Number(form.movieRating.value)
        };

        try {
            await submitMovie(movieData);
            alert('Movie submitted!');
            form.reset();
        } catch (err) {
            if (err.message === 'NOT_LOGGED_IN') {
                alert('You must log in with Google to submit a movie.');
                window.location.href =
                    'https://christmas-movie-bingo-api.onrender.com/auth/google';
            } else {
                alert('Something went wrong submitting the movie.');
            }
        }

    });
}

function getFormattedTimestamp() {
    const now = new Date();

    const pad = (num) => num.toString().padStart(2, '0');

    const month = pad(now.getMonth() + 1); // Months are 0-indexed
    const day = pad(now.getDate());
    const year = now.getFullYear();

    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

function clean(value) {
    return value?.toString().trim();
}

export function displayValue() {
  const starVal = document.forms["movie-form"]["star-radio"].value;
  if (starVal == -1) {
    document.getElementById("result").innerText = "Not Chosen";
  } else {
    document.getElementById("result").innerText =
      starVal + " out of 5";
  }
}
