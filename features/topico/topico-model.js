const csvParserService = require("../../services/csv-service");

/**
 * @typedef {import('../../entities/questao.js')} Question
 */

/**
 * Obtém perguntas filtradas por assunto.
 * @param {string} subject - O assunto desejado.
 * @returns {Promise<Question[]>} - Uma promessa que resolve com as perguntas filtradas.
 */
function getQuestionBySubjectPaginated(subject, currentIndex, itensPerPage) {
  return new Promise((resolve, reject) => {
    const questions = [];
    let index = -1;
    csvParserService
      .createReadStream()
      .on("data", (row) => {
        if (row.subject.toLowerCase().trim() === subject.toLowerCase().trim()) {
          index++;
          if (index >= currentIndex && index < currentIndex + itensPerPage) {
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
  });
}

const topicoModel = {
  getQuestionBySubjectPaginated,
};

module.exports = topicoModel;
