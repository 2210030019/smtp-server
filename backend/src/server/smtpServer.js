import net from "net";
import { config } from "../config/config.js";
import { log } from "../utils/logger.js";
import { createSession } from "../core/sessionManager.js";
import { parseCommand } from "../core/commandParser.js";
import { saveMail } from "../storage/mailStore.js";
import { checkMail } from "../services/spamFilter.js";

export const startServer = () => {
    const server = net.createServer((socket) => {

        socket.write("220 mail.nodemail.local ESMTP Ready\r\n");

        const session = createSession();
        let command = "";

        socket.on('data', (data) => {
            command += data.toString();
            console.log(command);
            if (command.includes("\r\n") || command.includes("\n")) {
                const fullCommand = command.trim();
                if (session.isDataMode) {
                    const lines = fullCommand.split("\n");
                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        // console.log(`data is ${line}`);
                        if (trimmedLine === ".") {
                            const spam= checkMail(session);
                            if(spam.isSpam){
                                socket.write(`550 Message rejected: ${spam.reason}`);
                                socket.end();
                                return;
                            }
                            saveMail(session);
                            session.isDataMode = false;
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
            // log(`Session updated: ${JSON.stringify(session)}`, "info")
            // log(command, "info");
        })

        socket.on('error', (error) => {
            log(error, "error");
        })
    });

    server.listen(config.port, () => {
        log(`SMTP Server running on port ${config.port}`, "info");
    });

}