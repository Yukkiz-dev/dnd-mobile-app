let character = null;

async function loadCharacter() {
  const res = await fetch(CONFIG.apiUrl);
  character = await res.json();

  document.getElementById("name").innerText = character.name;
  document.getElementById("class").innerText = "Class: " + character.class;
  document.getElementById("level").innerText = "Level: " + character.level;

  document.getElementById("hpDisplay").innerText =
    character.hp + " / " + character.maxHp;

  document.getElementById("hpInput").value = character.hp;
}

async function updateHP(newHP) {
  await fetch(CONFIG.apiUrl + `?type=hp&value=${newHP}`);
  loadCharacter();
}

function changeHP(delta) {
  let input = document.getElementById("hpInput");
  let value = Number(input.value);

  value += delta;

  // safety clamp
  if (value < 0) value = 0;
  if (value > character.maxHp) value = character.maxHp;

  input.value = value;

  updateHP(value);
}

loadCharacter();