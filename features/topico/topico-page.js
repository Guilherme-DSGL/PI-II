const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const topicoService = require("./topico-service");

const itemsPerPageEmbed = 3;
const itemsPerPageDefault = 1;
/**
 * @typedef {import('../../entities/questao.js')} Question
 */

/**
 * Create a paginated topic page interaction with embeds or text replies.
 * @param {import('discord.js').Interaction} interaction - The interaction object from Discord.
 * @param {string} topicName - The name of the topic to fetch questions for.
 * @param {boolean} useEmbed - Flag to determine if the response should use embeds.
 */
async function createTopicPage(interaction, topicName, useEmbed = true) {
  const currentItemsPerPage = useEmbed
    ? itemsPerPageEmbed
    : itemsPerPageDefault;
  let currentIndex = 0;
  let questions = [];

  //Controi a mensagem
  const sentMessage = await interaction.editReply(
    await buildReplyBody(
      topicName,
      questions,
      currentIndex,
      useEmbed,
      currentItemsPerPage
    )
  );

  // pega apenas do usuário que criou a interação
  const filter = (i) => i.user.id === interaction.user.id;
  const collector = sentMessage.createMessageComponentCollector({
    filter,
    time: 60000, // tempo em milissegundos para destruir interação
  });

  // coleta os eventos de click nos botões
  collector.on("collect", async (i) => {
    if (i.customId === "next") {
      currentIndex += currentItemsPerPage;
    } else if (i.customId === "previous") {
      currentIndex -= currentItemsPerPage;
    }

    await i.update(
      await buildReplyBody(
        topicName,
        questions,
        currentIndex,
        useEmbed,
        currentItemsPerPage
      )
    );
  });

  // Destroi os botões de paginação ao encerrar a interação
  collector.on("end", async () => {
    await sentMessage.edit({ components: [] });
  });
}

/**
 * Builds the reply body for the topic page.
 * @param {string} topicName - The name of the topic.
 * @param {Array<Question>} questions - The cached questions for the topic.
 * @param {number} currentIndex - The current index for pagination.
 * @param {boolean} useEmbed - Flag to determine if the response should use embeds.
 * @param currentItemsPerPage
 * @returns {Promise<object>} The reply body containing content and navigation buttons.
 */
async function buildReplyBody(
  topicName,
  questions,
  currentIndex,
  useEmbed,
  currentItemsPerPage
) {
  const { reply, hasNextPage, questionsLength } = await createContentResponse(
    topicName,
    questions,
    currentIndex,
    useEmbed,
    currentItemsPerPage
  );

  const replyBody = useEmbed ? { embeds: [reply] } : { content: reply };
  const buttons = createNavigationButtons(
    currentIndex,
    hasNextPage,
    questionsLength
  );
  if (buttons) replyBody.components = [buttons];
  return replyBody;
}

/**
 * Creates the content response for the topic page.
 * @param {string} topicName - The name of the topic.
 * @param {Array<Question>} questions - The cached questions for the topic.
 * @param {number} currentIndex - The current index for pagination.
 * @param {boolean} useEmbed - Flag to determine if the response should use embeds.
 * @param currentItemsPerPage
 * @returns {Promise<{reply: EmbedBuilder|string, hasNextPage: boolean, questionsLength: number}>} The content response and pagination state.
 */
async function createContentResponse(
  topicName,
  questions,
  currentIndex,
  useEmbed,
  currentItemsPerPage
) {
  const { result, hasNextPage } = await getPageItems(
    topicName,
    questions,
    currentIndex,
    currentItemsPerPage
  );
  const questionsLength = result.length;
  const response = { hasNextPage, questionsLength };

  if (questionsLength <= 0) {
    response.reply = useEmbed
      ? new EmbedBuilder()
          .setColor("#FFFF00")
          .setTitle("Não encontrei :(")
          .setDescription(
            `Não encontrei nenhuma questão relacionada ao assunto: ${topicName}`
          )
      : `Não encontrei nenhuma questão relacionada ao assunto: ${topicName}`;
    return response;
  }

  const fields = buildQuestions(result, currentIndex, useEmbed);
  response.reply = useEmbed
    ? new EmbedBuilder()
        .setColor("#0000FF")
        .setTitle(`Questões sobre: ${topicName}`)
        .setDescription(fields)
    : fields;

  return response;
}

/**
 * Builds the question list as a string for the reply.
 * @param {Array<Question>} questions - The questions to display.
 * @param {number} currentIndex - The current index for pagination.
 * @param {boolean} useEmbed - Flag to determine if the response should use embeds.
 * @returns {string} The formatted list of questions.
 */
function buildQuestions(questions, currentIndex) {
  return questions
    .map((item, index) => {
      const cleanedDescription = item.description
        .replace(/!\[.*?\]\(.*?\)+/g, "") // Remove links
        .replace(/---/g, "")
        .replace(/\s{2,}/g, "\n\n"); // remove spaces
      return `## Questão #${currentIndex + index + 1}: ${
        item.title
      } - **Nível: ${item.level}**
### Descrição:
${cleanedDescription.split("## Entrada").at(0).trimStart().trimEnd()}

[🔗 Link para a questão](${item.link})
      `;
    })
    .join("\n");
}

/**
 * Fetches a page of questions from the topic service or cache.
 * @param {string} topicName - The name of the topic.
 * @param {Array<Question>} questions - The cached questions for the topic.
 * @param {number} currentIndex - The current index for pagination.
 * @param currentItemsPerPage
 * @returns {Promise<{result: Array<object>, hasNextPage: boolean}>} The fetched questions and pagination state.
 */
async function getPageItems(
  topicName,
  questions,
  currentIndex,
  currentItemsPerPage
) {
  let hasNextPage = true;

  const isInMemoryCache = currentIndex < questions.length;
  if (isInMemoryCache) {
    return {
      result: searchInMemoryCache(questions, currentIndex, currentItemsPerPage),
      hasNextPage,
    };
  }

  const result = await topicoService.getQuestionsByTopic(
    topicName,
    currentIndex,
    currentItemsPerPage
  );
  if (result.length === 0 && currentIndex > 0) {
    currentIndex -= currentItemsPerPage;
    return {
      result: searchInMemoryCache(questions, currentIndex, currentItemsPerPage),
      hasNextPage: false,
    };
  }

  questions.push(...result);
  hasNextPage = result.length === currentItemsPerPage;

  return { result, hasNextPage };
}
/**
 *
 * @param questions
 * @param currentIndex
 * @param currentItemsPerPage
 */
function searchInMemoryCache(questions, currentIndex, currentItemsPerPage) {
  return questions.slice(currentIndex, currentIndex + currentItemsPerPage);
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
