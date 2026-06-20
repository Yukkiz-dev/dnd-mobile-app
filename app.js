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
  renderSpells();
  document.querySelectorAll(".slot-input").forEach(input => {

  input.addEventListener("change", () => {

    const level = input.id.match(/\d+/)[0];

    updateSpellSlot(level);
  });
});
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

function renderSpellSection(title, spells) {

  const container = document.querySelector(".spells");

  container.innerHTML = "";

  if (!spells?.length) return;

  const section = document.createElement("div");
  section.className = "spell-section";

  section.innerHTML = `
    <div class="spell-header">
      ${title}
    </div>
  `;

  spells.forEach(spell => {

    const details = document.createElement("details");
    details.className = "spell-card";

    details.innerHTML = `
      <summary>${spell.name}</summary>
      <p>${formatSpellDescription(spell.description)}</p>
    `;

    section.appendChild(details);
  });

  container.appendChild(section);
}

function formatSpellDescription(text) {
  return text.replace(/\n/g, "<br>");
}

async function renderSpells() {
  const container = document.querySelector(".spells");

  container.innerHTML = "";

  renderSpellSection("Cantrips", character.cantrips);

  renderLeveledSpellSection(
    "Level 1",
    character.level1
  );

  renderLeveledSpellSection(
    "Level 2",
    character.level2
  );
}

function renderLeveledSpellSection(title, levelData) {

  if (!levelData?.spells?.length) return;

  const container = document.querySelector(".spells");

  const section = document.createElement("div");
  section.className = "spell-section";

  section.innerHTML = `
    <div class="spell-header">
      <span>${title}</span>

      <div class="spell-slots">

        <input
          id="spellSlot${levelData.level}Input"
          class="slot-input"
          type="number"
          min="0"
          max="${levelData.maxSlots}"
          value="${levelData.currentSlots}"
        >

        <span>/ ${levelData.maxSlots}</span>

      </div>
    </div>
  `;

  levelData.spells.forEach(spell => {

    const details = document.createElement("details");
    details.className = "spell-card";

    details.innerHTML = `
      <summary class="${spell.prepared ? "" : "unprepared"}">
        <span>${spell.name}</span>

        <button
          class="cast-btn"
          ${spell.prepared ? "" : "disabled"}
          onclick="castSpell(event, ${levelData.level})"
        >
          Cast
        </button>
      </summary>

      <p>${formatSpellDescription(spell.description)}</p>
    `;

    section.appendChild(details);
  });

  container.appendChild(section);
}

async function changeSpellSlots(level, delta) {

  const levelData = character[`level${level}`];

  let newValue = Number(levelData.currentSlots) + delta;

  newValue = Math.max(
    0,
    Math.min(newValue, Number(levelData.maxSlots))
  );

  await updateSpellSlots(level, newValue);
}

async function setSpellSlots(level, value) {

  const levelData = character[`level${level}`];

  let newValue = Number(value);

  newValue = Math.max(
    0,
    Math.min(newValue, Number(levelData.maxSlots))
  );

  await updateSpellSlots(level, newValue);
}

async function updateSpellSlot(level) {

  const input = document.getElementById(`spellSlot${level}Input`);

  const value = input.value;

  const url =
    `${CONFIG.apiUrl}?type=spellSlot${level}&value=${encodeURIComponent(value)}`;

  console.log("Updating:", url);

  const response = await fetch(url);

  console.log(await response.text());

  await loadCharacter();
}

async function castSpell(event, level) {

  event.preventDefault();
  event.stopPropagation();

  const input = document.getElementById(`spellSlot${level}Input`);

  let value = Number(input.value);

  if (value <= 0) return;

  input.value = value - 1;

  await updateSpellSlot(level);
}

loadCharacter();

document.getElementById("tempHpInput")
  .addEventListener("change", updateTempHp);

document.getElementById("conditionInput")
  .addEventListener("change", updateCondition);