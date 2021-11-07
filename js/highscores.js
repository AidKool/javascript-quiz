const highscores = JSON.parse(localStorage.getItem('highscores'));
const results = document.querySelectorAll('.result');
const resultsContainer = document.querySelector('.results');

window.addEventListener('DOMContentLoaded', () => {
  const list = highscores
    .map((item, index) => {
      return `<li class="result grid">
              <p class="position">${index + 1}</p>
              <p class="initials">${item.initials}</p>
              <p class="points grid-align-end">${item.points}</p>
            </li>`;
    })
    .join('');

  resultsContainer.innerHTML = list;
});
