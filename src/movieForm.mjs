import { submitMovie } from './api.mjs';

export function setupMovieForm() {
    const form = document.getElementById('ratingForm');
    const feedback = document.getElementById('ratingFeedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const movieData = {
            timestamp: getFormattedTimestamp(),
            title: form.movieTitle.value,
            mainCharacterName: form.mainCharacterName.value,
            mainCharacterOccupation: form.mainCharacterOccupation.value,
            mainCharacterHometown: form.mainCharacterHometown.value,
            mainCharacterCurrentCity: form.mainCharacterCurrentCity.value,
            mainCharacterLoveInterest: form.mainCharacterLoveInterest.value,
            loveInterestOccupation: form.loveInterestOccupation.value,
            conflict: form.conflict.value,
            howChristmasIsSaved: form.howChristmasIsSaved.value,
            lessonLearned: form.lessonLearned.value,
            movieRating: parseInt(form.movieRating.value)
        };

        try {
            await submitMovie(movieData);
            feedback.textContent = 'Movie logged!';
            form.reset();
        } catch (err) {
            feedback.textContent = 'Failed to log movie.';
            console.error(err);
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
