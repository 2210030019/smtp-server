import fs from "fs";
import path from "path";
import { log } from "../utils/logger.js";

export const saveMail = (session)=>{
    const mail = {
        from : session.from,
        to : session.to,
        data : session.data,
    }

    const projectRoot = process.cwd();
    const fullPath = path.join(projectRoot, 'emails', `email-${Date.now()}.json`);
    // console.log(fullPath);
    try{
        fs.writeFileSync(fullPath, JSON.stringify(mail, null, 2));
        log("mail stored", "success")
    }
    catch(err){
        log(err, "error");
    }
}