const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { apiKey, to, subject, html } = req.body;

  if (apiKey !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Faltan campos: to, subject o html' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Comunidad Jardines de Vicuña Mackenna" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
