const highscores = JSON.parse(localStorage.getItem('highscores'));
const results = document.querySelectorAll('.result');
const resultsTable = document.querySelector('.results');

let table = `<table class="results">
               <tr class="result">
                 <th class="position table-text-center">Pos</th>
                 <th class="initials table-text-center">Initials</th>
                 <th class="points table-text-center">Score</th>
               </tr>`;

window.addEventListener('DOMContentLoaded', () => {
  const tableElements = highscores
    .map((item, index) => {
      return `<tr class="result">
                  <td class="position table-text-center">${index + 1}</td>
                  <td class="initials table-text-center">${item.initials}</td>
                  <td class="points table-text-center">${item.points}</td>
                </tr>`;
    })
    .join('');

  table = table.concat(tableElements);
  table = table.concat('</table>');
  resultsTable.innerHTML = table;
});