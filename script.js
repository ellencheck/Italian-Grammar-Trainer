let exercises = [];
let currentExercise = 0;

function start(topic) {

  fetch("exercises/" + topic + ".json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Файл не найден: " + topic);
      }
      return response.json();
    })
    .then(data => {

      exercises = data;
      currentExercise = 0;

      showExercise();

    })
    .catch(error => {
      console.error(error);
      alert("Ошибка загрузки темы: " + topic);
    });

}


function showExercise() {

  if (currentExercise >= exercises.length) {
    document.getElementById("exercise").innerHTML = "Тема завершена!";
    return;
  }

  const ex = exercises[currentExercise];

  document.getElementById("exercise").innerHTML = ex.sentence;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  ex.options.forEach(option => {

    const button = document.createElement("button");
    button.textContent = option;

    button.onclick = function () {
      checkAnswer(option);
    };

    optionsDiv.appendChild(button);

  });

}


function checkAnswer(answer) {

  const correct = exercises[currentExercise].answer;

  if (answer === correct) {
    alert("Правильно!");
  } else {
    alert("Неправильно. Правильный ответ: " + correct);
  }

  currentExercise++;
  showExercise();

}
