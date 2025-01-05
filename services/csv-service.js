const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

const csvFilePath = path.resolve(__dirname, "../db-obi.csv");

function createReadStream() {
  return fs.createReadStream(csvFilePath).pipe(csvParser());
}

const csvParserService = {
  createReadStream,
};

module.exports = csvParserService;
