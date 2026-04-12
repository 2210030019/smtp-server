import { startServer } from "./src/server/smtpServer.js";
import { sendMail } from "./src/server/smtpClient.js";

startServer();

setTimeout(async () => {
    await sendMail(
        "john@nodemail.local",
        "harshita@nodemail.local",
        "Subject: Test\r\n\r\nThis is a test email!"
    )
}, 2000)