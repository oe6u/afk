const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
require('dotenv').config();

// سيرفر وهمي لـ Render
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('AFK Bot is Active!'));
app.listen(port, () => console.log(`🌐 Web server on port ${port}`));

const client = new Client({ checkUpdate: false });

const TOKEN = process.env.USER_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

async function joinVoice() {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);

        if (!channel || channel.type !== 'GUILD_VOICE') {
            console.error('❌ Voice channel not found!');
            return;
        }

        console.log(`Attempting to join ${channel.name}...`);
        await client.voice.joinChannel(channel);
        
        // تفعيل الـ Deafen
        await client.voice.setSelfDeaf(true);
        await client.voice.setSelfMute(true);
        
        console.log(`✅ Successfully joined and Deafened in ${channel.name}!`);
    } catch (error) {
        console.error('❌ Connection Error:', error.message);
        setTimeout(joinVoice, 30000);
    }
}

client.on('ready', async () => {
    console.log(`🚀 Logged in as ${client.user.tag}!`);
    await joinVoice();
});

// محاولة تسجيل الدخول بطريقة مباشرة
client.login(TOKEN).catch(err => {
    console.error('❌ LOGIN ERROR:', err);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled error:', error);
});
