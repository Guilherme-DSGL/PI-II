const { GoogleGenerativeAI } = require("@google/generative-ai");
const constants = require("../../utils/consts");
const AIService = require("./ai-service");
/**
 * @typedef {import('../../utils/prompt').Prompt} Prompt
 * @typedef {import('@google/generative-ai').GoogleGenerativeAI} GoogleGenerativeAI
 * @typedef {import('@google/generative-ai').GenerativeModel} GenerativeModel
 */

class GoogleGeminiService extends AIService {
  static #instance;
  #genAI;
  #model;

  /**
   * Construtor da classe.
   * @param {GoogleGenerativeAI} genAI - Instância da IA generativa do Google.
   * @private
   */
  constructor(genAI) {
    super();
    this.#genAI = genAI;
    this.#model = this.#genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Obtém a instância única do GoogleGeminiService.
   * @returns {GoogleGeminiService} Instância do serviço.
   */
  static getInstance() {
    if (!GoogleGeminiService.#instance) {
      console.log("No instancia");
      GoogleGeminiService.#instance = new GoogleGeminiService(
        new GoogleGenerativeAI(constants.GEMINI_API_KEY)
      );
    }
    return GoogleGeminiService.#instance;
  }

  /**
   * Faz a comunicação com a IA Google Gemini.
   * @param {string} query - A consulta para a IA.
   * @returns {Promise<object>} A resposta da IA do Google Gemini.
   */
  async communicate(query) {
    try {
      const result = await this.#model.generateContent([query]);
      return result.response;
    } catch (error) {
      console.error("Erro ao comunicar com Google Gemini:", error);
      throw error;
    }
  }
}

module.exports = GoogleGeminiService.getInstance();
