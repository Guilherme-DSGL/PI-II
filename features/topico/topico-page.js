const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const topicoService = require("./topico-service");

const itemsPerPage = 3;

async function sendPage(interaction, topicName) {
  let currentIndex = 0;
  let questions = [];

  const sentMessage = await interaction.reply(await buildReplyBody());

  const filter = (i) => i.user.id === interaction.user.id;
  const collector = sentMessage.createMessageComponentCollector({
    filter,
    time: 60000,
  });

  collector.on("collect", async (interaction) => {
    if (interaction.customId === "next") {
      currentIndex += itemsPerPage;
    } else if (interaction.customId === "previous") {
      currentIndex -= itemsPerPage;
    }

    await interaction.update(await buildReplyBody());
  });

  collector.on("end", async () => {
    await sentMessage.edit({
      components: [],
    });
  });

  async function buildReplyBody() {
    const { reply, disableNextButton } = await createContentResponse();
    const replyBody = { content: reply };
    const buttons = createNavigationButtons(disableNextButton);
    if (buttons) replyBody.components = [buttons];
    return replyBody;
  }

  async function createContentResponse() {
    const { result, disableNextButton } = await buildPageItens();
    const fields = buildFields(result);
    const reply = `Questões sobre: ${topicName}\n\n${fields}`;
    return { reply, disableNextButton };
  }

  function buildFields(questions) {
    return questions.map((item, index) => {
      return `- **${currentIndex + index + 1}. ${item.title}**\n  **Nível**: ${
        item.level
      } \n **Assunto**: ${item.subject}\n  **Descrição**: ${
        item.description
      }\n [Link para a questão](${item.link})`;
    });
  }

  async function buildPageItens() {
    let disableNextButton = false;

    const isInMemoryCache = currentIndex < questions.length;
    if (isInMemoryCache) {
      console.log("Searching in memory");
      return { result: searchInMemoryCache(), disableNextButton };
    }

    const result = await topicoService.topic(
      topicName,
      currentIndex,
      itemsPerPage
    );
    if (result.length === 0 && currentIndex > 0) {
      currentIndex -= itemsPerPage;
      return { result: searchInMemoryCache(), disableNextButton: true };
    }

    questions = [...questions, ...result];
    disableNextButton = false;

    return { result, disableNextButton };
  }

  function searchInMemoryCache() {
    return questions.slice(currentIndex, currentIndex + itemsPerPage);
  }

  function createNavigationButtons(disableNextButton) {
    const row = new ActionRowBuilder();

    row.addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel("Anterior")
        .setDisabled(currentIndex <= 0)
        .setStyle(ButtonStyle.Primary)
    );

    row.addComponents(
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Próximo")
        .setDisabled(disableNextButton)
        .setStyle(ButtonStyle.Primary)
    );

    return row.components.length ? row : null;
  }
}

module.exports = { sendPage };
