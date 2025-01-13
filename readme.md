# PI-II - Bot Discord para Estudos da OBI

Bem-vindo ao repositório do **PI-II**, um projeto criado para auxiliar os alunos de escolas das regiões de Crateús, Russas e arredores, que utilizam o Discord como plataforma de estudos para a Olimpíada Brasileira de Informática (OBI).

## 🎯 Objetivo

Desenvolver um bot no Discord com a biblioteca [discord.js](https://discord.js.org/) e integração à API Gemini (Google Bard). O bot ajudará os estudantes ao fornecer insights e dicas personalizadas para questões da OBI e ao facilitar a busca por questões relacionadas a temas específicos.

---

## 📜 Funcionalidades

### 1. **Buscar insights sobre questões específicas**
- O usuário pode enviar o **link de uma questão da OBI** por meio de um comando no bot.
- O bot busca a questão na base de dados e utiliza a **API Gemini** para retornar **dicas** e **insights** sobre como resolver a questão.

### 2. **Buscar questões por tema**
- O usuário pode enviar um **tema específico** como comando.
- O bot retorna uma lista de questões relacionadas ao tema buscado, com base nos dados armazenados na base.

---

## 🗄️ Estrutura da Base de Dados

A base de dados utilizada pelo bot armazenará informações previamente coletadas das questões da OBI, com os seguintes campos:

- `link` (URL da questão)
- `title` (título da questão)
- `description` (descrição completa da questão)
- `level` (fácil, médio, difícil)
- `subject` (Assunto da questão)

---

## 🛠️ Tecnologias Utilizadas

- **[Discord.js](https://discord.js.org/):** Biblioteca Node.js para criar bots no Discord.
- **API Gemini (Google Bard):** Para geração de insights e dicas personalizados.
- **Node.js:** Ambiente de execução.
- **Banco de Dados:** Estrutura para armazenar informações das questões da OBI.

---

## 📋 Requisitos do Projeto

1. **Comando para buscar insights de questões:**  
   O bot precisa processar o link enviado pelo usuário, localizar a questão correspondente na base de dados e consultar a API Gemini para retornar as dicas.

2. **Comando para buscar questões por tema:**  
   O bot precisa permitir que o usuário envie um tema e, em seguida, consultar a base de dados para retornar questões relacionadas.

## Rodando o projeto
   ### Configure o arquivo .env
``` env 
DISCORD_TOKEN= // Token do bot no discord developers
DISCORD_CLIENT_ID=  // Client da application no discord developers
DISCORD_GUILD_ID=  // Server que utilizará o bot
GEMINI_API_KEY=  // KEY DO GEMINI
```

   ### Configure o arquivo das questões 
   ``` 
      db-obi.csv
   ``` 

   O topo do csv deverá ter a seguinte linha: 
   ``` 
   link,title,description,level,subject
   ``` 
   Em seguida os dados das questões separados por "," vírgula

   ### Buildando os comandos para o seu servidor 

   ``` 
      npm run deploy-guild
   ``` 

   ### Buildando os comandos global (1h de tempo de propragação)

   ``` 
      npm run deploy-global
   ``` 

   ### Rodando o servidor 

   ``` 
      npm run dev
   ``` 
---
