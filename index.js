require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const express = require('express'); // Ajout du serveur

const app = express();
const port = process.env.PORT || 10000;

// Petit serveur pour Render et UptimeRobot
app.get('/', (req, res) => {
    res.send('Le bot est en ligne !');
});

app.listen(port, () => {
    console.log(`Serveur de maintien en éveil sur le port ${port}`);
});

// Ton code de Bot Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel]
});

client.once('ready', () => {
    console.log(`Bot prêt !`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) {
        try {
            await message.author.send("Salut, tiens le lien pour les matchs ➡️ https://t.me/+utGMq_cWFRplMTI0");
        } catch (error) {
            console.error("Erreur DM:", error);
        }
    }
});

client.login(process.env.TOKEN);

