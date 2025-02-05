# PI-II - Bot Discord para Estudos da OBI

Este projeto visa fornecer suporte a alunos de escolas de Crateús, Russas e região, utilizando o Discord como plataforma para os estudos da Olimpíada Brasileira de Informática (OBI).

## 🎯 Objetivo

Desenvolver um bot para o Discord utilizando a biblioteca [discord.js](https://discord.js.org/) para fornecer interações automatizadas. O bot irá se integrar à API Gemini para gerar insights sobre questões da OBI e permitirá aos usuários buscar questões por tema, otimizando o processo de preparação para a competição.

---

## 🤖 Ícone do Bot

<img src="./doc/botzin2.png" alt="Ícone do Bot" width="512" height="512">

---

## 🏗️ Arquitetura

A aplicação seguirá o padrão **MVC** (Model-View-Controller) com o objetivo de separar as responsabilidades do sistema e facilitar a manutenção.

![Arquitetura](./doc/arquitetura.png)

### **Camada de View/Interface:**
- Responsável pela interação com o usuário através de comandos e respostas no Discord.
- Implementada utilizando a biblioteca [discord.js](https://discord.js.org/), que fornece as ferramentas necessárias para criar e gerenciar as interações do usuário no Discord.

### **Camada de Controller:**
- Contém a lógica de negócios para processar os comandos do usuário.
- Utiliza [discord.js](https://discord.js.org/) para integrar a interação do usuário com a lógica de execução do bot.

### **Camada de Model:**
- Gerencia a lógica de dados e interage diretamente com a base de dados (neste caso, um arquivo CSV).
- Utiliza a biblioteca **csv-parser** para realizar a leitura e o processamento dos dados contidos no arquivo CSV, que armazena as questões e informações relacionadas à OBI.

### **Camada de Serviços:**
- Responsável por interagir com serviços externos, como a **API Gemini**, para buscar insights relacionados às questões da OBI.
- Utiliza a biblioteca **[google/generative-ai](https://ai.google.dev/)** para realizar chamadas à API e obter sugestões de resolução de questões.

### **Base de Dados:**
- O sistema armazena as questões e informações relacionadas à OBI em um arquivo **CSV**, que é processado e manipulado pelas camadas do modelo e controller.

---

## 📋 Requisitos do Projeto

1. **Base de dados CSV:**
   - O sistema deve ser capaz de carregar e processar um arquivo CSV contendo questões da OBI.

2. **Integração com API Gemini:**
   - O bot deve ser capaz de enviar dados sobre uma questão para a API Gemini e receber dicas e insights sobre a resolução da questão.

3. **Comando para buscar insights sobre questões:**  
   - O usuário deve enviar um **link de uma questão** do site da OBI para o bot.
   - O bot deve buscar a questão correspondente na base de dados e consultar a **API Gemini** para retornar dicas e insights sobre a questão.

4. **Comando para buscar questões por tema:**  
   - O bot deve permitir que o usuário envie um **tema** e retorne uma lista de questões relacionadas a esse tema a partir dos dados armazenados no arquivo CSV.

---

## 🛠️ Tecnologias e bibliotecas que irão ser utilizadas

- **[![Discord.js](https://img.icons8.com/color/20/discord-logo.png) Discord.js](https://discord.js.org/):** Biblioteca Node.js para criar bots no Discord.  
- **[![Node.js](https://img.icons8.com/fluency/20/node-js.png) Node.js](https://nodejs.org/):** Ambiente de execução JavaScript no lado do servidor.  
- **[![CSV](https://img.icons8.com/ios/20/ffffff/csv.png) csv-parser](https://www.npmjs.com/package/csv-parser):** Biblioteca para ler e processar arquivos CSV, utilizada para acessar dados das questões da OBI.  
- **[![Generative AI](https://img.icons8.com/fluency/20/artificial-intelligence.png) generative-ai](https://ai.google.dev/):** Biblioteca para integração com a API Gemini, utilizada para gerar insights sobre as questões da OBI.

---

## 📜 Funcionalidades

### 1. **Buscar insights sobre questões específicas**
- **Objetivo:** O bot deve ser capaz de fornecer insights e dicas sobre questões específicas da OBI.
- **Processo:**
  - O usuário envia um **link de uma questão** por meio do comando slash (`/`) no Discord.
  - O bot localiza a questão correspondente na base de dados (arquivo CSV).
  - O bot faz uma consulta à **API Gemini**, que retorna **insights** e **dicas** sobre como resolver a questão.

### 2. **Buscar questões por tema**
- **Objetivo:** O bot deve permitir a busca por questões relacionadas a um tema específico.
- **Processo:**
  - O usuário envia um **tema** via comando slash (`/`).
  - O bot consulta a base de dados (arquivo CSV) e retorna uma lista de questões relacionadas ao tema especificado.

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
DISCORD_TOKEN= // Token do bot no discord developers https://discord.com/developers/applications/[clientID]/bot
DISCORD_CLIENT_ID=  // Client da application no discord developers https://discord.com/developers/applications
DISCORD_GUILD_ID=  // Id do server de testes que utilizará o bot
GEMINI_API_KEY=  // KEY DO GEMINI // https://aistudio.google.com/app/apikey
```

   ### Configure o arquivo das questões 
   nome do arquivo:
   ``` 
   db-obi.csv
   ``` 

   O topo do csv deverá ter a seguinte linha abaixo, em seguida os dados das questões deverão ser separados por "," vírgula.
   ``` 
   link,title,description,level,subject
   ``` 

   ### Buildando os comandos para o seu servidor.
   Utiliza o DISCORD_GUILD_ID para atualizar o bot em um servidor de testes

   ``` 
      npm run deploy-guild
   ``` 

   ### Buildando os comandos global (em média 1h de tempo de propragação)

   ``` 
      npm run deploy
   ``` 

   ### Rodando o servidor
   Esse comando além de executar o servidor,
   ele gera o arquvio subject.js que é utiliziado para o autocomplete no comando /topico

   ``` 
      npm run dev
   ``` 

      
---

