const { Client } = require('discord.js-selfbot-v13');
require('dotenv').config();

const client = new Client({
    checkUpdate: false // لمنع التنبيهات المزعجة في الـ Logs
});

// جلب البيانات من متغيرات Railway
const TOKEN = process.env.USER_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

// دالة الانضمام للروم مع نظام إعادة المحاولة الذكي
async function joinVoice() {
    try {
        // التأكد من وجود البيانات
        if (!TOKEN || !GUILD_ID || !VOICE_CHANNEL_ID) {
            console.error('❌ Missing Environment Variables! Please check USER_TOKEN, GUILD_ID, and VOICE_CHANNEL_ID in Railway.');
            return;
        }

        const guild = await client.guilds.fetch(GUILD_ID);
        const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);

        if (!channel || channel.type !== 'GUILD_VOICE') {
            console.error('❌ The provided ID is not a valid voice channel!');
            return;
        }

        console.log(`Attempting to join ${channel.name}...`);
        
        // الانضمام للروم الصوتية
        await client.voice.joinChannel(channel);
        console.log(`✅ Successfully joined ${channel.name}.`);

        // تفعيل الـ Deafen و Mute (الكتم والـ ديفن)
        try {
            await client.voice.setSelfDeaf(true);
            await client.voice.setSelfMute(true);
            console.log(`🎧 Deafen and Mute activated. Now staying AFK...`);
        } catch (deafError) {
            console.error('⚠️ Could not set Deafen/Mute, but joined the channel.');
        }

    } catch (error) {
        // في حال حدوث Timeout أو خطأ في الاتصال، يعيد المحاولة كل 30 ثانية
        console.error(`❌ Voice Connection Error: ${error.message}`);
        console.log('🔄 Retrying in 30 seconds...');
        setTimeout(joinVoice, 30000);
    }
}

client.on('ready', async () => {
    console.log(`🚀 Logged in as ${client.user.tag}!`);
    await joinVoice();
});

// تسجيل الدخول والتعامل مع الأخطاء
client.login(TOKEN).catch(err => {
    console.error('❌ Login failed. Check your TOKEN in Railway Variables:', err);
});

// منع البوت من الانهيار عند حدوث أخطاء غير متوقعة
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
