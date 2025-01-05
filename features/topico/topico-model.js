const csvParserServiceInstance = require("../../services/csv-service");

/**
 * @typedef {import('../../entities/questao.js')} Question
 * @typedef {import('../../services/csv-service.js')} CsvParserService
 */

class TopicoModel {
  /**
   * @type {TopicoModel | null}
   */
  static #instance;

  #csvService;

  /**
   * @param {CsvParserService} csvService - Instância do serviço de parser de CSV.
   * @private
   */
  constructor(csvService) {
    this.#csvService = csvService;
  }

  /**
   * Retorna a instância única da classe. Cria a instância caso ela ainda não exista.
   * @param {Function} csvServiceBuilder
   * @returns {TopicoModel} A instância única de TopicoModel.
   */
  static getInstance(csvServiceBuilder) {
    if (!TopicoModel.#instance) {
      TopicoModel.#instance = new TopicoModel(csvServiceBuilder()); // Passando o serviço corretamente
    }
    return TopicoModel.#instance;
  }
  /**
   * Obtém perguntas filtradas por assunto.
   * @param {string} subject - O assunto desejado.
   * @param {number} currentIndex - O índice atual para paginação.
   * @param {number} itensPerPage - A quantidade de itens por página.
   * @returns {Promise<Question[]>} - Uma promessa que resolve com as perguntas filtradas.
   */
  getQuestionBySubjectPaginated(subject, currentIndex, itensPerPage) {
    return new Promise((resolve, reject) => {
      try {
        const questions = [];
        let index = -1;
        this.#csvService
          .createReadStream()
          .on("data", (row) => {
            if (
              row.subject.toLowerCase().trim() === subject.toLowerCase().trim()
            ) {
              index++;
              if (
                index >= currentIndex &&
                index < currentIndex + itensPerPage
              ) {
                questions.push(row);
              }
            }
          })
          .on("end", () => {
            console.log(
              `CSV file successfully processed. found ${questions.length} questions`
            );
            resolve(questions);
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

module.exports = TopicoModel.getInstance(() => csvParserServiceInstance);
