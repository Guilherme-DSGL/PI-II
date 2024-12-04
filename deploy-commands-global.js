const { loadCommandsForDeploy } = require("./utils/load-commands");
const { deployCommands } = require("./utils/deploy-commands");
const path = require("node:path");
const consts = require("./utils/consts");

const commandsPath = path.join(__dirname, "commands");

const commands = loadCommandsForDeploy(commandsPath);

deployCommands({
  token: consts.TOKEN,
  clientId: consts.BOT_ID,
  commands: commands,
});
