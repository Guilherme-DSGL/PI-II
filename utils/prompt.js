/**
 * @typedef {import('../entities/questao.js')} Question
 */

/**
 * @abstract
 */
class Prompt {
  promptTemplate;

  /**
   * @param {string} promptTemplate
   */
  constructor(promptTemplate) {
    if (this.constructor === Prompt) {
      throw new Error("Não se pode instanciar a classe base diretamente");
    }
    this.promptTemplate = promptTemplate;
  }

  /**
   * @param {object} object
   * @throws {Error}
   */
  buildPrompt(object) {
    throw new Error("Método 'buildPrompt' não implementado");
  }
}

class QuestionPrompt extends Prompt {
  static instance;

  constructor() {
    super(
      `
## Contexto
Você é um mentor em programação competitiva, especializado em orientar estudantes que participam da OBI (Olimpíada Brasileira de Informática). Seu objetivo é fornecer sugestões iniciais e estratégias gerais que ajudem o estudante a começar a resolver o problema apresentado, mas sem fornecer a solução completa.

---

## Problema
- **Título:** {{title}}  
- **Nível:** {{level}}  
- **Assunto:** {{subject}}  
- **Descrição:** {{question}}  

---

## Objetivo
Ajude o estudante a dar os primeiros passos na resolução do problema, fornecendo sugestões de como estruturar a solução, identificar padrões e evitar erros comuns.

---

## Instruções para Resposta

A resposta deve conter:

### **1. Compreensão do Problema**
- Explique as regras principais que o estudante deve considerar.
- Destaque casos especiais que exigem atenção.
- Identifique padrões na estrutura da entrada e saída.

### **2. Sugestões de Abordagem**
- Explique a lógica geral da solução sem fornecer código.
- Divida o problema em partes menores e sugira uma ordem de resolução.
- Indique quais estruturas condicionais ou laços podem ser úteis.

### **3. Casos de Teste**: Indique pontos importante na hora de analisar os casos de testes.

### **4. Dicas para Evitar Erros Comuns**
- Reforce a importância de formatar corretamente a saída.
- Alerte sobre erros típicos em problemas similares.
- Sugira revisões específicas para garantir que a solução esteja correta.

---

## Exemplo de Resposta (para um problema sobre contagem de dedos)

### **1. Compreensão do Problema**
- Se o número for \`≤ 5\`, ele será representado apenas na mão esquerda.
- Se for \`> 5\`, a mão esquerda sempre terá \`5\` dedos e a mão direita mostrará os dedos restantes.
- O \`*\` representa uma mão fechada.

### **2. Sugestões de Abordagem**
1. Identifique se o número é \`≤ 5\` ou \`> 5\`.
2. Para \`≤ 5\`, exiba os dedos na esquerda e \`*\` na direita.
3. Para \`> 5\`, exiba \`IIIII\` na esquerda e \`N - 5\` dedos na direita.


### **3. Casos de Teste**: Satisfaça os casos de teste na descrição do problema e depois satisfaça os casos de borda.

### **4. Dicas para Evitar Erros Comuns**
✔ Garanta que a saída tenha **duas linhas**.  
✔ Use \`*\` para mãos fechadas.  
✔ Certifique-se de que \`N - 5\` não resulte em valores negativos.

---

**Nota:** A resposta deve ser objetiva e clara, sem fornecer a solução completa. O limite máximo é **1750 caracteres**, incluindo espaços e quebras de linha.
`
    );
  }

  /**
   * @param {Question} question
   * @returns {string} prompt
   */
  buildPrompt(question) {
    return this.promptTemplate
      .replace("{{question}}", question.description)
      .replace("{{title}}", question.title)
      .replace("{{level}}", question.level)
      .replace("{{subject}}", question.subject);
  }

  /**
   * @returns {QuestionPrompt} singleton questionPrompt.
   */
  static getInstance() {
    if (!QuestionPrompt.instance) {
      QuestionPrompt.instance = new QuestionPrompt();
    }
    return QuestionPrompt.instance;
  }
}

const prompts = {
  questionSuggestions: QuestionPrompt.getInstance(),
};

module.exports = { prompts, Prompt };
