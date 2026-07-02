const { sendEmail } = require("./mailer");
const { htmlContent } = require("./emailTemplates");

async function sendProjectEmail(user, type, options = {}) {
  // Se c'è un token va alla pagina di setup, altrimenti va alla dashboard (es. /projects o la home)
  const redirectLink = options.token 
    ? `${process.env.FRONTEND_URL}/setup?token=${options.token}`
    : `${process.env.FRONTEND_URL}/login`; 

  return sendEmail({
    to: user.email,
    subject: options.subject || "Notifica da Test Tracker",
    html: htmlContent[type](user, redirectLink, options)
  });
}
module.exports = { sendProjectEmail };
