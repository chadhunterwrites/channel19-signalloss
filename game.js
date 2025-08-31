// game.js — Saturday Mournings: Lost Signal (Phase 2 - Button-Based UI)

const output = document.getElementById("game-output");
const buttonArea = document.getElementById("option-buttons");

let currentScene = "start";
let gameData = {};
let inventory = [];
let vaultDecay = 0;
let eventFlags = {
  decoderUsed: false,
  tapeInserted: false,
  decayTriggered: false
};

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
  output.textContent = scene.text + "\n";

  if (scene.reminder) appendOutput(scene.reminder);
  if (scene.flavor) appendOutput("[" + scene.flavor + "]");

  handleSceneEffects(scene);
  renderButtons(scene.options);
}

function renderButtons(options) {
  buttonArea.innerHTML = "";

  const hasOptions = options && Object.keys(options).length > 0;
  if (!hasOptions) return;

  Object.entries(options).forEach(([label, target]) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = "option-btn";
    btn.onclick = () => {
      currentScene = target;
      renderScene(target);
    };
    buttonArea.appendChild(btn);
  });

  // Inventory use button (if item has triggerScene)
  inventory.forEach(item => {
    if (item.triggerScene && !eventFlags[`${item.name.replace(/\s+/g, '')}Used`]) {
      const btn = document.createElement("button");
      btn.textContent = `Use ${item.name}`;
      btn.className = "inventory-btn";
      btn.onclick = () => useItem(item.name);
      buttonArea.appendChild(btn);
    }
  });
}

function handleSceneEffects(scene) {
  if (scene.image) showImage(scene.image);
  if (scene.sound) playSound(scene.sound);
  if (scene.jumpscare) triggerJumpscare();
}

function showImage(filename) {
  const img = document.createElement("img");
  img.src = `assets/images/${filename}`;
  img.classList.add("jumpscare");
  document.body.appendChild(img);
  setTimeout(() => img.remove(), 1500);
}

function playSound(filename) {
  const audio = new Audio(`assets/audio/${filename}`);
  audio.play();
}

function triggerJumpscare() {
  appendOutput("\n[⚠ JUMPSCARE ACTIVATED]");
  vaultDecay++;
  if (vaultDecay >= 3 && !eventFlags.decayTriggered) {
    eventFlags.decayTriggered = true;
    renderScene("sceneDecayTrigger1");
  }
}

function useItem(name) {
  const item = inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
  if (!item) {
    appendOutput("You don’t have that. Or maybe it’s lost…");
    return;
  }

  appendOutput(item.effect || "It buzzes in your hand, warm and wrong.");
  if (item.triggerScene) {
    currentScene = item.triggerScene;
    if (item.name === "decoder ring") eventFlags.decoderUsed = true;
    if (item.name === "vhs tape") eventFlags.tapeInserted = true;
    renderScene(currentScene);
  }
}

function appendOutput(text) {
  output.textContent += "\n" + text;
  output.scrollTop = output.scrollHeight;
}
