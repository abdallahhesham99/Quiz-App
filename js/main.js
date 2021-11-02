//*==============================Variables Declaration==============================
let questionArea = document.querySelector(".question-area");
let questionTitle = document.querySelector(".question-area .question-title");
let answersArea = document.querySelector(".answers-area");

let countSpan = document.querySelector(".quiz-info .count span");
let bulletsUL = document.querySelector(".quiz-footer .bullets ul");

let submitButton = document.querySelector(".submit-button");

let countDownSpan = document.querySelector(".countdown span");

let resultsView = document.querySelector(".results");
// ===================================================================================
//*==============================Set options==============================

//default value variable
let currentIndex = 0;
let rightAnswers = 0;

let countDownInterval;

// =================================================================================
//*==============================Functions Declaration==============================
//Function to get data from JSON
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  //open file
  myRequest.open("GET", "html_questions.json");
  //send to server
  myRequest.send();
  //on ready state change check if readystate == 4 & status == 200
  myRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //return respone text as JSON and set it in variable
      let myQuestions = JSON.parse(this.responseText);

      //get count of questions
      let QCount = myQuestions.length;

      //Display questions in HTML
      displayQuestionData(myQuestions[currentIndex], QCount);

      // countDown(3, QCount);

      //makeBullets depends on questions count function call
      makeBullets(QCount);

      //?submit button
      submitButton.addEventListener("click", () => {
        //get right answer
        let rightAnswer = myQuestions[currentIndex].right_answer;

        //function call
        checkAnswer(rightAnswer, QCount);

        //increade current index to get the next question
        currentIndex++;

        //remove previous questions and answers
        questionTitle.innerHTML = "";
        answersArea.innerHTML = "";

        displayQuestionData(myQuestions[currentIndex], QCount);

        handleBullets();

        clearInterval(countDownInterval);
        // countDown(3, QCount);

        showResults(QCount);
      });
    }
  };
}
//Function call
getQuestions();
//! ===============================================================

//function to display question data  in HTML depends on object(question in json)
function displayQuestionData(obj, count) {
  if (currentIndex < count) {
    //set object.title(title of question) in html as text content
    questionTitle.textContent = obj.title;

    //empty var to fill the answers in it
    let answersContainer = ``;

    //looping depends on answers count
    for (let i = 1; i <= 4; i++) {
      answersContainer += `
        <div class="answer">
          <input type="radio" name="answers" id="answer_${i}" data-answer="${
        obj[`answer_${i}`]
      }">
          <label for="answer_${i}">${obj[`answer_${i}`]}</label>
        </div><!-- ./answer -->`;
    }
    answersArea.innerHTML = answersContainer;
  }
}
//! ===============================================================

//Function to make bullets depends on question count
function makeBullets(num) {
  for (let i = 0; i < num; i++) {
    countSpan.innerHTML = num;

    //Create new li element
    let bulletItem = document.createElement("li");

    //set class name for new li
    bulletItem.className = "bullet";

    //append new li in its father
    bulletsUL.appendChild(bulletItem);

    //if new li is first set class active
    if (i === 0) {
      bulletItem.className = "bullet active";
    }
  }
}

//Handle bullets to set active class on next question
function handleBullets() {
  let bulletsLI = document.querySelectorAll(".bullets ul li.bullet");

  for (let i = 0; i < bulletsLI.length; i++) {
    if (currentIndex === i) {
      bulletsLI[i].className = "bullet active";
    }
  }
  //Another code
  // let arrayFromBullets = Array.from(bulletsLI);
  // console.log(arrayFromBullets);
  // arrayFromBullets.forEach((bullet, index) => {
  //   if (currentIndex === index) {
  //     bullet.className = "bullet active";
  //   }
  // });
}
//! ===============================================================

function checkAnswer(rAnswer, count) {
  let radioButtons = document.querySelectorAll('input[type="radio"]');
  let choosenAnswer;

  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      choosenAnswer = radioButtons[i].dataset.answer;
    }
  }
  //check if choosenAnswer === rightAnswer => increase the rightAnswers
  if (rAnswer === choosenAnswer) {
    rightAnswers++;
  }
}
//! ===============================================================

function showResults(count) {
  let resultTitle;

  if (currentIndex === count) {
    resultsView.style.display = "block";
    submitButton.remove();
    answersArea.remove();
    questionArea.remove();
  }
  if (rightAnswers > count / 2 && count > rightAnswers) {
    resultTitle = `<span class="good">Good : </span>you answered ${rightAnswers} from ${count}`;
  } else if (rightAnswers === count) {
    resultTitle = `<span class="perfect">Perfect : </span>you answered ${rightAnswers} from ${count}`;
  } else {
    resultTitle = `<span class="bad">Bad : </span>you answered ${rightAnswers} from ${count}`;
  }
  resultsView.innerHTML = resultTitle;
}
//!==========================================================================

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownSpan.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);

        //? red bullet
        submitButton.click();
      }
    }, 1000);
  }
}
