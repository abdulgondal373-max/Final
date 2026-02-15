require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const express = require('express');

const app = express();
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot HIBOUX en mode auto !'));
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
    console.log("Le bot est prêt et n'attend plus que des DMs !");
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // TA COMMANDE PRIVÉE (uniquement pour toi en DM avec le bot)
    if (message.author.id === MON_ID && message.content.startsWith('!dire')) {
        const args = message.content.split(' ');
        const cibleId = args[1];
        const texte = args.slice(2).join(' ');
        try {
            const user = await client.users.fetch(cibleId);
            await user.send(texte);
            await message.reply(`✅ Envoyé`);
        } catch (e) { await message.reply("❌ ID introuvable"); }
        return;
    }

    // RÉPONSE AUTOMATIQUE EN DM (pour tout le monde)
    if (!message.guild) {
        // Affiche l'ID du mec dans tes logs Render pour que tu puisses lui répondre
        console.log(`Message de ${message.author.tag} | ID: ${message.author.id}`);
        
        await message.author.send(`Salut, tiens le lien pour les matchs ➡️ ${LIEN_TELEGRAM}`);
    }
});

client.login(process.env.TOKEN);
