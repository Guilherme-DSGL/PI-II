const topicoModel = require("./topico-model");

/**
 * @typedef {import('../../entities/questao.js')} Question
 *  @typedef {import('./topico-model.js')} TopicoModel
 */

class TopicoService {
  /**
   * @type {TopicoService | null}
   */
  static #instance;

  /**
   * @type {TopicoModel}
   */
  topicoModel;

  /**
   * @param {TopicoModel} topicoModel
   * @private
   */
  constructor(topicoModel) {
    this.topicoModel = topicoModel;
  }

  /**
   * Retorna a instância única da classe. Cria a instância caso ela ainda não exista.
   * @param topicoModelBuilder
   * @returns {TopicoService} A instância única de TopicoService.
   */
  static getInstance(topicoModelBuilder) {
    if (!TopicoService.#instance) {
      TopicoService.#instance = new TopicoService(topicoModelBuilder());
    }
    return TopicoService.#instance;
  }

  /**
   * Função que retorna as questões de um determinado tópico.
   * @param {string} topicName - O nome do tópico.
   * @param {number} currentIndex - O índice atual para paginação.
   * @param {number} itensPerPage - A quantidade de itens por página.
   * @returns {Promise<Question[]>} Uma promessa que resolve em um array de questões.
   */
  async getQuestionsByTopic(topicName, currentIndex, itensPerPage) {
    try {
      const result = await this.topicoModel.getQuestionBySubjectPaginated(
        topicName,
        currentIndex,
        itensPerPage
      );
      return result;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

module.exports = TopicoService.getInstance(() => topicoModel);
