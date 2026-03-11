// ======================
// STATE
// ======================

let exercises = [];
let filtered = [];
let currentExercise = null;
let good = 0;
let bad = 0;

let loaded = false;


// ======================
// LOAD JSON
// ======================

async function loadExercises(){

  if(loaded) return;

  try {

    const res = await fetch("./exercises.json?nocache=" + Date.now());

    if(!res.ok)
      throw new Error("JSON not loaded");

    exercises = await res.json();

    console.log("✅ Loaded topics:",
      exercises.map(e => e.topic)
    );

    loaded = true;

  } catch(err){

    console.error(err);

    document.getElementById("question").textContent =
      "Ошибка загрузки JSON";
  }
}


// ======================
// HELPERS
// ======================

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function shuffle(arr){
  return [...arr].sort(()=>Math.random()-0.5);
}


// ======================
// START TOPIC
// ======================

async function start(topic){

  await loadExercises();

  const group = exercises.find(e => e.topic === topic);

  if(!group || !group.exercises?.length){

    document.getElementById("question").textContent =
      "Упражнения не найдены";

    document.getElementById("answers").innerHTML="";
    return;
  }

  filtered = group.exercises;

  generateExercise();
}


// ======================
// GENERATE
// ======================

function generateExercise(){

  if(!filtered.length) return;

  currentExercise = random(filtered);

  renderExercise(
    currentExercise.sentence,
    shuffle(currentExercise.options)
  );
}


// ======================
// RENDER
// ======================

function renderExercise(sentence, options){

  const q=document.getElementById("question");
  const a=document.getElementById("answers");

  q.textContent=sentence;
  a.innerHTML="";

  options.forEach(opt=>{

    const btn=document.createElement("button");
    btn.className="answer";
    btn.textContent=opt;

    btn.onclick=()=>checkAnswer(opt);

    a.appendChild(btn);
  });
}


// ======================
// CHECK ANSWER
// ======================

function checkAnswer(choice){

  if(choice===currentExercise.answer){
    good++;
    document.getElementById("good").textContent=good;
    document.getElementById("result").textContent="✅ Правильно";
  } else {
    bad++;
    document.getElementById("bad").textContent=bad;
    document.getElementById("result").textContent=
      "❌ Неправильно. Правильный ответ: "
      + currentExercise.answer;
  }
}


// ======================
// NEXT
// ======================

function generate(){
  generateExercise();
}
