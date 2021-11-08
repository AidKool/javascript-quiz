const URL = 'data/questions.json';

const questions = document.querySelector('.questions');
const timer = document.querySelector('.timer');
const secondsPerQuestion = 10;
let currentQuestion = 0;
let points = 0;
let timeLeft;
let questionsLoaded = [];

const BONUS_POINTS = 2;
const PENALTY_POINTS = 1;
const TIME_PENALTY = 5;

async function fetchQuestions(URL) {
  const response = await fetch(URL);
  const questions = await response.json();
  return questions;
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    questionsLoaded = await fetchQuestions(URL);
    reset();
    startQuiz();
  } catch (e) {
    console.log(e);
  }
});

function displayQuestion() {
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
                <p class="choice-label">${String.fromCharCode(65 + index)}</p>
                <p class="choice-text">${item}</p>
              </li>`;
    })
    .join('');

  html = html.concat(answers);
  html = html.concat('</ul><p class="feedback invisible">Feedback goes here</p>');

  questions.innerHTML = html;

  const choices = document.querySelectorAll('.choice');
  choices.forEach((choice) => {
    choice.addEventListener('click', (event) => {
      processAnswer(event, choices);
      let time = 1;
      let timeInterval = setInterval(function () {
        time--;
        if (time === 0) {
          clearInterval(timeInterval);
          loadNext();
        }
      }, 1000);
    });
  });
}

function processAnswer(event, choices) {
  const chosenAnswer = event.currentTarget.dataset.answer;
  disableClicks(choices);
  const feedback = document.querySelector('.feedback');
  displayFeedback(choices, chosenAnswer, feedback);
}

function checkAnswer(chosenAnswer) {
  return chosenAnswer === questionsLoaded[currentQuestion].correct_answer;
}

function disableClicks(choices) {
  choices.forEach((choice) => {
    choice.style.pointerEvents = 'none';
  });
}

function displayFeedback(choices, chosenAnswer, feedback) {
  choices.forEach((choice) => {
    colourChoice(choice);
  });
  if (checkAnswer(chosenAnswer)) {
    points += BONUS_POINTS;
    feedback.textContent = `You got it! You won ${BONUS_POINTS} point(s)!`;
  } else {
    points -= PENALTY_POINTS;
    timeLeft -= TIME_PENALTY;
    feedback.textContent = `Wrong! You lost ${PENALTY_POINTS} point(s)!`;
  }
  localStorage.setItem('points', points);
  feedback.classList.remove('invisible');
}

function colourChoice(choice) {
  const answer = choice.dataset.answer;
  const text = choice.querySelector('.choice-text');
  if (checkAnswer(answer)) {
    text.classList.add('right-answer');
  } else {
    text.classList.add('wrong-answer');
  }
}

function loadNext() {
  if (currentQuestion < questionsLoaded.length - 1) {
    currentQuestion++;
    displayQuestion();
  } else {
    window.location.href = 'end.html';
  }
}

function reset() {
  currentQuestion = 0;
  points = 0;
  timeLeft = questionsLoaded.length * secondsPerQuestion;
  timer.textContent = timeLeft;
  localStorage.setItem('points', points);
}

function startQuiz() {
  displayQuestion();
  var timeInterval = setInterval(function () {
    timeLeft--;
    timer.textContent = timeLeft;
    if (timeLeft === 0) {
      timer.textContent = '';
      clearInterval(timeInterval);
      window.location.href = 'end.html';
    }
  }, 1000);
}
