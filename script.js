let question = document.getElementById("question");
let option1 = document.getElementById("option1");
let option2 = document.getElementById("option2");
let option3 = document.getElementById("option3");
let option4 = document.getElementById("option4");
let quizTimer = document.querySelector(".quiz-timer");
let timer = document.getElementById("timer");
let QuestionList = document.querySelector(".quiz-questions-left");
let progress = document.querySelector(".quiz-progress");
let options = document.querySelectorAll(".quiz-option");
let quizApp = document.querySelector(".quiz-app");
let quizStart = document.querySelector(".quiz-start");

let quizTitle = document.querySelector(".quiz-title");
let EndQuizContainer = document.createElement("div");
let quizContainer = document.querySelector(".quiz-question-container");
//start page here

function startGame() {
  quizStart.style.display = "flex";
  quizApp.style.display = "none";
  startPage();
}

function startPage() {
  let startBody = document.createElement("div");
  startBody.classList.add("quiz-start-header");

  let appTitle = document.createElement("h1");
  appTitle.innerText = "Quiz App";

  let startDetails = document.createElement("div");
  startDetails.classList.add("quiz-start-details");

  let level = document.createElement("select");
  level.name = "difficulty";
  let Option1 = document.createElement("option");
  Option1.innerText = "Easy";
  let Option2 = document.createElement("option");
  Option2.innerText = "Medium";
  let Option3 = document.createElement("option");
  Option3.innerText = "Hard";
  let Option4 = document.createElement("option");
  Option4.innerText = "Extreme";

  let numberOfQuestion = document.createElement("input");
  numberOfQuestion.placeholder = "Number of Question";
  numberOfQuestion.classList.add("quiz-question-numbers");

  let startButton = document.createElement("img");
  startButton.src = "./play.svg";

  quizStart.append(startBody);

  startBody.append(appTitle);
  startBody.append(startDetails);
  startBody.append(startButton);
  startDetails.append(level);
  startDetails.append(numberOfQuestion);

  level.append(Option1);
  level.append(Option2);
  level.append(Option3);
  level.append(Option4);

  function handlePlayClick() {
    quizStart.style.display = "none";
    quizApp.style.display = "flex";
    EndQuizContainer.style.display = "none";
    main();
  }

  startButton.addEventListener("click", handlePlayClick);
}
//start page ends

let currentPage = 0;
let timeLeft = 5;
let timerId;
let totalQuestion = 10;
let randomIndexData = [];

let correct = 0;
let incorrect = 0;
let notAnswered = 0;

async function data() {
  const response = await fetch("./data.json");
  const data = await response.json();
  return data;
}
function randomIndex(n) {
  const index = [];
  while (index.length < totalQuestion) {
    let randomIdx = Math.floor(Math.random() * n);
    if (!index.includes(randomIdx)) {
      index.push(randomIdx);
    }
  }
  return index;
}
async function main() {
  const jsonData = await data();
  console.log(jsonData.length);
  randomIndexData = randomIndex(jsonData.length);

  function displayQuestions() {
    if (currentPage >= totalQuestion) {
      clearInterval(timerId);
      quizContainer.innerHTML = "";
      quizTimer.style.display = "none";
      quizTitle.innerText = "Quiz Result";
      quizEnd();
      return;
    }
    console.log(randomIndexData);

    options.forEach((opt) => {
      opt.disabled = false;
      opt.classList.remove("correct", "incorrect");
    });

    progress.style.width = `${((currentPage + 1) / totalQuestion) * 100}%`;

    const questionIdx = randomIndexData[currentPage];
    question.innerText = jsonData[questionIdx].question;
    option1.innerText = jsonData[questionIdx].options[0];
    option2.innerText = jsonData[questionIdx].options[1];
    option3.innerText = jsonData[questionIdx].options[2];
    option4.innerText = jsonData[questionIdx].options[3];

    timeLeft = 5;
    timer.innerText = timeLeft;
    QuestionList.innerText = `${currentPage + 1} of ${totalQuestion} Questions`;
  }

  console.log(currentPage);
  function handleOptionClick(event) {
    const selectedOption = event.target;
    const questionIdx = randomIndexData[currentPage];

    if (selectedOption.innerText === jsonData[questionIdx].correctAnswer) {
      selectedOption.classList.add("correct");
      correct++;
    } else {
      selectedOption.classList.add("incorrect");
      incorrect++;
    }

    options.forEach((opt) => (opt.disabled = true));

    notAnswered = totalQuestion - (correct + incorrect);
  }

  options.forEach((opt) => {
    opt.addEventListener("click", handleOptionClick);
  });

  function countdown() {
    if (timeLeft == -1) {
      currentPage++;
      displayQuestions();
    } else {
      timer.innerText = timeLeft;
      timeLeft--;
    }
  }
  displayQuestions();
  timerId = setInterval(countdown, 1000);

  console.log("Answered: " + correct);
  console.log("Wrong: " + incorrect);
  console.log("notAnswered: " + notAnswered);
}

startGame();
//end page starts here
async function quizEnd() {
  const jsonData = await data();
  console.log(jsonData);

  // Clear previous content in EndQuizContainer
  EndQuizContainer.innerHTML = "";
  EndQuizContainer.style.display = "flex";
  EndQuizContainer.style.flexDirection = "column";
  EndQuizContainer.style.gap = "20px";
  EndQuizContainer.style.maxWidth = "90vw"; // Ensures it doesn't exceed viewport width
  EndQuizContainer.style.margin = "0 auto"; // Centers the container horizontally
  EndQuizContainer.style.overflowY = "auto"; // Enables scrolling if content overflows vertically
  EndQuizContainer.style.width = "100%";
  EndQuizContainer.style.padding = "20px";
  EndQuizContainer.style.boxSizing = "border-box";

  randomIndexData.forEach((value, index) => {
    // Create container for question and answer
    let questionBlock = document.createElement("div");
    questionBlock.style.padding = "10px";
    questionBlock.style.border = "1px solid #ccc";
    questionBlock.style.borderRadius = "8px";

    // Display question
    let questionContainer = document.createElement("h2");
    questionContainer.innerText = `${index + 1}. ${jsonData[value].question}`;

    // Display the correct answer
    let correctAnswerContainer = document.createElement("p");
    correctAnswerContainer.innerText = `Correct Answer: ${jsonData[value].correctAnswer}`;
    correctAnswerContainer.style.color = "green";
    correctAnswerContainer.style.padding = "30px 10px 30px 10px";

    // Append to question block
    questionBlock.append(questionContainer);
    questionBlock.append(correctAnswerContainer);

    // Append question block to EndQuizContainer
    EndQuizContainer.append(questionBlock);
  });

  // Append EndQuizContainer to the main quiz container if not done already
  quizContainer.append(EndQuizContainer);
}

//end page ends here
