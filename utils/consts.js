require('dotenv').config(); 

module.exports = {
    TOKEN: process.env.DISCORD_TOKEN,
    BOT_ID: process.env.DISCORD_CLIENT_ID, 
    PRIVATE_SERVER_ID: process.env.DISCORD_GUILD_ID, //for tests in private discord 
};