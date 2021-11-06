const URL = '../data/questions.json';

const questions = document.querySelector('.questions');
let questionsLoaded = [];
let currentQuestion = 0;
let points = 0;

const BONUS_POINTS = 2;
const PENALTY_POINTS = 1;

fetch(URL)
  .then(function (resp) {
    return resp.json();
  })
  .then(function (data) {
    questionsLoaded = data;
    init();
  });

function init() {
  displayQuestion();

  const choices = document.querySelectorAll('.choice');
  choices.forEach((choice) => {
    choice.addEventListener('click', (event) => {
      processAnswer(event, choices);
    });
  });
}

function displayQuestion() {
  const options = ['A', 'B', 'C', 'D'];
  const question = questionsLoaded[currentQuestion];

  let answers = [question.correct_answer];
  question.incorrect_answers.forEach((item) => {
    answers.push(item);
  });
  answers = _.shuffle(answers);

  let html = `<h2>${question.question}</h2><ul class="choices flex-column center-content">`;

  answers = answers
    .map((item, index) => {
      return `<li class="choice" data-answer="${item}">
                <p class="choice-label">${options[index]}</p>
                <p class="choice-text">${item}</p>
              </li>`;
    })
    .join('');

  html = html.concat(answers);
  html = html.concat('</ul><p class="feedback hidden">Feedback goes here</p>');

  questions.innerHTML = html;
}

function processAnswer(event, choices) {
  const chosenAnswer = event.currentTarget.dataset.answer;

  disableClicks(choices);

  const feedback = document.querySelector('.feedback');

  displayFeedback(chosenAnswer, feedback);
}

function checkAnswer(chosenAnswer) {
  return chosenAnswer === questionsLoaded[currentQuestion].correct_answer;
}

function disableClicks(choices) {
  choices.forEach((choice) => {
    choice.style.pointerEvents = 'none';
  });
}

function displayFeedback(chosenAnswer, feedback) {
  if (checkAnswer(chosenAnswer)) {
    points += BONUS_POINTS;
    feedback.textContent = `You got it! You won ${BONUS_POINTS} point(s)!`;
  } else {
    points -= PENALTY_POINTS;
    feedback.textContent = `Wrong! You lost ${PENALTY_POINTS} point(s)!`;
  }
  feedback.classList.remove('hidden');
}
