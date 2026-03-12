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

      // Обновляем счётчики
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

  // Проверка на конец темы
  if (currentExercise >= exercises.length) {
    questionDiv.textContent = "Тема завершена!";
    answersDiv.innerHTML = "";
    return;
  }

  const ex = exercises[currentExercise];
  questionDiv.textContent = ex.sentence;

  // Очистка вариантов
  answersDiv.innerHTML = "";

  // Кнопки вариантов
  ex.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("answer"); // дизайн берется из CSS

    btn.onclick = () => checkAnswer(option, btn);
    answersDiv.appendChild(btn);
  });

  // Кнопка озвучки
  let speakBtn = document.getElementById("speakBtn");
  if (!speakBtn) {
    speakBtn = document.createElement("button");
    speakBtn.id = "speakBtn";
    speakBtn.textContent = "🔊 Прослушать";
    speakBtn.classList.add("next");
    speakBtn.style.marginTop = "10px";
    speakBtn.onclick = () => speakText(ex.sentence);
    answersDiv.parentNode.insertBefore(speakBtn, answersDiv.nextSibling);
  }
  speakBtn.style.display = "inline-block";
}

// Проверка ответа
function checkAnswer(answer, clickedBtn) {
  const ex = exercises[currentExercise];
  const correct = ex.answer;
  const buttons = document.getElementById("answers").children;

  for (let btn of buttons) {
    btn.disabled = true; // нельзя повторно нажимать

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

  // Обновляем счёт
  if (answer === correct) correctCount++;
  else wrongCount++;

  document.getElementById("good").textContent = correctCount;
  document.getElementById("bad").textContent = wrongCount;

  // Переход к следующему через 1 секунду
  setTimeout(() => {
    currentExercise++;
    showExercise();
  }, 1000);
}

// Озвучка текста
function speakText(text) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "it-IT"; // итальянский
    window.speechSynthesis.speak(utter);
  } else {
    alert("Озвучка не поддерживается в этом браузере.");
  }
}

// Кнопка "Следующий" использует эту функцию
function generate() {
  if (currentExercise < exercises.length) showExercise();
}
