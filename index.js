const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const express = require('express');

// --- Serveur pour Render et UptimeRobot ---
const app = express();
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot AKH est en ligne !'));
app.listen(port, () => console.log(`Serveur prêt sur port ${port}`));

// --- Configuration ---
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
    client.user.setActivity('DM pour le lien', { type: ActivityType.Watching });
    console.log("Bot AKH opérationnel !");
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // COMMANDE !dire [ID] [MESSAGE] (ID Utilisateur ou ID Salon)
    if (message.author.id === MON_ID && message.content.startsWith('!dire')) {
        const args = message.content.split(' ');
        const cibleId = args[1];
        const texte = args.slice(2).join(' ');

        try {
            const channel = await client.channels.fetch(cibleId).catch(() => null);
            if (channel) {
                await channel.send(texte);
                await message.reply(`✅ Envoyé dans le salon #${channel.name}`);
            } else {
                const user = await client.users.fetch(cibleId);
                await user.send(texte);
                await message.reply(`✅ Envoyé en DM à ${user.tag}`);
            }
        } catch (e) {
            await message.reply("❌ Erreur : ID introuvable.");
        }
        return;
    }

    // Réponse automatique en DM
    if (!message.guild) {
        console.log(`DM de : ${message.author.id}`);
        await message.author.send(`Salut, tiens le lien pour les matchs ➡️ ${LIEN_TELEGRAM}`);
    }
});

client.login(process.env.TOKEN);
