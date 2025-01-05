const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const topicoService = require("./topico-service");

const itemsPerPage = 3;

/**
 * @typedef {import('../../entities/questao.js')} Question
 */

/**
 * Create a paginated topic page interaction with embeds.
 * @param {import('discord.js').Interaction} interaction - The interaction object from Discord.
 * @param {string} topicName - The name of the topic to fetch questions for.
 */
async function createTopicPage(interaction, topicName) {
  let currentIndex = 0;
  let questions = [];

  const sentMessage = await interaction.editReply(
    await buildReplyBody(topicName, questions, currentIndex)
  );

  const filter = (i) => i.user.id === interaction.user.id;
  const collector = sentMessage.createMessageComponentCollector({
    filter,
    time: 60000, // time in milliseconds to destroy interaction
  });

  collector.on("collect", async (i) => {
    if (i.customId === "next") {
      currentIndex += itemsPerPage;
    } else if (i.customId === "previous") {
      currentIndex -= itemsPerPage;
    }

    await i.update(await buildReplyBody(topicName, questions, currentIndex));
  });

  // destroy pagination buttons on end interaction
  collector.on("end", async () => {
    await sentMessage.edit({ components: [] });
  });
}

/**
 * Builds the reply body for the topic page with embed.
 * @param {string} topicName - The name of the topic.
 * @param {Array<Question>} questions - The cached questions for the topic.
 * @param {number} currentIndex - The current index for pagination.
 * @returns {Promise<object>} The reply body containing content and navigation buttons.
 */
async function buildReplyBody(topicName, questions, currentIndex) {
  const { reply, hasNextPage, questionsLength } = await createContentResponse(
    topicName,
    questions,
    currentIndex
  );
  const replyBody = { embeds: [reply] };
  const buttons = createNavigationButtons(
    currentIndex,
    hasNextPage,
    questionsLength
  );
  if (buttons) replyBody.components = [buttons];
  return replyBody;
}

/**
 * Creates the content response for the topic page with an embed.
 * @param {string} topicName - The name of the topic.
 * @param {Array<Question>} questions - The cached questions for the topic.
 * @param {number} currentIndex - The current index for pagination.
 * @returns {Promise<{reply: EmbedBuilder, hasNextPage: boolean}>} The content embed and pagination state.
 */
async function createContentResponse(topicName, questions, currentIndex) {
  const { result, hasNextPage } = await getPageItems(
    topicName,
    questions,
    currentIndex
  );
  const questionsLength = result.length;
  const response = { hasNextPage, questionsLength };

  if (questionsLength <= 0) {
    response.reply = new EmbedBuilder()
      .setColor("#FFFF00")
      .setTitle("Não encontrei :(")
      .setDescription(
        `Não encontrei nenhuma questão relacionada ao assunto: ${topicName}`
      );
    return response;
  }

  const fields = buildQuestions(result, currentIndex);
  response.reply = new EmbedBuilder()
    .setColor("#0000FF")
    .setTitle(`Questões sobre: ${topicName}`)
    .setDescription(fields);

  return response;
}

/**
 * Builds the question list as a string for the embed.
 * @param {Array<Question>} questions - The questions to display.
 * @param {number} currentIndex - The current index for pagination.
 * @returns {string} The formatted list of questions.
 */
function buildQuestions(questions, currentIndex) {
  return questions
    .map((item, index) => {
      const cleanedDescription = item.description
        .replace(/!\[.*?\]\(.*?\)+/g, "") // Remove links
        .replace(/---/g, "")
        .replace(/\s{2,}/g, "\n\n");
      return `
**Questão #${currentIndex + index + 1}: ${item.title} - Nível: ${item.level}**
${cleanedDescription.split("## Entrada").at(0).trimStart().trimEnd()}
[Link para a questão](${item.link})
        `;
    })
    .join("\n");
}

/**
 * Fetches a page of questions from the topic service or cache.
 * @param {string} topicName - The name of the topic.
 * @param {Array<Question>} questions - The cached questions for the topic.
 * @param {number} currentIndex - The current index for pagination.
 * @returns {Promise<{result: Array<object>, hasNextPage: boolean}>} The fetched questions and pagination state.
 */
async function getPageItems(topicName, questions, currentIndex) {
  let hasNextPage = true;

  const isInMemoryCache = currentIndex < questions.length;
  if (isInMemoryCache) {
    return {
      result: searchInMemoryCache(questions, currentIndex),
      hasNextPage,
    };
  }

  const result = await topicoService.getQuestionsByTopic(
    topicName,
    currentIndex,
    itemsPerPage
  );
  if (result.length === 0 && currentIndex > 0) {
    currentIndex -= itemsPerPage;
    return {
      result: searchInMemoryCache(questions, currentIndex),
      hasNextPage: false,
    };
  }

  questions.push(...result);
  hasNextPage = result.length === itemsPerPage;

  return { result, hasNextPage };
}

/**
 * Searches for questions in the in-memory cache.
 * @param {Array<Question>} questions - The cached questions.
 * @param {number} currentIndex - The current index for pagination.
 * @returns {Array<Question>} The sliced array of questions for the current page.
 */
function searchInMemoryCache(questions, currentIndex) {
  return questions.slice(currentIndex, currentIndex + itemsPerPage);
}

/**
 * Creates navigation buttons for the pagination.
 * @param {number} currentIndex - The current index for pagination.
 * @param {boolean} hasNextPage - Whether there is a next page available.
 * @param {number} questionsLength - The number of questions
 * @returns {import('discord.js').ActionRowBuilder | null} The action row containing buttons or null if no buttons are needed.
 */
function createNavigationButtons(currentIndex, hasNextPage, questionsLength) {
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
