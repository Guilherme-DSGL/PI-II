const { SlashCommandBuilder } = require("discord.js");

const command = new SlashCommandBuilder()
  .setName("topico")
  .setDescription("Retorna questões relacionadas a um tópico")
  .addStringOption((option) =>
    option
      .setName("nometopico")
      .setDescription("Nome do tópico para filtragem")
      .setRequired(true)
  );

async function topic(interaction) {
  try {
    const topicName = interaction.options.getString("nometopico");
    await interaction.reply(`Ainda não há nada por aqui! Tópico: ${topicName}`);
  } catch (e) {}
}

module.exports = {
  data: command,
  async execute(interaction) {
    await topic(interaction);
  },
};
