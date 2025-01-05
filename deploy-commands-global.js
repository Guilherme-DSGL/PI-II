const { loadCommandsForDeploy } = require("./utils/load-commands");
const { deployCommands } = require("./utils/deploy-commands");
const path = require("node:path");
const consts = require("./utils/consts");

const commandsPath = path.join(__dirname, "features");

const commands = loadCommandsForDeploy(commandsPath);

if (!consts.TOKEN) {
  throw new Error("TOKEN is required");
}
if (!consts.BOT_ID) {
  throw new Error("BOT_ID is required");
}

deployCommands({
  token: consts.TOKEN,
  bot_id: consts.BOT_ID,
  commands: commands,
});
