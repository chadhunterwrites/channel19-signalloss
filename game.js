const output = document.getElementById("game-output");
const input = document.getElementById("command-input");

let currentScene = "start";
let gameData = {};

// Load the intro scene JSON
fetch("data/intro.json")
  .then((res) => res.json())
  .then((data) => {
    gameData = data;
    renderScene(currentScene);
  })
  .catch((err) => {
    appendOutput("The signal... failed to tune in. (Error loading story data)");
    console.error(err);
  });

// Handle user input
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const command = input.value.trim().toLowerCase();
    input.value = "";
    processCommand(command);
  }
});

// Process the player's typed command
function processCommand(cmd) {
  appendOutput(`> ${cmd}`);
  const scene = gameData.scenes[currentScene];

  if (!scene || !scene.options) {
    appendOutput("You hear a low buzz, like the channel isn't tuned right.");
    return;
  }

  // Normalize and match commands to scene options
  const options = scene.options;
  if (options[cmd]) {
    currentScene = options[cmd];
    renderScene(currentScene);
  } else {
    appendOutput("The static flickers. That didn’t seem to do anything…");
  }
}

// Render the scene text on screen
function renderScene(sceneKey) {
  const scene = gameData.scenes[sceneKey];

  if (!scene) {
    appendOutput("[SCENE MISSING] The Vault doesn’t recognize this memory.");
    return;
  }

  appendOutput("\n" + scene.text);
}

// Utility to append output
function appendOutput(text) {
  output.textContent += "\n" + text;
  output.scrollTop = output.scrollHeight;
}
