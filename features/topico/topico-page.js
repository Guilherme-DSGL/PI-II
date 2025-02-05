const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const topicoService = require("./topico-service");
const { PRIMARY_COLOR } = require("../../utils/consts");

const itemsPerPageEmbed = 1; // Visualização embed
const itemsPerPageDefault = 1; // Sem embed

/**
 * @param {import("discord.js").Interaction} interaction
 * @param {string} topicName
 * @param {boolean} [useEmbed] - Define se a resposta será enviada como embed.
 */
async function createTopicPage(interaction, topicName, useEmbed = true) {
  const paginationState = {
    currentIndex: 0,
    currentItemsPerPage: useEmbed ? itemsPerPageEmbed : itemsPerPageDefault,
    questions: [],
    useEmbed,
  };

  const sentMessage = await interaction.editReply(
    await buildReplyBody(topicName, paginationState)
  );

  const filter = (i) => i.user.id === interaction.user.id;
  const collector = sentMessage.createMessageComponentCollector({
    filter,
    time: 60000,
  });

  collector.on("collect", async (i) => {
    paginationState.currentIndex +=
      i.customId === "next"
        ? paginationState.currentItemsPerPage
        : -paginationState.currentItemsPerPage;

    await i.update(await buildReplyBody(topicName, paginationState));
  });

  collector.on("end", async () => {
    await interaction.editReply({ components: [] });
  });
}

/**
 * @param {string} topicName
 * @param {PaginationState} paginationState
 * @returns {Promise<object>} result
 */
async function buildReplyBody(topicName, paginationState) {
  const { reply, hasNextPage, questionsLength } = await createContentResponse(
    topicName,
    paginationState
  );

  const replyBody = paginationState.useEmbed
    ? { embeds: [...createEmbedResponse(questionsLength, reply, topicName)] }
    : { content: reply.join("\n") };

  const buttons = createNavigationButtons(
    paginationState.currentIndex,
    hasNextPage,
    questionsLength
  );
  if (buttons) replyBody.components = [buttons];
  return replyBody;
}

/**
 * @param {string} topicName - Nome do tópico.
 * @param {PaginationState} paginationState
 * @returns {Promise<{reply: string[] | EmbedBuilder, hasNextPage: boolean, questionsLength: number}>} response
 */
async function createContentResponse(topicName, paginationState) {
  const { result, hasNextPage } = await getPageItems(
    topicName,
    paginationState
  );
  const questionsLength = result.length;
  const response = { hasNextPage, questionsLength };

  response.reply =
    questionsLength > 0
      ? formatQuestions(result, paginationState.currentIndex)
      : noResultsMessage(topicName);

  return response;
}

/**
 *
 * @param {number} questionsLength
 * @param {string} fields
 * @param {string} topicName
 * @returns {Promise<{reply: string | EmbedBuilder}>} response
 */
function createEmbedResponse(questionsLength, fields, topicName) {
  return questionsLength > 0
    ? fields.map((field) =>
        new EmbedBuilder()
          .setColor(PRIMARY_COLOR)
          .setTitle(`Questões sobre: ${topicName}`)
          .setDescription(field)
      )
    : new EmbedBuilder()
        .setColor("#FFFF00")
        .setTitle("Não encontrei :(")
        .setDescription(
          `Não encontrei nenhuma questão relacionada ao assunto: ${topicName}`
        );
}

/**
 * @param {Array<Question>} questions
 * @param {number} currentIndex
 * @returns {string | EmbedBuilder} result.
 */
function formatQuestions(questions, currentIndex) {
  const fields = questions.map((item, index) => {
    const cleanedDescription = item.description
      .replace(/!\[.*?\]\(.*?\)+/g, "")
      .replace(/---/g, "")
      .replace(/\s{2,}/g, "\n\n");
    return `## Questão #${currentIndex + index + 1}: ${item.title} - **Nível: ${
      item.level
    }**\n### Descrição:\n${cleanedDescription
      .split("## Exemplos")
      .at(0)
      .trim()}\n\n[🔗 Link para a questão](${item.link})`;
  });

  return fields;
}

/**
 * @param {string} topicName
 * @returns {string} result.
 */
function noResultsMessage(topicName) {
  return `Não encontrei nenhuma questão relacionada ao assunto: ${topicName}`;
}

/**
 * @param {string} topicName
 * @param {PaginationState} paginationState
 * @returns {Promise<{result: Question[], hasNextPage: boolean}>} result
 */
async function getPageItems(topicName, paginationState) {
  const { currentIndex, questions, currentItemsPerPage } = paginationState;
  const isInMemoryCache = currentIndex < questions.length;

  if (isInMemoryCache) {
    return {
      result: questions.slice(currentIndex, currentIndex + currentItemsPerPage),
      hasNextPage: true,
    };
  }

  const result = await topicoService.getQuestionsByTopic(
    topicName,
    currentIndex,
    currentItemsPerPage
  );

  if (!result.length && currentIndex > 0) {
    paginationState.currentIndex -= currentItemsPerPage;
    return {
      result: questions.slice(currentIndex - currentItemsPerPage, currentIndex),
      hasNextPage: false,
    };
  }

  questions.push(...result);
  return { result, hasNextPage: result.length === currentItemsPerPage };
}

/**
 * @param {number} currentIndex
 * @param {boolean} hasNextPage
 * @param {number} questionsLength
 * @returns {import('discord.js').ActionRowBuilder | null} row
 */
function createNavigationButtons(currentIndex, hasNextPage, questionsLength) {
  if (questionsLength === 0) return null;
  const row = new ActionRowBuilder();
  if (questionsLength > 0) {
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
        .setDisabled(!hasNextPage)
        .setStyle(ButtonStyle.Primary)
    );
  }
  return row.components.length ? row : null;
}

module.exports = { createTopicPage };

/**
 * @typedef {import("./topico-model").Question} Question
 * @typedef {object} PaginationState
 * @property {number} currentIndex - Current index of pagination.
 * @property {number} currentItemsPerPage -
 * @property {Array<Question>} questions - Cached questions.
 * @property {boolean} useEmbed - Flag to determine if the response should be sent as an embed view.
 */
