const { loadCommandsForDeploy } = require("./utils/load-commands");
const { deployCommands } = require("./utils/deploy-commands");
const path = require("node:path");
const consts = require("./utils/consts");

const commandsPath = path.join(__dirname, "commands");

const commands = loadCommandsForDeploy(commandsPath);

deployCommands({
  token: consts.TOKEN,
  bot_id: consts.BOT_ID,
  commands: commands,
  server_id: consts.PRIVATE_SERVER_ID,
});
