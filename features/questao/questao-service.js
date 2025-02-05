const { prompts } = require("../../utils/prompt.js");
const questaoModel = require("./questao-model");

/**
 * @typedef {import('../../entities/questao.js')} Question
 *  @typedef {import('./questao-model.js')} QuestaoModel
 */

class QuestaoService {
  /**
   * @type {QuestaoService | null}
   */
  static #instance;

  /**
   * @type {QuestaoModel}
   */
  questaoModel;

  /**
   * @param {QuestaoModel} questaoModel
   * @private
   */
  constructor(questaoModel) {
    this.questaoModel = questaoModel;
  }

  /**
   * Retorna a instância única da classe. Cria a instância caso ela ainda não exista.
   * @param {Function} questaoModelBuilder
   * @returns {QuestaoService} A instância única de QuestaoService.
   */
  static getInstance(questaoModelBuilder) {
    if (!QuestaoService.#instance) {
      QuestaoService.#instance = new QuestaoService(questaoModelBuilder());
    }
    return QuestaoService.#instance;
  }

  /**
   * Função que retorna as questões de um determinado tópico.
   * @param {Question} question
   * @returns {Promise<string>} Uma promessa que retorna a resposta da IA.
   */
  async getQuestionSuggestion(question) {
    try {
      const prompt = prompts.questionSuggestions.buildPrompt(question);
      const result = await this.questaoModel.getQuestionSugestion(prompt);
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  /**
   * Função que retorna as questões de um determinado tópico.
   * @param {string} link
   * @returns {Promise<Question | null>} Uma promessa que retorna a questão ou null.
   */
  async getQuestionByLink(link) {
    try {
      const result = await this.questaoModel.getQuestionByLink(link);
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

module.exports = QuestaoService.getInstance(() => questaoModel);
