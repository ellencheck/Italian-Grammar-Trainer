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

      exercises = data.exercises;
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
    document.getElementById("question").innerHTML = "Тема завершена!";
    document.getElementById("answers").innerHTML = "";
    return;
  }

  const ex = exercises[currentExercise];

  document.getElementById("question").innerHTML = ex.sentence;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  ex.options.forEach(option => {

    const button = document.createElement("button");
    button.textContent = option;

    button.onclick = function () {
      checkAnswer(option);
    };

    answersDiv.appendChild(button);

  });

}

function checkAnswer(answer) {

  const correct = exercises[currentExercise].answer;
  const result = document.getElementById("result");

  if (answer === correct) {
    result.innerHTML = "✔ Правильно";
  } else {
    result.innerHTML = "✘ Неправильно. Ответ: " + correct;
  }

  currentExercise++;
}

function generate(){
  showExercise();
}
