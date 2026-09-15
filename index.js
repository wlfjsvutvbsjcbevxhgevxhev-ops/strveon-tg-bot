require('dotenv').config();

const express = require('express');
const bot = require('./src/creatorBot');
const botManager = require('./src/botManager');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ STRVEON Bot Builder يعمل. هذا البوت يُدار بالكامل من داخل تيليجرام.');
});
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, async () => {
  console.log(`🚀 سيرفر الفحص الصحي يعمل على المنفذ ${PORT}`);

  try {
    await botManager.startAllActive();
  } catch (err) {
    console.error('خطأ أثناء تشغيل البوتات النشطة تلقائياً:', err.message);
  }

  await bot.launch();
  console.log('🤖 بوت الصانع (Creator Bot) يعمل الآن ويستقبل الرسائل.');
});

process.once('SIGINT', () => {
  bot.stop('SIGINT');
  botManager.stopAll();
  process.exit(0);
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  botManager.stopAll();
  process.exit(0);
});
