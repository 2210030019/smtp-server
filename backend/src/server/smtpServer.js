import net from "net";
import { config } from "../config/config.js";
import { log } from "../utils/logger.js";
import { createSession } from "../core/sessionManager.js";
import { parseCommand } from "../core/commandParser.js";
import { saveMail } from "../storage/mailStore.js";
import { checkMail } from "../services/spamFilter.js";
import { verifySign } from "../services/dkimSigner.js";

export const startServer = () => {
    const server = net.createServer((socket) => {

        socket.write("220 mail.nodemail.local ESMTP Ready\r\n");
        log(`New connection from ${socket.remoteAddress}`, "info");

        const session = createSession();
        let command = "";
        let signature = "";

        socket.on('data', (data) => {
            command += data.toString();
            if (command.startsWith("DKIM")) {
                const index = command.indexOf("MAIL");
                signature = command.substring(16, index);
                const result = command.slice(index);
                command = result;
            }
            if (command.includes("\r\n") || command.includes("\n")) {
                const fullCommand = command.trim();
                if (session.isDataMode) {
                    const lines = fullCommand.split("\n");
                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (trimmedLine === ".") {
                            if (!verifySign(session.from, session.to, session.data, signature)) {
                                log("Email rejected: DKIM verification failed", "error");
                                socket.write(`550 Message rejected: DKIM verification failed\r\n`);
                                socket.end();
                                return;
                            }
                            const spam = checkMail(session);
                            if (spam.isSpam) {
                                socket.write(`550 Message rejected: ${spam.reason}`);
                                log(`Spam email rejected: ${spam.reason}`, "error");
                                socket.end();
                                return;
                            }
                            saveMail(session);
                            session.isDataMode = false;
                            log(`Email accepted: ${session.from} → ${session.to}`, "success");
                            socket.write(`250 Message Accepted\r\n`);
                            command = "";
                        }
                        else {
                            session.data = session.data + trimmedLine + '\n';
                            command = "";
                        }
                    }
                }
                else {
                    const response = parseCommand(fullCommand, session);
                    // console.log(response);
                    socket.write(`${response}\r\n`);
                    command = ""
                    if (fullCommand.startsWith("QUIT")) {
                        socket.end()
                    }
                }
            }
        })

        socket.on('error', (error) => {
            log(error, "error");
        })
        socket.on('close', () => {
            log(`Connection closed from ${socket.remoteAddress}`, "info")
        })
    });

    server.listen(config.port, () => {
        log(`SMTP Server running on port ${config.port}`, "info");
    });

}