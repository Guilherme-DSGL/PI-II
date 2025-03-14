const { REST, Routes } = require("discord.js");

/**
 *
 * @param {object} root0
 * @param {string} root0.token
 * @param {string} root0.bot_id
 * @param {string} root0.commands
 * @param {string | null} root0.server_id
 */
async function deployCommands({ token, bot_id, commands, server_id = null }) {
  const rest = new REST().setToken(token);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const route = server_id
      ? Routes.applicationGuildCommands(bot_id, server_id)
      : Routes.applicationCommands(bot_id);

    const data = await rest.put(route, { body: commands });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(`[ERROR] Failed to deploy commands:`, error);
  }
}

module.exports = { deployCommands };
