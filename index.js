require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const express = require('express');

// --- Serveur pour Render et UptimeRobot ---
const app = express();
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot en ligne !'));
app.listen(port);

// --- Configuration ---
// Le TOKEN est maintenant récupéré de manière sécurisée sur Render
const MON_ID = "744871541715632138"; 
const LIEN_TELEGRAM = "https://t.me/+utGMq_cWFRplMTI0";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ],
    partials: [Partials.Channel]
});

client.once('ready', () => {
    client.user.setActivity('DM pour lien', { type: ActivityType.Watching });
    console.log(`Bot prêt et connecté : ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Commande de contrôle : !dire [ID] [Message]
    if (message.author.id === MON_ID && message.content.startsWith('!dire')) {
        const args = message.content.split(' ');
        const cibleId = args[1];
        const texte = args.slice(2).join(' ');

        try {
            const user = await client.users.fetch(cibleId);
            await user.send(texte);
            await message.reply(`✅ Message envoyé à ${user.tag}`);
        } catch (error) {
            await message.reply("❌ Erreur (ID invalide ou DMs fermés)");
        }
        return;
    }

    // Réponse automatique en DM
    if (!message.guild) {
        console.log(`Message de : ${message.author.tag} | ID : ${message.author.id}`);
        await message.author.send(`Salut, tiens le lien pour les matchs ➡️ ${LIEN_TELEGRAM}`);
    }
});

// Utilise la variable d'environnement définie sur Render
client.login(process.env.TOKEN);
