let highscores = JSON.parse(localStorage.getItem('highscores'));
const initialsInput = document.querySelector('.initials-input');
const points = localStorage.getItem('points');
const scoreText = document.querySelector('.score-text');
const saveBtn = document.querySelector('.btn-save');
const errorMessage = document.querySelector('.error-message');

const MAX_HIGHSCORES = 3;

if (!highscores) {
  highscores = [];
}

window.addEventListener('DOMContentLoaded', () => {
  scoreText.textContent = `Your score is ${points} points!`;
});

saveBtn.addEventListener('click', () => {
  if (!initialsInput.value.trim()) {
    errorMessage.classList.remove('hidden');
    return;
  }
  const score = {
    initials: initialsInput.value.trim(),
    points: points,
  };
  highscores.push(score);
  highscores = sortScores(highscores);
  highscores.splice(MAX_HIGHSCORES);
  localStorage.setItem('highscores', JSON.stringify(highscores));
  window.location.href = '../highscores.html';
});

initialsInput.addEventListener('keydown', () => {
  if (!errorMessage.classList.contains('hidden')) {
    errorMessage.classList.add('hidden');
  }
});

function sortScores(highscores) {
  return highscores.sort((score1, score2) => {
    return score2.points - score1.points;
  });
}