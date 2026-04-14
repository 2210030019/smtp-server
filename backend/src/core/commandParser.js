export const parseCommand = (command, session) =>{
    if(command.startsWith("EHLO")){
        session.step="ehlo";
        return "250 Hello";
    }
    else if(command.includes("MAIL FROM")){
        const mail = command.split("<")[1].split(">")[0];
        session.from = mail;
        session.step="mail_from";
        return "250 OK";
    }
    else if(command.startsWith("RCPT TO")){
        const mail = command.split("<")[1].split(">")[0];
        session.to = mail;
        session.step="rcpt_to";
        return "250 OK";
    }
    else if(command.startsWith("DATA")){
        session.isDataMode = true;
        session.step= "data";
        return "354 Start input, end with a single dot";
    }
    else if(command.startsWith("QUIT")){
        return "221 Bye";
    }
    else{
        return "500 Command not recognized"
    }
}