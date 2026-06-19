let character = null;


async function loadCharacter() {
  const res = await fetch(CONFIG.apiUrl);
  character = await res.json();

  document.getElementById("name").innerText = character.name;
  document.getElementById("class").innerText = `Class: ${character.class}`;
  document.getElementById("level").innerText = `Level: ${character.level}`;

  document.getElementById("currentHp").innerText = character.hp;
  document.getElementById("maxHp").innerText = character.maxHp;

  document.getElementById("tempHpInput").value = character.tempHp;
  document.getElementById("conditionInput").value = character.conditions;

  document.getElementById("ac").innerText = character.ac;
  document.getElementById("initiative").innerText =
    Number(character.init) > 0 ? `+${character.init}`: character.init;
  document.getElementById("speed").innerText = character.speed + " ft";
  
  renderTags("resistanceList", character.resistance);
  renderTags("immunityList", character.immunitites);
  renderTags("vulnerabilityList", character.vulnerabilites);
}

async function adjustHP(isHeal) {
  const input = document.getElementById("hpAmount");

  let amount = Number(input.value);

  if (isNaN(amount) || amount <= 0) return;

  let newHp = isHeal ? Number(character.hp) + amount : Number(character.hp) - amount;

  newHp = Math.max(0, Math.min(newHp, Number(character.maxHp)));

  await fetch(
    `${CONFIG.apiUrl}?type=hp&value=${newHp}`
  );

  await loadCharacter();
}

async function updateTempHp() {

  const value = document.getElementById("tempHpInput").value;

  await fetch(
    `${CONFIG.apiUrl}?type=tempHp&value=${encodeURIComponent(value)}`
  );

  await loadCharacter();
}

async function updateCondition() {

  const value = document.getElementById("conditionInput").value;

  await fetch(
    `${CONFIG.apiUrl}?type=conditions&value=${encodeURIComponent(value)}`
  );

  await loadCharacter();
}
async function renderTags(elementId, data) {

  const container = document.getElementById(elementId);

  container.innerHTML = "";

  const values = data
    .flat()
    .filter(value => value && value.trim() !== "");

  if (values.length === 0) {
    container.innerHTML = "<span class='defense-tag'>None</span>";
    return;
  }

  values.forEach(value => {
    const tag = document.createElement("span");

    tag.className = "defense-tag";
    tag.textContent = value;

    container.appendChild(tag);
  });
}

loadCharacter();

document.getElementById("tempHpInput")
  .addEventListener("change", updateTempHp);

document.getElementById("conditionInput")
  .addEventListener("change", updateCondition);