const { SlashCommandBuilder } = require("discord.js");
const subjects = require("../../subjects.js");
const topicoPage = require("./topico-page.js");
const command = new SlashCommandBuilder()
  .setName("topico")
  .setDescription("Retorna questões relacionadas a um tópico")
  .addStringOption((option) =>
    option
      .setName("nometopico")
      .setDescription("Nome do tópico para filtragem")
      .setAutocomplete(true)
      .setRequired(true)
  );

module.exports = {
  data: command,
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const topicName = interaction.options.getString("nometopico");

      await topicoPage.createTopicPage(interaction, topicName, false);
    } catch (e) {
      console.error(e);
      await interaction.edit("Não foi possível processar a solicitação.");
    }
  },

  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const focusedValue = focusedOption.value.toLowerCase();
    const filteredSubjects = subjects.filter((subject) =>
      subject.toLowerCase().includes(focusedValue)
    );
    const suggestions = filteredSubjects.slice(0, 10).map((subject) => ({
      name: subject,
      value: subject,
    }));
    await interaction.respond(suggestions);
  },
};
