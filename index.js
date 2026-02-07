require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel] // Nécessaire pour capter les messages privés (DMs)
});

client.once('ready', () => {
    console.log(`Bot en ligne !`);
});

client.on('messageCreate', async (message) => {
    // Ignore les messages des bots
    if (message.author.bot) return;

    // Si le message n'est pas dans un serveur (donc en DM)
    if (!message.guild) {
        try {
            await message.author.send("Salut, tiens le lien pour les matchs ➡️ https://t.me/+utGMq_cWFRplMTI0");
            console.log(`Réponse envoyée à ${message.author.tag}`);
        } catch (error) {
            console.error("Erreur lors de l'envoi du DM :", error);
        }
    }
});

client.login(process.env.TOKEN);
