const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Noor Karam Elagamy | Data Analyst & Finance Professional',
    description: 'Professional portfolio of Noor Karam Elagamy — Data Analyst and Finance professional transforming complex data into actionable insights.'
  });
});

// Telegram Bot config
const TELEGRAM_BOT_TOKEN = '8901315393:AAGEq9kyw6CEOQWoE3IWP0B5Ud7pOUeo0K4';
const TELEGRAM_CHAT_ID = '1414327005';

// Contact form handler
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Format the Telegram message
  const telegramText = `📩 New Portfolio Message!\n\n👤 Name: ${name}\n📧 Email: ${email}\n\n💬 Message:\n${message}\n\n🕐 ${new Date().toLocaleString()}`;

  try {
    // Send to Telegram
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramText,
        }),
      }
    );

    if (telegramRes.ok) {
      console.log(`\n✅ Message from ${name} (${email}) sent to Telegram!\n`);
      res.json({ success: true, message: 'Message sent successfully!' });
    } else {
      const err = await telegramRes.json();
      console.error('Telegram API error:', err);
      res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
    }
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('index', {
    title: '404 - Page Not Found',
    description: 'Page not found'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio is running at http://localhost:${PORT}\n`);
});
