const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
require('dotenv').config();

// --- إنشاء سيرفر وهمي لـ Render ---
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is online and AFK! 🚀');
});

app.listen(port, () => {
    console.log(`🌐 Web server is running on port ${port}`);
});
// ---------------------------------

const client = new Client({
    checkUpdate: false
});

const TOKEN = process.env.USER_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

async function joinVoice() {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);

        if (!channel || channel.type !== 'GUILD_VOICE') {
            console.error('❌ Invalid voice channel ID!');
            return;
        }

        console.log(`Attempting to join ${channel.name}...`);
        await client.voice.joinChannel(channel);
        console.log(`✅ Successfully joined ${channel.name}.`);

        await client.voice.setSelfDeaf(true);
        await client.voice.setSelfMute(true);
        console.log(`🎧 Deafen and Mute activated. Now staying AFK...`);

    } catch (error) {
        console.error('❌ Voice Connection Error:', error.message);
        console.log('🔄 Retrying in 30 seconds...');
        setTimeout(joinVoice, 30000);
    }
}

client.on('ready', async () => {
    console.log(`🚀 Logged in as ${client.user.tag}!`);
    await joinVoice();
});

// تنظيف التوكن من أي مسافات أو علامات اقتباس زائدة قد تأتي من Render
const cleanToken = TOKEN ? TOKEN.trim().replace(/['"]/g, '') : null;

if (!cleanToken) {
    console.error('❌ No TOKEN provided in Environment Variables!');
    process.exit(1);
}

client.login(cleanToken).catch(err => {
    console.error('❌ Login failed. Detailed Error:', err);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
