const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

/**
 *
 * @param {string} directory
 * @param {string[]}files
 * @param {Collection | Array<object>} commands
 * @param {boolean} isDeploy
 * @returns {void}
 */
function processCommandFiles(directory, files, commands, isDeploy) {
  for (const file of files) {
    const filePath = path.join(directory, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      console.warn(`[LOG] LOAD ${file}`);
      if (isDeploy) {
        commands.push(command.data.toJSON());
      } else {
        commands.set(command.data.name, command);
      }
    } else {
      console.warn(`[SKIP] The file at ${filePath} is missing discord config`);
    }
  }
}

/**
 *
 * @param {fs.PathLike} directory
 * @param {Array<object>} commands
 * @param {boolean} isDeploy
 */
function readDirectory(directory, commands, isDeploy) {
  const commandFolders = fs.readdirSync(directory);

  const commandFilesInCurrentFolder = commandFolders.filter(
    (file) =>
      fs.lstatSync(path.join(directory, file)).isFile() && file.endsWith(".js")
  );

  processCommandFiles(
    directory,
    commandFilesInCurrentFolder,
    commands,
    isDeploy
  );

  for (const folder of commandFolders) {
    const folderPath = path.join(directory, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
      readDirectory(folderPath, commands, isDeploy);
    }
  }
}

/**
 * @param {fs.PathLike} directory
 * @returns {Collection} result
 */
function loadCommands(directory) {
  const commands = new Collection();
  readDirectory(directory, commands, false);
  return commands;
}

/**
 *
 * @param {fs.PathLike} commandsPath
 * @returns {Array<object>} commands
 */
function loadCommandsForDeploy(commandsPath) {
  const commands = [];
  readDirectory(commandsPath, commands, true);
  return commands;
}

module.exports = { loadCommandsForDeploy, loadCommands };
