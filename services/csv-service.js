const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

class CsvParserService {
  #csvFilePath;

  /**
   * @param {string} csvFilePath
   */
  constructor(csvFilePath) {
    this.#csvFilePath = csvFilePath || path.resolve(__dirname, "../db-obi.csv");
  }

  /**
   * @returns {fs.ReadStream} result.
   */
  createReadStream() {
    return fs.createReadStream(this.#csvFilePath).pipe(csvParser());
  }
}

const csvParserServiceInstance = new CsvParserService();

module.exports = csvParserServiceInstance;
