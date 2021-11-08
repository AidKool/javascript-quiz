import { MAX_HIGHSCORES } from './data.js';

let highscores = JSON.parse(localStorage.getItem('highscores'));
const resultsTable = document.querySelector('.results');

window.addEventListener('DOMContentLoaded', () => {
  if (!highscores) {
    highscores = [];
  }
  fillScores();

  resultsTable.innerHTML = `
    <table class="results">
      <tr class="result">
        <th class="position table-text-center">Pos</th>
        <th class="initials table-text-center">Initials</th>
        <th class="points table-text-center">Score</th>
      </tr>
      ${highscores
        .map((item, index) => {
          return `<tr class="result">
                  <td class="position table-text-center">${index + 1}</td>
                  <td class="initials table-text-center">${item.initials}</td>
                  <td class="points table-text-center">${item.points}</td>
                </tr>`;
        })
        .join('')}
    </table>
    `;
});

function fillScores() {
  for (let i = highscores.length; i < MAX_HIGHSCORES; i++) {
    const score = {
      initials: '-',
      points: 0,
    };
    highscores.push(score);
  }
}
