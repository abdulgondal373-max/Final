require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType, REST, Routes } = require('discord.js');
const express = require('express');

// --- Serveur pour Render et UptimeRobot ---
const app = express();
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot HIBOUX actif !'));
app.listen(port);

// --- Configuration ---
const TOKEN = "MTQ3MjU3MTIxODgzMzE4MjgyMg.GEHH0I.L4LVDDIfFZMtCkHWzZ7b_xuNGV9uRLkm_q-N0k";
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

// --- Enregistrement de la commande /lien ---
const commands = [{ name: 'lien', description: 'Envoie le lien des matchs' }];
const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('Commande /lien enregistrée !');
    } catch (error) {
        console.error(error);
    }
    client.user.setActivity('DM pour lien', { type: ActivityType.Watching });
    console.log(`Bot prêt : ${client.user.tag}`);
});

// --- Gestion de la commande /lien ---
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'lien') {
        await interaction.reply(`Salut, tiens le lien pour les matchs ➡️ ${LIEN_TELEGRAM}`);
    }
});

// --- Gestion des messages (DMs et !dire) ---
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Commande !dire [ID] [Message] (Réservé à ton ID)
    if (message.author.id === MON_ID && message.content.startsWith('!dire')) {
        const args = message.content.split(' ');
        const cibleId = args[1];
        const texte = args.slice(2).join(' ');

        try {
            const user = await client.users.fetch(cibleId);
            await user.send(texte);
            await message.reply(`✅ Envoyé à ${user.tag}`);
        } catch (error) {
            await message.reply("❌ Erreur (ID invalide ou DMs fermés)");
        }
        return;
    }

    // Réponse auto en DM
    if (!message.guild) {
        console.log(`Message de ${message.author.tag} (${message.author.id})`);
        await message.author.send(`Salut, tiens le lien pour les matchs ➡️ ${LIEN_TELEGRAM}`);
    }
});

client.login(TOKEN);
