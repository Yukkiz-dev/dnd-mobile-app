async function loadCharacter() {
  const res = await fetch(CONFIG.apiUrl);
  const data = await res.json();

  window.character = data;

  document.getElementById("name").innerText = data.name;
  document.getElementById("class").innerText = "Class: " + data.class;
  document.getElementById("level").innerText = "Level: " + data.level;
  document.getElementById("hp").innerText = data.hp + " / " + data.maxHp;
}

async function updateHP(newHP) {

  await fetch(CONFIG.apiUrl + `?type=hp&value=${newHP}`);

  loadCharacter();
}

function setupButtons() {

  const hpBox = document.getElementById("hp");

  const minus = document.createElement("button");
  minus.innerText = "-";

  const plus = document.createElement("button");
  plus.innerText = "+";

  minus.onclick = () => {
    updateHP(window.character.hp - 1);
  };

  plus.onclick = () => {
    updateHP(window.character.hp + 1);
  };

  hpBox.appendChild(document.createElement("br"));
  hpBox.appendChild(minus);
  hpBox.appendChild(plus);
}

loadCharacter().then(setupButtons);