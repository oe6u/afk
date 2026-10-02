const { Client } = require('discord.js-selfbot-v13');
require('dotenv').config();

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
        
        // الانضمام للروم
        await client.voice.joinChannel(channel);
        console.log(`✅ Successfully joined ${channel.name}.`);

        // --- الطريقة الصحيحة لتفعيل الـ Deafen و Mute في selfbot-v13 ---
        // نستخدم client.voice.setSelfDeaf والـ Mute
        try {
            await client.voice.setSelfDeaf(true);
            await client.voice.setSelfMute(true);
            console.log(`🎧 Deafen and Mute activated. Now staying AFK...`);
        } catch (deafError) {
            console.error('⚠️ Could not set Deafen/Mute, but joined the channel.');
        }

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

client.login(TOKEN).catch(err => {
    console.error('❌ Login failed:', err);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
