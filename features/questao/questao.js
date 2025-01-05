const { SlashCommandBuilder } = require("discord.js");
const questaoService = require("./questao-service");
const command = new SlashCommandBuilder()
  .setName("questao")
  .setDescription("Retorna dicas e insigths das questões da OBI")
  .addStringOption((option) =>
    option
      .setName("link")
      .setDescription("Link da questão da OBI")
      .setRequired(true)
  );

module.exports = {
  data: command,
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const link = interaction.options.getString("link");
      const question = await questaoService.getQuestionByLink(link);
      if (!question) {
        return interaction.reply("Questão não encontrada.");
      }
      const apiResponse = await questaoService.getQuestionSuggestion(question);

      await interaction.editReply(`${apiResponse}`);
    } catch (e) {
      console.error(e);
      await interaction.editReply(
        "Ocorreu um erro ao tentar buscar processar o comando."
      );
    }
  },
};
