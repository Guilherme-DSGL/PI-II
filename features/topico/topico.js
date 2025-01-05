const { SlashCommandBuilder } = require("discord.js");

const topicoPage = require("./topico-page.js");
const command = new SlashCommandBuilder()
  .setName("topico")
  .setDescription("Retorna questões relacionadas a um tópico")
  .addStringOption((option) =>
    option
      .setName("nometopico")
      .setDescription("Nome do tópico para filtragem")
      .setRequired(true)
  );

module.exports = {
  data: command,
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const topicName = interaction.options.getString("nometopico");

      await topicoPage.createTopicPage(interaction, topicName);
    } catch (e) {
      console.error(e);
      await interaction.edit("Não foi possível processar a solicitação.");
    }
  },
};
