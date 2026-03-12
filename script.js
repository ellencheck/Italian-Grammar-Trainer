let exercises = [];
let currentExercise = 0;
let correctCount = 0;
let wrongCount = 0;

// Начало темы
function start(topic) {
  fetch("exercises/" + topic + ".json")
    .then(response => {
      if (!response.ok) throw new Error("Файл не найден: " + topic);
      return response.json();
    })
    .then(data => {
      exercises = data.exercises;
      currentExercise = 0;
      correctCount = 0;
      wrongCount = 0;

      document.getElementById("good").textContent = correctCount;
      document.getElementById("bad").textContent = wrongCount;

      showExercise();
    })
    .catch(error => {
      console.error(error);
      alert("Ошибка загрузки темы: " + topic);
    });
}

// Показ упражнения
function showExercise() {

  const questionDiv = document.getElementById("question");
  const answersDiv = document.getElementById("answers");
  const nextBtn = document.getElementById("nextBtn");

  if (currentExercise >= exercises.length) {
    questionDiv.textContent = "Тема завершена!";
    answersDiv.innerHTML = "";
    nextBtn.style.display = "none";
    return;
  }

  const ex = exercises[currentExercise];
  questionDiv.textContent = ex.sentence;

  answersDiv.innerHTML = "";

  ex.options.forEach(option => {

    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("answer");

    btn.onclick = () => checkAnswer(option, btn);

    answersDiv.appendChild(btn);

  });

  // показываем кнопку "Следующий"
  nextBtn.style.display = "none";
}

// Проверка ответа
function checkAnswer(answer, clickedBtn) {

  const ex = exercises[currentExercise];
  const correct = ex.answer;

  const buttons = document.getElementById("answers").children;

  for (let btn of buttons) {

    btn.disabled = true;

    if (btn.textContent === correct) {
      btn.classList.add("correct");
    }

    else if (btn === clickedBtn && answer !== correct) {
      btn.classList.add("wrong");
    }

  }

  if (answer === correct) correctCount++;
  else wrongCount++;

  document.getElementById("good").textContent = correctCount;
  document.getElementById("bad").textContent = wrongCount;

  // показываем кнопку перехода
  document.getElementById("nextBtn").style.display = "inline-block";
}

// Кнопка "Следующий"
function generate() {

  currentExercise++;

  showExercise();

}
