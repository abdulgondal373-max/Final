require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType, REST, Routes } = require('discord.js');
const express = require('express');

const app = express();
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot HIBOUX Slash Online!'));
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

// --- Enregistrement de la commande SLASH ---
const commands = [{
    name: 'lien',
    description: 'Affiche le lien du Telegram'
}];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.once('ready', async () => {
    try {
        // Enregistre la commande auprès de Discord
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('Commande /lien enregistrée avec succès !');
    } catch (error) {
        console.error(error);
    }
    client.user.setActivity('DM pour lien', { type: ActivityType.Watching });
});

// --- GESTION DES COMMANDES SLASH (C'est ce qui manquait !) ---
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'lien') {
        // On répond TOUT DE SUITE à Discord pour éviter le "ne répond plus"
        await interaction.reply({ content: `Salut ! Voici le lien ➡️ ${LIEN_TELEGRAM}` });
    }
});

// --- Gestion des messages (DMs et !dire) ---
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.author.id === MON_ID && message.content.startsWith('!dire')) {
        const args = message.content.split(' ');
        const cibleId = args[1];
        const texte = args.slice(2).join(' ');
        try {
            const user = await client.users.fetch(cibleId);
            await user.send(texte);
            await message.reply(`✅ Envoyé`);
        } catch (e) { await message.reply("❌ Erreur ID"); }
        return;
    }

    if (!message.guild) {
        await message.author.send(`Salut, tiens le lien ➡️ ${LIEN_TELEGRAM}`);
    }
});

client.login(process.env.TOKEN);
