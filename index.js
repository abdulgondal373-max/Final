const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const express = require('express');

const app = express();
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('AKH Contrôle Total Online'));
app.listen(port);

const MON_ID = "744871541715632138"; // Ton ID
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
    console.log("AKH prêt pour les réponses ciblées !");
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.author.id === MON_ID && message.content.startsWith('!dire')) {
        const args = message.content.split(' ');
        const cibleId = args[1]; // ID du salon
        const messageId = args[2]; // ID du message (si tu veux répondre)
        
        const attachments = message.attachments.map(a => a.url);

        try {
            const channel = await client.channels.fetch(cibleId);
            
            // On vérifie si le deuxième argument est un ID de message (17 chiffres ou plus)
            if (messageId && /^\d{17,19}$/.test(messageId)) {
                const texteReponse = args.slice(3).join(' ');
                const msgCible = await channel.messages.fetch(messageId);
                
                await msgCible.reply({
                    content: texteReponse || null,
                    files: attachments
                });
                await message.reply(`✅ Répondu au message dans #${channel.name}`);
            } else {
                // Sinon, envoi normal dans le salon
                const texteNormal = args.slice(2).join(' ');
                await channel.send({
                    content: texteNormal || null,
                    files: attachments
                });
                await message.reply(`✅ Envoyé dans #${channel.name}`);
            }
        } catch (e) {
            await message.reply("❌ Erreur : ID Salon ou ID Message incorrect.");
        }
        return;
    }

    if (!message.guild) {
        await message.author.send(`Salut, tiens le lien pour les matchs ➡️ ${LIEN_TELEGRAM}`);
    }
});

client.login(process.env.TOKEN);
