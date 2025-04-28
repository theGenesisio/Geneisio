import dotenv from "dotenv";
dotenv.config()
import JWT from 'jsonwebtoken'
import nodemailer from 'nodemailer'
// ** Helper for reauthenticating user access token
async function generateAccessToken(user) {
    return JWT.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '168h' })
}
const mail = async (email, subject, html) => {
    // Use environment variables for credentials
    const MAILER_USERNAME = process.env.MAILER_USERNAME;
    const MAILER_PASSWORD = process.env.MAILER_PASSWORD;
    const DKIM_PRIVATE_KEY = process.env.DKIM_PRIVATE_KEY; // Ensure you have your DKIM key here
    // Configure Nodemailer with Namecheap's Private Email settings
    const transporter = nodemailer.createTransport({
        host: "mail.privateemail.com", // Namecheap's server, do not change
        port: 465,                    // SSL port; use 587 for TLS/STARTTLS if needed
        secure: true,                 // true for port 465 (SSL)
        auth: {
            user: MAILER_USERNAME,
            pass: MAILER_PASSWORD,
        },
        // Adding DKIM configuration
        dkim: {
            domainName: 'genesisio.net',  // Replace with your sending domain
            keySelector: 'default',        // Replace if you use a different selector
            privateKey: DKIM_PRIVATE_KEY,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: {
                name: "Genesisio",
                address: MAILER_USERNAME,
            },
            to: email,
            subject: subject,
            html: html,
        });

        // Check if the email was accepted by the SMTP server
        if (info.accepted.includes(email)) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error sending upgrade email:", error);
        return false;
    }
};

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
export { generateAccessToken, mail, checkPasswordChange }