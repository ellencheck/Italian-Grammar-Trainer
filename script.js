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
    document.getElementById("question").textContent = "Тема завершена!";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("result").textContent = `✔ Правильно: ${correctCount} | ✘ Неправильно: ${wrongCount}`;
    document.getElementById("speakBtn").style.display = "none";
    return;
  }

  const ex = exercises[currentExercise];
  const questionDiv = document.getElementById("question");
  const answersDiv = document.getElementById("answers");
  const resultDiv = document.getElementById("result");
  const speakBtn = document.getElementById("speakBtn");

  // Вопрос
  questionDiv.textContent = ex.sentence;

  // Показываем кнопку озвучки
  speakBtn.style.display = "inline-block";
  speakBtn.onclick = () => speakText(ex.sentence);

  // Очистка ответов
  answersDiv.innerHTML = "";

  // Создаём кнопки вариантов
  ex.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("answer"); // CSS из твоего styles.css

    btn.onclick = () => checkAnswer(option, btn);
    answersDiv.appendChild(btn);
  });

  // Обновляем счёт
  resultDiv.textContent = `✔ Правильно: ${correctCount} | ✘ Неправильно: ${wrongCount}`;
}

function checkAnswer(answer, clickedBtn) {
  const ex = exercises[currentExercise];
  const correct = ex.answer;
  const buttons = document.getElementById("answers").children;

  for (let btn of buttons) {
    btn.disabled = true;

    if (btn.textContent === correct) {
      btn.classList.add("correct");
      btn.classList.remove("wrong");
    } else if (btn === clickedBtn && answer !== correct) {
      btn.classList.add("wrong");
      btn.classList.remove("correct");
    } else {
      btn.classList.remove("correct", "wrong");
    }
  }

  if (answer === correct) correctCount++;
  else wrongCount++;

  document.getElementById("result").textContent = `✔ Правильно: ${correctCount} | ✘ Неправильно: ${wrongCount}`;

  setTimeout(() => {
    currentExercise++;
    showExercise();
  }, 1200);
}

// Функция озвучки
function speakText(text) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "it-IT"; // итальянский
    window.speechSynthesis.speak(utter);
  } else {
    alert("Озвучка не поддерживается в этом браузере.");
  }
}
