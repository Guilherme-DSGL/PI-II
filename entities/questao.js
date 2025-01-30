class Question {
  /**
   * @param {string} link
   * @param {string} title
   * @param {string} description
   * @param {string} level
   * @param {string} subject
   */
  constructor(link, title, description, level, subject) {
    this.subject = subject;
    this.title = title;
    this.link = link;
    this.description = description;
    this.level = level;
  }
}
module.exports = Question;
