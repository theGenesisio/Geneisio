import dotenv from "dotenv";
dotenv.config()
import JWT from 'jsonwebtoken'
import nodemailer from 'nodemailer'
// ** Helper for reauthenticating user access token
async function generateAccessToken(user) {
  return JWT.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
}
const mail = async (email, subject, html, verificationLink = null) => {
  const MAILER_USERNAME = process.env.MAILER_USERNAME;
  const MAILER_PASSWORD = process.env.MAILER_PASSWORD;
  const DKIM_PRIVATE_KEY = process.env.DKIM_PRIVATE_KEY;

  const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: MAILER_USERNAME,
      pass: MAILER_PASSWORD,
    },
    dkim: {
      domainName: 'genesisio.net',
      keySelector: 'default',
      privateKey: DKIM_PRIVATE_KEY,
    },
  });

  // Auto-detect bulk
  const isBulk = Array.isArray(email) && email.length > 1;
  const toField = isBulk ? '' : (Array.isArray(email) ? email[0] : email);

  try {
    const info = await transporter.sendMail({
      from: {
        name: "Genesisio",
        address: MAILER_USERNAME,
      },
      to: toField, // blank if bulk
      bcc: isBulk ? [...email, MAILER_USERNAME] : MAILER_USERNAME,
      subject: subject,
      html: verificationLink ? generateEmailHTMLVerification({ message: html, header: subject, verificationLink: verificationLink }) : generateWelcomeMail({ message: html, header: subject }),
    });

    // Check if *any* recipient was accepted (not just one)
    if (
      (Array.isArray(email) && info.accepted.some(addr => email.includes(addr))) ||
      (!Array.isArray(email) && info.accepted.includes(email))
    ) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error sending upgrade email:", error);
    return false;
  }
};
// ** Helper for checking if the password change is allowed
async function checkPasswordChange(startDate, interval = 21) {
  // Convert the input to a Date object
  const start = new Date(startDate);
  const today = new Date().toISOString(); // Use ISO format for consistent parsing

  // Check if the input date is valid
  if (isNaN(start)) {
    throw new Error("Invalid date format. Please provide a valid date.");
  }

  // Add interval days in milliseconds
  const resultDate = new Date(start.getTime() + interval * 24 * 60 * 60 * 1000).toISOString();
  if (new Date(today) >= new Date(resultDate)) {
    return true // Allow password change
  } else {
    return false // Disallow password change
  }
}
function generateEmailHTMLVerification(details) {
  const { message, header, verificationLink = null } = details;
  const messageHTML = message
    .map(item => `<p style="margin: 0 0 25px 0; white-space: pre-wrap;">${item}</p>`)
    .join('');
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; background-color: #1A283C;">
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
  <tr>
    <td>
      <!-- Hero Section -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" 
             style="background-image: url('https://www.genesisio.net/logo.png'); 
                    background-size: cover; 
                    background-position: center;
                    background-color: #1A283C; /* Fallback */">
        <tr>
          <td style="padding: 40px 25px; background-color: rgba(26,40,60,0.85);">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 25px;">
              <img src="https://www.genesisio.net/logo.png" alt="Genesisio" 
                   style="width: 40px; height: 40px; display: inline-block;">
            </div>

            <!-- Motto -->
            <p style="font-size: 11px; text-align: center; margin: 0 0 30px 0; 
                     letter-spacing: 1.8px; text-transform: uppercase; color: #FFD700;">
              A Smarter Approach To Trading & Investing
            </p>

            <!-- Header -->
            <h1 style="font-size: 26px; text-align: center; margin: 0 0 40px 0; 
                      color: #FFFFFF; line-height: 1.3; font-weight: 600;">
              ${header}
            </h1>

            <!-- Content -->
            <div style="font-size: 15px; line-height: 1.6; color: #d8d8d8;">
              ${messageHTML}
            </div>
            <div style="font-size: 15px; line-height: 1.6; color: #d8d8d8;">
              <p style="margin: 0 0 25px 0; white-space: pre-wrap;">If you did not request this email, please ignore it.</p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center;">
              <a href=${verificationLink}
                 style="display: inline-block; padding: 14px 40px; background-color: #FFD700; 
                        color: #1A283C; text-decoration: none; border-radius: 4px; font-size: 15px; 
                        font-weight: 700; border: 2px solid #FFD700;">
                Verify Your Email
              </a>
            </div>
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <table width="100%" border="0" cellspacing="0" cellpadding="30" style="background-color: #0E1724;">
        <tr>
          <td align="center">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="padding-right: 15px; vertical-align: middle;">
                  <img src="https://www.genesisio.net/Help.png" alt="Support" 
                       style="width: 40px; height: 45px;">
                </td>
                <td style="vertical-align: middle;">
                  <p style="font-size: 15px; margin: 0 0 8px 0; color: #FFD700;">
                    Have a question?
                  </p>
                  <a href="mailto:support@genesisio.net" 
                     style="color: #d8d8d8; text-decoration: none; font-size: 14px;">
                    Contact support
                  </a>
                </td>
              </tr>
            </table>
            <p style="font-size: 12px; color: #8794A8; margin: 25px 0 0 0;">
              © 2025 Genesisio. All rights reserved
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
function generateWelcomeMail(details) {
  const { message, header } = details;
  const messageHTML = message
    .map(item => `<p style="margin: 0 0 25px 0; white-space: pre-wrap;">${item}</p>`)
    .join('');
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; background-color: #1A283C;">
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
  <tr>
    <td>
      <!-- Hero Section -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" 
             style="background-image: url('https://www.genesisio.net/logo.png'); 
                    background-size: cover; 
                    background-position: center;
                    background-color: #1A283C; /* Fallback */">
        <tr>
          <td style="padding: 40px 25px; background-color: rgba(26,40,60,0.85);">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 25px;">
              <img src="https://www.genesisio.net/logo.png" alt="Genesisio" 
                   style="width: 40px; height: 40px; display: inline-block;">
            </div>

            <!-- Motto -->
            <p style="font-size: 11px; text-align: center; margin: 0 0 30px 0; 
                     letter-spacing: 1.8px; text-transform: uppercase; color: #FFD700;">
              A Smarter Approach To Trading & Investing
            </p>

            <!-- Header -->
            <h1 style="font-size: 26px; text-align: center; margin: 0 0 40px 0; 
                      color: #FFFFFF; line-height: 1.3; font-weight: 600;">
              ${header}
            </h1>

            <!-- Content -->
            <div style="font-size: 15px; line-height: 1.6; color: #d8d8d8;">
              ${messageHTML}
            </div>

            <!-- CTA Button -->
            <div style="text-align: center;">
              <a href="https://www.genesisio.net/auth/login"
                 style="display: inline-block; padding: 14px 40px; background-color: #FFD700; 
                        color: #1A283C; text-decoration: none; border-radius: 4px; font-size: 15px; 
                        font-weight: 700; border: 2px solid #FFD700;">
                Sign In to Your Account
              </a>
            </div>
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <table width="100%" border="0" cellspacing="0" cellpadding="30" style="background-color: #0E1724;">
        <tr>
          <td align="center">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="padding-right: 15px; vertical-align: middle;">
                  <img src="https://www.genesisio.net/Help.png" alt="Support" 
                       style="width: 40px; height: 45px;">
                </td>
                <td style="vertical-align: middle;">
                  <p style="font-size: 15px; margin: 0 0 8px 0; color: #FFD700;">
                    Have a question?
                  </p>
                  <a href="mailto:support@genesisio.net" 
                     style="color: #d8d8d8; text-decoration: none; font-size: 14px;">
                    Contact support
                  </a>
                </td>
              </tr>
            </table>
            <p style="font-size: 12px; color: #8794A8; margin: 25px 0 0 0;">
              © 2025 Genesisio. All rights reserved
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
export { generateAccessToken, mail, checkPasswordChange, generateEmailHTMLVerification, generateWelcomeMail };