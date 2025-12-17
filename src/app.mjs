import './auth.js';
import { initializeBingoCard, populateGrid, clearBoard } from './bingoCard.mjs';
import { setupMovieForm } from './movieForm.mjs';

function init() {
    initializeBingoCard();
    populateGrid();

    document.getElementById('clearBoardButton').addEventListener('click', clearBoard);
    setupMovieForm();
}

const newPromptsButton = document.getElementById('newPromptsButton');

if (newPromptsButton) {
  newPromptsButton.addEventListener('click', async () => {
    try {
      await populateGrid();   // fetch new prompts and update grid
    } catch (error) {
      console.error('Failed to get new prompts:', error);
    }
  });
}

import { closeBingoAlert } from './bingoCard.mjs';
import { displayValue } from './movieForm.mjs';

const bingoButton = document.querySelector('#bingoAlert button');
bingoButton.addEventListener('click', closeBingoAlert);

document.addEventListener("DOMContentLoaded", () => {
  init();
  displayValue();
  document.forms["movie-form"]["star-radio"].forEach((star) => {
    star.addEventListener("change", () => {
      displayValue();
    });
  });
});
