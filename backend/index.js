import { startServer } from "./src/server/smtpServer.js";
import { sendMail } from "./src/server/smtpClient.js";

startServer();

setTimeout(async () => {
    await sendMail(
        "john@nodemail.local",
        "harshita@nodemail.local",
        "Subject: Test Email\r\n\r\nHello,\r\nThis is a test email to check functionality."
    )
}, 2000)