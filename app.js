let character = null;


async function loadCharacter() {
  console.log("API URL:", CONFIG.apiUrl);

  const res = await fetch(CONFIG.apiUrl);
  console.log("RAW RESPONSE:", res);

  const text = await res.text();
  console.log("TEXT:", text);
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