require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const express = require('express');

// 1. Configuration du serveur pour Render et UptimeRobot
const app = express();
const port = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('Le bot est en ligne et actif !');
});

app.listen(port, () => {
    console.log(`Serveur de maintien en éveil lancé sur le port ${port}`);
});

// 2. Configuration du Bot Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel]
});

// 3. Statut personnalisé "Regarde DM pour lien"
client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
    
    client.user.setActivity('DM pour les liens', { type: ActivityType.Watching });
});

// 4. Réponse aux Messages Privés (DMs)
client.on('messageCreate', async (message) => {
    // Ignore les messages des autres bots
    if (message.author.bot) return;

    // Si le message est reçu en DM (pas de serveur)
    if (!message.guild) {
        try {
            await message.author.send("Salut, tiens le lien pour les matchs ➡️ https://t.me/+utGMq_cWFRplMTI0");
            console.log(`Réponse envoyée à ${message.author.tag}`);
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    }
});

client.login(process.env.TOKEN);
