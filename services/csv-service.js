const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

class CsvParserService {
  #csvFilePath;

  /**
   * Construtor da classe CsvParserService.
   * @param {string} csvFilePath - Caminho para o arquivo CSV.
   */
  constructor(csvFilePath) {
    this.#csvFilePath = csvFilePath || path.resolve(__dirname, "../db-obi.csv");
  }

  /**
   * Cria um stream de leitura do arquivo CSV e o processa com o csv-parser.
   * @returns {ReadableStream} O stream de leitura do CSV.
   */
  createReadStream() {
    return fs.createReadStream(this.#csvFilePath).pipe(csvParser());
  }
}

const csvParserServiceInstance = new CsvParserService();

// Exporta a instância única de CsvParserService
module.exports = csvParserServiceInstance;
