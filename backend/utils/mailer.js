const nodemailer = require("nodemailer");


// Configura il trasportatore SMTP per inviare email tramite il server specificato nelle variabili d'ambiente.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


// Invia un'email utilizzando il trasportatore configurato. Accetta un oggetto con destinatario, oggetto e contenuto HTML.
async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
}

module.exports = { sendEmail };
