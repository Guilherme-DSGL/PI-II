const { SlashCommandBuilder } = require("discord.js");
const topicoService = require("./topico-service.js");

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
    const topicName = interaction.options.getString("nometopico");

    topicoPage.sendPage(interaction, topicName);
  },
};
