const { SlashCommandBuilder } = require("discord.js");

const command = new SlashCommandBuilder()
  .setName("questao")
  .setDescription("Retorna dicas e insigths das questões da OBI")
  .addStringOption((option) =>
    option
      .setName("link")
      .setDescription("Link da questão da OBI")
      .setRequired(true)
  );
async function question(interaction) {
  try {
    const link = interaction.options.getString("link");
    await interaction.reply(`Link da questão da OBI: ${link}`);
  } catch (e) {}
}
module.exports = {
  data: command,
  async execute(interaction) {
    question(interaction);
  },
};
