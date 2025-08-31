// game.js — Saturday Mournings: Lost Signal (Phase 2, Button Mode)

const output = document.getElementById("game-output");
const buttonContainer = document.getElementById("button-container");

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

function renderScene(sceneKey, isReLook = false) {
  const scene = gameData.scenes[sceneKey];
  if (!scene) {
    appendOutput("[ERROR: Scene not found. Something is wrong with the tape.]");
    return;
  }

  if (!isReLook) {
    handleSceneEffects(scene);
  }

  output.textContent = "";
  buttonContainer.innerHTML = "";

  appendOutput(scene.text);
  if (scene.reminder) appendOutput(scene.reminder);
  if (scene.flavor) appendOutput("[" + scene.flavor + "]");

  const options = scene.options || {};
  for (const [label, target] of Object.entries(options)) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.classList.add("game-button");
    btn.onclick = () => {
      currentScene = target;
      renderScene(currentScene);
    };
    buttonContainer.appendChild(btn);
  }

  if (scene.allowInventory) {
    const invBtn = document.createElement("button");
    invBtn.textContent = "Inventory";
    invBtn.classList.add("game-button");
    invBtn.onclick = showInventory;
    buttonContainer.appendChild(invBtn);
  }
}

function appendOutput(text) {
  output.textContent += "\n\n" + text;
  output.scrollTop = output.scrollHeight;
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
    currentScene = "sceneDecayTrigger1";
    renderScene(currentScene);
  }
}

function showInventory() {
  appendOutput("You carry:");
  inventory.forEach(item => appendOutput("- " + item.name));
} 
