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
  questionDiv.innerHTML = ex.sentence;
  questionDiv.style.fontSize = "60px"; // крупный шрифт

  // Озвучка
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(ex.sentence);
    utter.lang = "it-IT"; // итальянский
    window.speechSynthesis.speak(utter);
  }

  // Очистка ответов
  answersDiv.innerHTML = "";
  answersDiv.style.display = "flex";
  answersDiv.style.flexDirection = "column";
  answersDiv.style.alignItems = "center";

  // Создаём кнопки для вариантов
  ex.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.style.fontSize = "50px"; // крупные кнопки
    button.style.padding = "20px";
    button.style.margin = "10px";
    button.style.width = "80%";
    button.style.borderRadius = "15px";
    button.style.cursor = "pointer";

    button.onclick = function () {
      checkAnswer(option, button);
    };

    answersDiv.appendChild(button);
  });

  resultDiv.innerHTML = `✔ Правильно: ${correctCount} | ✘ Неправильно: ${wrongCount}`;
}

function checkAnswer(answer, buttonClicked) {
  const ex = exercises[currentExercise];
  const correct = ex.answer;
  const buttons = document.getElementById("answers").children;

  // Подсвечиваем кнопки
  for (let btn of buttons) {
    if (btn.textContent === correct) {
      btn.style.backgroundColor = "#5fa574"; // зелёный
      btn.style.color = "white";
    } else if (btn === buttonClicked && answer !== correct) {
      btn.style.backgroundColor = "#c96a6a"; // красный
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "#f2f4f3"; // нейтральный
      btn.style.color = "#2e5f3e";
    }
    btn.disabled = true; // нельзя нажимать повторно
  }

  // Обновляем счёт
  if (answer === correct) correctCount++;
  else wrongCount++;

  document.getElementById("result").innerHTML = `✔ Правильно: ${correctCount} | ✘ Неправильно: ${wrongCount}`;

  // Переход к следующему через 1,2 секунды
  setTimeout(() => {
    currentExercise++;
    showExercise();
  }, 1200);
}
