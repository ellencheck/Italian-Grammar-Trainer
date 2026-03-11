let exercises = [];
let currentExercise = 0;
let correctCount = 0;
let wrongCount = 0;

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
      showExercise();
    })
    .catch(error => {
      console.error(error);
      alert("Ошибка загрузки темы: " + topic);
    });
}

function showExercise() {
  if (currentExercise >= exercises.length) {
    document.getElementById("question").innerHTML = "Тема завершена!";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("result").innerHTML = `✔ Правильно: ${correctCount} | ✘ Неправильно: ${wrongCount}`;
    return;
  }

  const ex = exercises[currentExercise];
  const questionDiv = document.getElementById("question");
  const answersDiv = document.getElementById("answers");
  const resultDiv = document.getElementById("result");

  // Показываем вопрос
  questionDiv.textContent = ex.sentence;

  // Озвучка
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(ex.sentence);
    utter.lang = "it-IT"; // итальянский
    window.speechSynthesis.speak(utter);
  }

  // Очистка ответов
  answersDiv.innerHTML = "";

  // Создаём кнопки для вариантов
  ex.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("answer"); // теперь оформление берётся из CSS

    button.onclick = function () {
      checkAnswer(option, button);
    };

    answersDiv.appendChild(button);
  });

  // Обновляем счёт
  resultDiv.textContent = `✔ Правильно: ${correctCount} | ✘ Неправильно: ${wrongCount}`;
}

function checkAnswer(answer, buttonClicked) {
  const ex = exercises[currentExercise];
  const correct = ex.answer;
  const buttons = document.getElementById("answers").children;

  // Подсвечиваем кнопки через CSS классы
  for (let btn of buttons) {
    btn.disabled = true; // нельзя нажимать повторно

    if (btn.textContent === correct) {
      btn.classList.add("correct");
      btn.classList.remove("wrong");
    } else if (btn === buttonClicked && answer !== correct) {
      btn.classList.add("wrong");
      btn.classList.remove("correct");
    } else {
      btn.classList.remove("correct", "wrong");
    }
  }

  // Обновляем счёт
  if (answer === correct) correctCount++;
  else wrongCount++;

  document.getElementById("result").textContent = `✔ Правильно: ${correctCount} | ✘ Неправильно: ${wrongCount}`;

  // Переход к следующему через 1,2 секунды
  setTimeout(() => {
    currentExercise++;
    showExercise();
  }, 1200);
}
