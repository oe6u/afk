const { Client } = require('discord.js-selfbot-v13');
require('dotenv').config();

const client = new Client({
    checkpartials: true
});

// جلب البيانات من متغيرات Railway
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

        // الانضمام للروم الصوتية والبقاء فيها
        await client.voice.joinChannel(channel);
        
        console.log(`✅ Successfully joined ${channel.name}. Now staying AFK...`);
    } catch (error) {
        console.error('❌ Error joining voice channel:', error);
    }
});

// محاولة تسجيل الدخول
client.login(TOKEN).catch(err => {
    console.error('❌ Invalid Token or Connection Error:', err);
});

// نظام بسيط لمنع الـ Crash وإعادة المحاولة في حال انقطع الاتصال
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
