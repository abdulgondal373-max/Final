require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType } = require('dotenv'); // Utilise bien discord.js ici
const express = require('express');

const app = express();
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('AKH en ligne !'));
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
    client.user.setActivity('DM pour le lien', { type: ActivityType.Watching });
    console.log("Bot AKH prêt pour les serveurs et DMs !");
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // COMMANDE !dire [ID_SALON_OU_USER] [MESSAGE]
    if (message.author.id === MON_ID && message.content.startsWith('!dire')) {
        const args = message.content.split(' ');
        const cibleId = args[1];
        const texte = args.slice(2).join(' ');

        try {
            // Le bot cherche d'abord si c'est un salon
            const channel = await client.channels.fetch(cibleId).catch(() => null);
            if (channel) {
                await channel.send(texte);
                await message.reply(`✅ Envoyé dans le salon #${channel.name}`);
            } else {
                // Si c'est pas un salon, il cherche si c'est un utilisateur
                const user = await client.users.fetch(cibleId);
                await user.send(texte);
                await message.reply(`✅ Envoyé en DM à ${user.tag}`);
            }
        } catch (e) {
            await message.reply("❌ Erreur : ID introuvable ou permissions insuffisantes.");
        }
        return;
    }

    // Réponse automatique en DM
    if (!message.guild) {
        await message.author.send(`Salut, tiens le lien pour les matchs ➡️ ${LIEN_TELEGRAM}`);
    }
});

client.login(process.env.TOKEN);
