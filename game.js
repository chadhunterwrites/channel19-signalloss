const output = document.getElementById("game-output");
const optionsContainer = document.getElementById("options-container");

let currentScene = "start";
let gameData = {};
let inventory = [];

Promise.all([
  fetch("data/intro.json").then((res) => res.json()),
  fetch("data/inventory.json").then((res) => res.json())
])
  .then(([sceneData, inventoryData]) => {
    gameData = sceneData;
    inventory = inventoryData.items;
    renderScene(currentScene);
  })
  .catch((err) => {
    appendOutput("Signal disrupted... (failed to load files)");
    console.error(err);
  });

function renderScene(sceneKey) {
  const scene = gameData.scenes[sceneKey];

  if (!scene) {
    appendOutput("[ERROR: Scene not found. Something is wrong with the tape.]");
    return;
  }

  currentScene = sceneKey;
  output.textContent = "\n" + scene.text;

  if (scene.reminder) {
    output.textContent += "\n" + scene.reminder;
  }

  if (scene.flavor) {
    output.textContent += `\n[${scene.flavor}]`;
  }

  renderOptions(scene.options);
}

function renderOptions(options) {
  optionsContainer.innerHTML = "";

  if (!options || Object.keys(options).length === 0) return;

  for (const [label, nextScene] of Object.entries(options)) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.onclick = () => renderScene(nextScene);
    optionsContainer.appendChild(btn);
  }
}

function appendOutput(text) {
  output.textContent += "\n" + text;
  output.scrollTop = output.scrollHeight;
}
