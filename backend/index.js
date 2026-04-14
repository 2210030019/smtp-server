import { startServer } from "./src/server/smtpServer.js";
import { sendMail } from "./src/server/smtpClient.js";

startServer();

setTimeout(async () => {
    await sendMail(
        "john@nodemail.local",
        "harshita@nodemail.local",
        "Subject: You won!\r\n\r\nCongratulations you won the competition!"
    )
}, 2000)