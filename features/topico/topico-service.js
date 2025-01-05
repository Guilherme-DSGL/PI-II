const topicoModel = require("./topico-model");
/**

 * @typedef {import('../../entities/questao.js')} Question

 * Função que retorna as questões de um determinado tópico.
 * @param {string} topicName - O nome do tópico.
 * @returns {Promise<Question[]>} Uma promessa que resolve em um array de questões.
 */
async function topic(topicName, currentIndex, itensPerPage) {
  try {
    const result = await topicoModel.getQuestionBySubjectPaginated(
      topicName,
      currentIndex,
      itensPerPage
    );
    console.log(result);
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

const topicoService = {
  topic,
};

module.exports = topicoService;
