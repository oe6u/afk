const { Client } = require('discord.js-selfbot-v13');
require('dotenv').config();

const client = new Client({
    checkUpdate: false // إغلاق تنبيهات التحديث لمنع الأخطاء في الـ Logs
});

const TOKEN = process.env.USER_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

client.on('ready', async () => {
    console.log(`🚀 Logged in as ${client.user.tag}!`);
    
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);

        if (!channel || channel.type !== 'GUILD_VOICE') {
            console.error('❌ The provided ID is not a valid voice channel!');
            process.exit(1);
        }

        // الانضمام للروم الصوتية
        await client.voice.joinChannel(channel);
        console.log(`✅ Joined ${channel.name}.`);

        // تفعيل وضع الـ DEAFEN (كتم السماعات)
        // هذا يجعل الحساب يظهر كـ Deafen في الروم
        await client.user.setVoiceStatus(channel.id, {
            self_deaf: true, 
            self_mute: true 
        });

        console.log(`🎧 Deafen and Mute activated. Now staying AFK...`);
    } catch (error) {
        console.error('❌ Error during AFK process:', error);
    }
});

client.login(TOKEN).catch(err => {
    console.error('❌ Login failed. Check your TOKEN:', err);
});

// منع الـ Crash
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
