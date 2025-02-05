/**
 * @typedef {import('../../utils/prompt').Prompt} Prompt
 */

class AIService {
  constructor() {
    if (this.constructor === AIService) {
      throw new Error("Não se pode instanciar a classe base diretamente");
    }
  }

  /**
   * Método para fazer a comunicação com a IA.
   * Esse método será implementado nas classes específicas para cada IA.
   * @param { string } query - A consulta para a IA.
   * @returns {Promise<object>} A resposta da IA.
   */
  async communicate(query) {
    throw new Error("Método 'communicate' não implementado");
  }
}

module.exports = AIService;
