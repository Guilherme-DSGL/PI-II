const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
} = require("discord.js");
const env = require("./utils/consts");
const { loadCommands } = require("./utils/load-commands");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "features");

client.commands = loadCommands(foldersPath);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    chatInputCommand(interaction);
  } else if (interaction.isAutocomplete()) {
    autoComplete(interaction);
  }
});

/**
 * @param {import('discord.js').Interaction} interaction
 */
async function chatInputCommand(interaction) {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "Ocorreu um erro ao executar esse comando",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "Ocorreu um erro ao executar esse comando",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}

/**
 *
 * @param {import('discord.js').Interaction} interaction
 */
async function autoComplete(interaction) {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.autocomplete(interaction);
  } catch (error) {
    console.error(error);
  }
}
client.login(env.TOKEN);
