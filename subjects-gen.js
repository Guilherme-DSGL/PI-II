const fs = require("fs");
const csvParserServiceInstance = require("./services/csv-service");

let subjects = [];

console.log("Gerando arquivo subjects.js...");

csvParserServiceInstance
  .createReadStream()
  .on("data", (row) => {
    if (!subjects.includes(row.subject)) {
      subjects.push(row.subject);
    }
  })
  .on("end", () => {
    const jsContent = `const subjects = ${JSON.stringify(
      subjects
    )};\n\nmodule.exports = subjects;`;
    fs.writeFileSync("subjects.js", jsContent);
    console.log('Arquivo "subjects.js" gerado com sucesso!');
  });
