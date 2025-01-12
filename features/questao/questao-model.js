const GeminiAiService = require("../../services/ai-service/gemini-ai-service.js");
const AIService = require("../../services/ai-service/ai-service.js");
const csvParserServiceInstance = require("../../services/csv-service");
/**
 * @typedef {import('../../entities/questao.js')} Question
 * @typedef {import('../../utils/prompt.js').Prompt} Prompt
 * @typedef {import('../../services/csv-service.js')} CsvParserService
 */

class QuestaoModel {
  /**
   * @type {QuestaoModel | null}
   */
  static #instance;

  #iaService;
  #csvService;

  /**
   * @param {AIService} iaService - Instância do serviço de parser de CSV.
   * @param {CsvParserService} csvService
   * @private
   */
  constructor(iaService, csvService) {
    this.#iaService = iaService;
    this.#csvService = csvService;
  }

  /**
   * Retorna a instância única da classe. Cria a instância caso ela ainda não exista.
   * @param {Function} iaServiceBuilder
   * @param {Function} csvServiceBuilder
   * @returns {QuestaoModel} A instância única de TopicoModel.
   */
  static getInstance(iaServiceBuilder, csvServiceBuilder) {
    if (!QuestaoModel.#instance) {
      QuestaoModel.#instance = new QuestaoModel(
        iaServiceBuilder(),
        csvServiceBuilder()
      );
    }
    return QuestaoModel.#instance;
  }
  /**
   * Obtém sugestões da questão passada.
   * @param {Prompt} prompt - O índice atual para paginação.
   * @returns {Promise<object>} - Uma promessa que resolve com as perguntas filtradas.
   */
  getQuestionSugestion(prompt) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.#iaService.communicate(prompt);
        resolve(result.text());
      } catch (e) {
        reject(e);
      }
    });
  }
  /**
   * Obtém a questão pelo link.
   * @param {string} link
   * @returns {Promise<Question | null>} - Uma promessa que resolve com as perguntas filtradas.
   */
  getQuestionByLink(link) {
    return new Promise((resolve, reject) => {
      try {
        this.#csvService
          .createReadStream()
          .on("data", (row) => {
            if (row.link === link) {
              resolve(row);
            }
          })
          .on("end", () => {
            console.log(`CSV file successfully processed`);
            resolve(null);
          })
          .on("error", (error) => {
            reject(error);
          });
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = QuestaoModel.getInstance(
  () => GeminiAiService,
  () => csvParserServiceInstance
);
