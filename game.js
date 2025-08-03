const output = document.getElementById("game-output");
const input = document.getElementById("command-input");

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const command = input.value.trim();
    input.value = "";
    processCommand(command);
  }
});

function processCommand(cmd) {
  appendOutput(`> ${cmd}`);

  switch (cmd.toLowerCase()) {
    case "look":
    case "look around":
      appendOutput("You're in your apartment. 3:19AM. The TV is on, but... you don’t own a TV.");
      break;
    case "turn on tv":
    case "watch tv":
      appendOutput("The screen flickers. Static hums. A cartoon mascot—*Captain Chomp*—is chewing through a mailbox.");
      break;
    case "answer phone":
      appendOutput("A voice crackles: “I’m still in the Vault. Do you remember Captain Chomp?”");
      break;
    case "help":
      appendOutput("Try commands like: look, turn on tv, answer phone, use [item], open [object]");
      break;
    default:
      appendOutput("The signal distorts. That doesn’t seem to do anything… yet.");
  }
}

function appendOutput(text) {
  output.textContent += "\n" + text;
}
