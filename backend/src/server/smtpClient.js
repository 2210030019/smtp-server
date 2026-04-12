import { resolveMx } from "../services/mxLookup.js";
import { log } from "../utils/logger.js";
import net from "net";

export const sendMail = async (to, from, data) => {
    const domain = to.split("@")[1];
    const host = "localhost";
    // if (!host) {
    //     log("No MX Record found", "error");
    //     return;
    // }
    const socket = net.createConnection(25, "localhost");
    let step = 0;
    socket.on('data', (chunk) => {
        const response = chunk.toString().trim();
        console.log(response);
        if (step == 0 && response.startsWith("220")) {
            socket.write("EHLO nodemail.local\r\n");
            step = 1;
        }
        else if (step == 1 && response.startsWith("250")) {
            socket.write(`MAIL FROM:<${from}>\r\n`);
            step = 2;
        }
        else if (step == 2 && response.startsWith("250")) {
            socket.write(`RCPT TO:<${to}>\r\n`);
            step = 3;
        }
        else if (step == 3 && response.startsWith("250")) {
            socket.write("DATA\r\n");
            step = 4;
        }
        else if (step == 4 && response.startsWith("354")) {
            socket.write(`${data}\r\n.\r\n`);
            step = 5;
        }
        else if (step == 5 && response.startsWith("250")) {
            socket.write("QUIT\r\n");
            step = 6;
        }
        else if (step == 6 && response.startsWith("221")) {
            socket.end();
        }
    });
    socket.on('error', (error) => {
        log(error, "error");
    })



}