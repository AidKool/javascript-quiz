import { BONUS_POINTS, PENALTY_POINTS, TIME_PENALTY, URL, QUESTION_TIME } from './data.js';

const questions = document.querySelector('.questions');
const timer = document.querySelector('.timer');
let currentQuestion;
let points;
let timeLeft;
let quizQuestions = [];

async function fetchQuestions(URL) {
  const response = await fetch(URL);
  const questions = await response.json();
  return questions;
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    quizQuestions = await fetchQuestions(URL);
    startQuiz();
  } catch (e) {
    console.log(e);
  }
});

async function displayQuestion() {
  const question = quizQuestions[currentQuestion];

  let html = `<h2>${question.question}</h2><ul class="choices flex-column center-content">`;

  const answers = loadAnswers(question);

  const answersHtml = answers
    .map((item, index) => {
      return `<li class="choice" data-answer="${item}">
                <p class="choice-label">${String.fromCharCode(65 + index)}</p>
                <p class="choice-text">${item}</p>
              </li>`;
    })
    .join('');

  html = html.concat(answersHtml);
  html = html.concat('</ul><p class="feedback invisible">Feedback goes here</p>');

  questions.innerHTML = html;

  getUserAnswer();
}

function loadAnswers(question) {
  let answers = [question.correct_answer];
  question.incorrect_answers.forEach((item) => {
    answers.push(item);
  });
  return _.shuffle(answers);
}

function getUserAnswer() {
  const choices = document.querySelectorAll('.choice');
  choices.forEach((choice) => {
    choice.addEventListener('click', (event) => {
      disableClicks(choices);
      processAnswer(event, choices);
      loadNext();
    });
  });
}

function processAnswer(event, choices) {
  const chosenAnswer = event.currentTarget.dataset.answer;
  const feedback = document.querySelector('.feedback');

  if (checkAnswer(chosenAnswer)) {
    points += BONUS_POINTS;
    feedback.textContent = `You got it! You won ${BONUS_POINTS} point(s)!`;
  } else {
    points -= PENALTY_POINTS;
    timeLeft -= TIME_PENALTY;
    feedback.textContent = `Wrong! You lost ${PENALTY_POINTS} point(s) and ${TIME_PENALTY} seconds!`;
  }
  localStorage.setItem('points', points);

  displayFeedback(choices, feedback);
}

function displayFeedback(choices, feedback) {
  choices.forEach((choice) => {
    colourChoice(choice);
  });
  feedback.classList.remove('invisible');
}

function checkAnswer(chosenAnswer) {
  return chosenAnswer === quizQuestions[currentQuestion].correct_answer;
}

function disableClicks(choices) {
  choices.forEach((choice) => {
    choice.style.pointerEvents = 'none';
  });
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
  let time = 1;
  let timeInterval = setInterval(function () {
    time--;
    if (time <= 0) {
      clearInterval(timeInterval);
      if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        displayQuestion();
      } else {
        window.location.href = 'end.html';
      }
    }
  }, 1000);
}

function reset() {
  currentQuestion = 0;
  points = 0;
  timeLeft = quizQuestions.length * QUESTION_TIME;
  timer.textContent = timeLeft;
  localStorage.setItem('points', points);
}

function startQuiz() {
  reset();
  displayQuestion();
  var timeInterval = setInterval(function () {
    timeLeft--;
    timer.textContent = timeLeft;
    if (timeLeft <= 0) {
      timer.textContent = '';
      clearInterval(timeInterval);
      window.location.href = 'end.html';
    }
  }, 1000);
}
