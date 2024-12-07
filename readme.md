# PI-II - Bot Discord para Estudos da OBI

Bem-vindo ao repositório do **PI-II**, um projeto criado para auxiliar os alunos de escolas das regiões de Crateús, Russas e arredores, que utilizam o Discord como plataforma de estudos para a Olimpíada Brasileira de Informática (OBI).

## 🎯 Objetivo

Desenvolver um bot no Discord com a biblioteca [discord.js](https://discord.js.org/) e integração à API Gemini (Google Bard). O bot ajudará os estudantes ao fornecer insights e dicas personalizadas para questões da OBI e ao facilitar a busca por questões relacionadas a temas específicos.

---

## 📜 Funcionalidades

### 1. **Buscar insights sobre questões específicas**
- O usuário deve enviar o **link de uma questão da OBI** por meio de um comando no bot.
- O bot busca a questão na base de dados e utiliza a **API Gemini** para retornar **dicas** e **insights** sobre como resolver a questão.

### 2. **Buscar questões por tema**
- O usuário deve enviar um **tema específico** como comando.
- O bot retorna uma lista de questões relacionadas ao tema buscado, com base nos dados armazenados na base.

---

## 🗄️ Estrutura de Classes 

A base de dados utilizada pelo bot armazenará informações previamente coletadas das questões da OBI, com os seguintes campos:
Questão (Base de dados CSV)
- `link` (URL da questão)
- `titulo` (título da questão)
- `enunciado` (descrição completa da questão)
- `nível_da_questão` (fácil, médio, difícil)
- `tipo_de_questão` (categoria ou tipo)

Prompt
- `template` (template do prompt)
+ `build` (metodo para gerar a string do prompt, com os dados da questão)
---

## 🛠️ Tecnologias Utilizadas

- **[Discord.js](https://discord.js.org/):** Biblioteca Node.js para criar bots no Discord.
- **API Gemini (Google Bard):** Para geração de insights e dicas sobre as questões da OBI.
- **Node.js:** Ambiente de execução.
- **Base de dados:** Estrutura CSV que armazena os dados das questões da OBI.

---

## 📋 Requisitos do Projeto

1. **Comando para buscar insights de questões:**  
   O bot precisa processar o link enviado pelo usuário, localizar a questão correspondente na base de dados e consultar a API Gemini para retornar as dicas.

2. **Comando para buscar questões por tema:**  
   O bot precisa permitir que o usuário envie um tema e, em seguida, consultar a base de dados para retornar questões relacionadas.

---
