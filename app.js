async function loadCharacter() {
  try {
    const res = await fetch(CONFIG.apiUrl);
    const data = await res.json();

    document.getElementById("name").innerText =
      data.name;

    document.getElementById("class").innerText =
      "Class: " + data.class;

    document.getElementById("level").innerText =
      "Level: " + data.level;

    document.getElementById("hp").innerText =
      data.hp + " / " + data.maxHp;

  } catch (err) {
    console.error(err);
    document.getElementById("name").innerText =
      "Failed to load character";
  }
}

loadCharacter();