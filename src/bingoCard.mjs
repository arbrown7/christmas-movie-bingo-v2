// bingoCard.mjs - Handles bingo card generation and game logic

import { fetchBingoPrompts } from './api.mjs';

const GRID_SIZE = 5;
const FREE_SPACE_INDEX = 12; // Middle square (0-indexed)
let bingoAchieved = false; // Track if the current card already had a bingo


/**
 * Initialize the bingo card
 */
export function initializeBingoCard() {
  const gridItems = getGridItems();
  bingoAchieved = false;

  // Add click handlers to all non-free-space items
  gridItems.forEach((item, index) => {
    if (index !== FREE_SPACE_INDEX) {
      item.addEventListener('click', () => toggleSquare(item));
    }
  });
  
  // Load saved state if exists
  loadBoardState();
}

/**
 * Get all grid items
 */
function getGridItems() {
  const items = [];
  for (let i = 1; i <= 25; i++) {
    const item = document.getElementById(`grid-item-${i}`);
    if (item) items.push(item);
  }
  return items;
}

/**
 * Toggle a square's marked state
 */
function toggleSquare(square) {
  square.classList.toggle('marked');
  saveBoardState();
  checkForBingo();
}

/**
 * Populate the grid with random bingo prompts
 * Rules: Exactly 1 "work" prompt, 1 "love" prompt, and 22 "repeatable" prompts
 */
export async function populateGrid() {
  try {
    const prompts = await fetchBingoPrompts();
    bingoAchieved = false;
    
    if (!prompts || prompts.length === 0) {
      console.error('No prompts received from API');
      return;
    }
    
    // Separate prompts by type
    const workPrompts = prompts.filter(p => p.type === 'work');
    const lovePrompts = prompts.filter(p => p.type === 'love');
    const repeatablePrompts = prompts.filter(p => p.type === 'repeatable');
    
    // Validate we have enough prompts
    if (workPrompts.length === 0 || lovePrompts.length === 0) {
      console.error('Missing required prompt types');
      alert('Not enough prompts in database. Need at least 1 work and 1 love prompt.');
      return;
    }
    
    if (repeatablePrompts.length < 22) {
      console.error('Not enough repeatable prompts');
      alert('Not enough repeatable prompts in database. Need at least 22.');
      return;
    }
    
    // Select prompts: 1 work, 1 love, 22 repeatable
    const selectedWork = workPrompts[Math.floor(Math.random() * workPrompts.length)];
    const selectedLove = lovePrompts[Math.floor(Math.random() * lovePrompts.length)];
    const shuffledRepeatable = shuffleArray([...repeatablePrompts]);
    const selectedRepeatable = shuffledRepeatable.slice(0, 22);
    
    // Combine all selected prompts and shuffle them together
    const allSelected = [selectedWork, selectedLove, ...selectedRepeatable];
    const finalPrompts = shuffleArray(allSelected);
    
    // Populate the grid
    const gridItems = getGridItems();
    let promptIndex = 0;
    
    gridItems.forEach((item, index) => {
      if (index !== FREE_SPACE_INDEX) {
        const promptText = finalPrompts[promptIndex].prompt;
        item.textContent = promptText;
        item.classList.remove('marked');
        promptIndex++;
      }
    });
    
    saveBoardState();
  } catch (error) {
    console.error('Error populating grid:', error);
    alert('Failed to load bingo prompts. Please try again.');
  }
}

/**
 * Clear all marked squares
 */
export function clearBoard() {
  const gridItems = getGridItems();
  gridItems.forEach((item, index) => {
    if (index !== FREE_SPACE_INDEX) {
      item.classList.remove('marked');
    }
  });
  saveBoardState();
  closeBingoAlert();
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function checkForBingo() {
  const gridItems = getGridItems();
  const marked = gridItems.map(item => item.classList.contains('marked'));
  
  // Check rows
  for (let row = 0; row < GRID_SIZE; row++) {
    if (checkLine(marked, row * GRID_SIZE, 1, GRID_SIZE)) {
      showBingoAlert();
      return;
    }
  }
  
  // Check columns
  for (let col = 0; col < GRID_SIZE; col++) {
    if (checkLine(marked, col, GRID_SIZE, GRID_SIZE)) {
      showBingoAlert();
      return;
    }
  }
  
  // Check diagonal (top-left to bottom-right)
  if (checkLine(marked, 0, GRID_SIZE + 1, GRID_SIZE)) {
    showBingoAlert();
    return;
  }
  
  // Check diagonal (top-right to bottom-left)
  if (checkLine(marked, GRID_SIZE - 1, GRID_SIZE - 1, GRID_SIZE)) {
    showBingoAlert();
    return;
  }
}

/**
 * Check if a line has all squares marked
 */
function checkLine(marked, start, step, count) {
  for (let i = 0; i < count; i++) {
    if (!marked[start + i * step]) {
      return false;
    }
  }
  return true;
}

/**
 * Show bingo alert
 */
function showBingoAlert() {
  if (bingoAchieved) return; // already shown, do nothing

  const alert = document.getElementById('bingoAlert');
  if (alert) {
    alert.classList.add('show');
    bingoAchieved = true; // mark that bingo has been achieved
  }
}

/**
 * Close bingo alert
 */
export function closeBingoAlert() {
  const alert = document.getElementById('bingoAlert');
  if (alert) {
    alert.classList.remove('show');
  }
}

/**
 * Save board state to localStorage
 */
function saveBoardState() {
  const gridItems = getGridItems();
  const state = {
    prompts: [],
    marked: []
  };
  
  gridItems.forEach((item, index) => {
    if (index !== FREE_SPACE_INDEX) {
      state.prompts.push(item.textContent);
      state.marked.push(item.classList.contains('marked'));
    } else {
      state.prompts.push('FREE_SPACE');
      state.marked.push(true);
    }
  });
  
  localStorage.setItem('bingoCardState', JSON.stringify(state));
}

/**
 * Load board state from localStorage
 */
function loadBoardState() {
  const savedState = localStorage.getItem('bingoCardState');
  if (!savedState) return;
  
  try {
    const state = JSON.parse(savedState);
    const gridItems = getGridItems();
    
    gridItems.forEach((item, index) => {
      if (index !== FREE_SPACE_INDEX) {
        item.textContent = state.prompts[index];
        if (state.marked[index]) {
          item.classList.add('marked');
        }
      }
    });
  } catch (error) {
    console.error('Error loading board state:', error);
  }
}
