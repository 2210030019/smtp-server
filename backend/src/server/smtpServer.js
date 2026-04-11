import net from "net";
import { config } from "../config/config.js";
import { log } from "../utils/logger.js";
import { createSession } from "../core/sessionManager.js";
import { parseCommand } from "../core/commandParser.js";

export const startServer = () => {
    const server = net.createServer((socket) => {

        socket.write("220 mail.nodemail.local ESMTP Ready\r\n");

        const session = createSession();
        let command = "";

        socket.on('data', (data) => {
            command += data.toString();
            if (command.includes("\r\n") || command.includes("\n")) {
                const fullCommand = command.trim()
                command = ""
                const response = parseCommand(fullCommand, session);
                console.log(response);
                socket.write(`${response}\r\n`);
                if (fullCommand.startsWith("QUIT")) {
                    socket.end()
                }
            }
            console.log(session);
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