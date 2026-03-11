let exercises = [];
let filtered = [];
let currentExercise = null;
let good = 0;
let bad = 0;

let exercisesLoaded = false;
let loadingPromise = null;

// соответствие кнопок HTML и тем JSON
const topicMap = {
  art_def: "articoli_determinativi",
  art_indef: "articoli_indeterminativi",
  art_prep: "preposizioni_articolate",
  genere: "genere",
  pres_reg: "presente_regolari",
  pres_irr: "presente_irregolari",
  riflessivi: "riflessivi",
  possessivi: "possessivi",
  prep: "preposizioni",
  imp_reg: "imperfetto_regolari",
  imp_irr: "imperfetto_irregolari",
  pp_reg: "passato_prossimo_regolari",
  pp_irr: "passato_prossimo_irregolari",
  fut_reg: "futuro_regolari",
  fut_irr: "futuro_irregolari",
  impv_reg: "imperativo_regolari",
  impv_irr: "imperativo_irregolari"
};

// ✅ НАДЁЖНАЯ загрузка JSON
async function loadExercises(){

  if (exercisesLoaded) return exercises;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {

      const res = await fetch("./exercises.json", {
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error("JSON not found: " + res.status);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("JSON format invalid");
      }

      exercises = data;
      exercisesLoaded = true;

      console.log("✅ Exercises loaded:", exercises.length);

      return exercises;

    } catch (err) {
      console.error("❌ LOAD ERROR:", err);

      document.getElementById("question").textContent =
        "Ошибка загрузки упражнений (JSON)";
    }
  })();

  return loadingPromise;
}

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function shuffle(arr){
  return [...arr].sort(()=>Math.random()-0.5);
}

async function start(topic){

  await loadExercises();

  const realTopic = topicMap[topic] || topic;

  const group = exercises.find(t => t.topic === realTopic);

  if(!group){
    document.getElementById("question").textContent =
      "Упражнения не найдены";
    document.getElementById("answers").innerHTML = "";
    return;
  }

  filtered = group.exercises;

  generateExercise();
}

function generateExercise(){

  if(!filtered.length) return;

  currentExercise = random(filtered);

  renderExercise(
    currentExercise.sentence,
    shuffle(currentExercise.options)
  );
}

function renderExercise(sentence, options){

  const q = document.getElementById("question");
  const a = document.getElementById("answers");

  q.textContent = sentence;
  a.innerHTML = "";

  options.forEach(opt => {

    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = opt;

    btn.onclick = () => checkAnswer(opt);

    a.appendChild(btn);
  });
}

function checkAnswer(choice){

  if(choice === currentExercise.answer){
    good++;
    document.getElementById("good").textContent = good;
    document.getElementById("result").textContent = "✅ Правильно";
  } else {
    bad++;
    document.getElementById("bad").textContent = bad;
    document.getElementById("result").textContent =
      "❌ Неправильно. Правильный ответ: " + currentExercise.answer;
  }
}

function generate(){
  generateExercise();
}
