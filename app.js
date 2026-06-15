let character = null;


async function loadCharacter() {
  const res = await fetch(CONFIG.apiUrl);
  character = await res.json();

  document.getElementById("name").innerText = character.name;
  document.getElementById("class").innerText = `Class: ${character.class}`;
  document.getElementById("level").innerText = `Level: ${character.level}`;

  document.getElementById("currentHp").innerText = character.hp;
  document.getElementById("maxHp").innerText = character.maxHp;
}

async function adjustHP(isHeal) {
  const input = document.getElementById("hpAmount");

  let amount = Number(input.value);

  if (isNaN(amount) || amount <= 0) return;

  let newHp = isHeal
    ? Number(character.hp) + amount
    : Number(character.hp) - amount;

  newHp = Math.max(0, Math.min(newHp, Number(character.maxHp)));

  await fetch(
    `${CONFIG.apiUrl}?type=hp&value=${newHp}`
  );

  await loadCharacter();
}

loadCharacter();