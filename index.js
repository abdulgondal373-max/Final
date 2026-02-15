require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const express = require('express');

const app = express();
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot HIBOUX Opérationnel !'));
app.listen(port);

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
    console.log(`Bot connecté : ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // 1. Commande !lien dans un serveur
    if (message.content.toLowerCase() === '!lien' || message.content.toLowerCase() === 'lien') {
        await message.reply(`Salut ! Voici le lien des matchs ➡️ ${LIEN_TELEGRAM}`);
        return;
    }

    // 2. Commande de contrôle !dire (uniquement pour toi)
    if (message.author.id === MON_ID && message.content.startsWith('!dire')) {
        const args = message.content.split(' ');
        const cibleId = args[1];
        const texte = args.slice(2).join(' ');
        try {
            const user = await client.users.fetch(cibleId);
            await user.send(texte);
            await message.reply(`✅ Envoyé à ${user.tag}`);
        } catch (e) { await message.reply("❌ Erreur ID"); }
        return;
    }

    // 3. Réponse automatique en DM
    if (!message.guild) {
        console.log(`DM de ${message.author.tag} (${message.author.id})`);
        await message.author.send(`Salut, tiens le lien pour les matchs ➡️ ${LIEN_TELEGRAM}`);
    }
});

client.login(process.env.TOKEN);
