import express from "express";
import { startServer } from "./src/server/smtpServer.js";
import { sendMail } from "./src/server/smtpClient.js";
import "dotenv/config";
import fs from "fs";

const app = express();

app.use(express.json());

startServer();

app.post('/send-mail', async (req, res) => {
    const { from, to, data } = req.body;
    if (!from || !to || !data) {
        return res.status(400).json({ error: "Missing fields" })
    }
    await sendMail(from, to, data);
    res.json({ success: "mail sent successfully" });
})

app.get('/inbox', async (req, res) => {
    try {
        const files = fs.readdirSync(`${process.cwd()}/emails`);
        const mails = files.map(file => {
            const data = fs.readFileSync(`${process.cwd()}/emails/${file}`, 'utf8');
            return JSON.parse(data);
        })
        res.json(mails);
    }
    catch {
        res.status(500).json({error : "Failed to read inbox"});
    }
})

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server running on port ${process.env.EXPRESS_PORT}`);
})

// setTimeout(async () => {
//     await sendMail(
//         "john@nodemail.local",
//         "harshita@nodemail.local",
//         "Subject: Test Email\r\n\r\nHello,\r\nThis is a test email to check functionality."
//     )
// }, 2000)