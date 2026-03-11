// ===== GLOBALS =====
let exercises = window.exercisesData || [];
let filtered = [];
let currentExercise = null;
let good = 0;
let bad = 0;


// ===== HELPERS =====
function random(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr){
  return [...arr].sort(() => Math.random() - 0.5);
}


// ===== TOPIC MAP =====
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


// ===== START TOPIC =====
function start(topic){

  if(!exercises.length){
    document.getElementById("question").textContent = "JSON не загружен";
    return;
  }

  const realTopic = topicMap[topic] || topic;

  const group = exercises.find(t => t.topic === realTopic);

  if(!group){
    document.getElementById("question").textContent = "Упражнения не найдены";
    document.getElementById("answers").innerHTML = "";
    return;
  }

  filtered = group.exercises;

  generateExercise();
}


// ===== GENERATE EXERCISE =====
function generateExercise(){

  if(!filtered.length) return;

  currentExercise = random(filtered);

  const sentence = currentExercise.sentence;
  const options = shuffle(currentExercise.options);

  renderExercise(sentence, options);
}


// ===== RENDER =====
function renderExercise(sentence, options){

  const sentenceBox = document.getElementById("question");
  const optionsBox = document.getElementById("answers");

  sentenceBox.textContent = sentence;
  optionsBox.innerHTML = "";

  options.forEach(opt => {

    const btn = document.createElement("button");

    btn.className = "answer";
    btn.textContent = opt;

    btn.onclick = () => checkAnswer(opt);

    optionsBox.appendChild(btn);

  });
}


// ===== CHECK ANSWER =====
function checkAnswer(choice){

  if(!currentExercise) return;

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


// ===== NEXT BUTTON =====
function generate(){
  generateExercise();
}