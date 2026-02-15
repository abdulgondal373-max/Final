require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.once('ready', async () => {
    try {
        console.log('Suppression des commandes...');
        await rest.put(Routes.applicationCommands(client.user.id), { body: [] });
        console.log('Fini ! Tu peux remettre le code de AKH.');
        process.exit();
    } catch (e) { console.error(e); }
});

client.login(process.env.TOKEN);
