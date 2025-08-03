const output = document.getElementById("game-output");
const input = document.getElementById("command-input");

let currentScene = "start";
let gameData = {};
let inventory = [];
let vaultDecay = 0;

// Load scene data and inventory
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

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const command = input.value.trim().toLowerCase();
    input.value = "";
    processCommand(command);
  }
});

function processCommand(cmd) {
  appendOutput(`> ${cmd}`);

  const scene = gameData.scenes[currentScene];

  if (!scene) {
    appendOutput("[ERROR] The scene is missing. Are you caught between signals?");
    console.error("Scene not found:", currentScene);
    return;
  }

  const options = scene.options || {};

  console.log("CMD:", cmd);
  console.log("CURRENT SCENE:", currentScene);
  console.log("AVAILABLE OPTIONS:", Object.keys(options));

  const matchedCommand = findMatchingCommand(cmd, options);
  console.log("MATCHED:", matchedCommand);

  if (matchedCommand) {
    const nextSceneKey = options[matchedCommand];
    currentScene = nextSceneKey;
    renderScene(currentScene);
  } else if (cmd.startsWith("use ")) {
    const itemName = cmd.substring(4);
    useItem(itemName);
  } else if (cmd === "look" || cmd === "look around") {
    renderScene(currentScene, true); // Re-show scene
  } else if (cmd === "inventory") {
    showInventory();
  } else {
    appendOutput("The static crackles. That doesn't work... or it shouldn't.");
  }
}


  // Debugging info
  console.log("CMD:", cmd);
  console.log("CURRENT SCENE:", currentScene);
  console.log("AVAILABLE OPTIONS:", Object.keys(options));

  const matchedCommand = findMatchingCommand(cmd, options);
  console.log("MATCHED:", matchedCommand);

  if (matchedCommand) {
    const nextSceneKey = options[matchedCommand];
    currentScene = nextSceneKey;
    renderScene(currentScene);
  } else if (cmd.startsWith("use ")) {
    const itemName = cmd.substring(4);
    useItem(itemName);
  } else if (cmd === "look" || cmd === "look around") {
    renderScene(currentScene, true); // Re-show scene
  } else if (cmd === "inventory") {
    showInventory();
  } else {
    appendOutput("The static crackles. That doesn't work... or it shouldn't.");
  }
}

function findMatchingCommand(cmd, options) {
  const keys = Object.keys(options);
  for (const key of keys) {
    // Exact match
    if (cmd === key) return key;

    // Word match (flexible fuzzy match)
    const cmdWords = cmd.split(" ");
    const keyWords = key.split(" ");
    if (keyWords.every(word => cmdWords.includes(word))) return key;
  }
  return null;
}

function renderScene(sceneKey, isReLook = false) {
  const scene = gameData.scenes[sceneKey];

  if (!scene) {
    appendOutput("[ERROR: Scene not found. Something is wrong with the tape.]");
    console.warn("Scene missing:", sceneKey);
    return;
  }

  console.log("Rendering scene:", sceneKey);

  if (!isReLook) {
    handleSceneEffects(scene);
  }

  appendOutput("\n" + scene.text);

  if (scene.reminder) {
    appendOutput(scene.reminder);
  }

  if (scene.flavor) {
    appendOutput(`\n[${scene.flavor}]`);
  }
}

function handleSceneEffects(scene) {
  if (scene.image) {
    showImage(scene.image);
  }
  if (scene.sound) {
    playSound(scene.sound);
  }
  if (scene.jumpscare) {
    triggerJumpscare();
  }
}

function showImage(filename) {
  const img = document.createElement("img");
  img.src = `assets/images/${filename}`;
  img.classList.add("jumpscare");
  document.body.appendChild(img);

  setTimeout(() => {
    img.remove();
  }, 1500);
}

function playSound(filename) {
  const audio = new Audio(`assets/audio/${filename}`);
  audio.play();
}

function triggerJumpscare() {
  appendOutput("\n[⚠ JUMPSCARE ACTIVATED]");
  vaultDecay += 1;
}

function useItem(name) {
  const item = inventory.find(i => i.name.toLowerCase() === name.toLowerCase());

  if (!item) {
    appendOutput("You don’t have that. Or maybe it’s lost…");
    return;
  }

  if (item.effect) {
    appendOutput(item.effect);
    if (item.triggerScene) {
      currentScene = item.triggerScene;
      renderScene(currentScene);
    }
  } else {
    appendOutput("You fiddle with it. It feels... familiar. But nothing happens.");
  }
}

function showInventory() {
  if (inventory.length === 0) {
    appendOutput("Your pockets are empty. Or maybe you forgot what was in them.");
    return;
  }

  appendOutput("You carry:");
  inventory.forEach(item => appendOutput("- " + item.name));
}

function appendOutput(text) {
  output.textContent += "\n" + text;
  output.scrollTop = output.scrollHeight;
}

