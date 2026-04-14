import {generateKeyPairSync} from "crypto";
import fs from "fs";
import path from "path";

const {publicKey, privateKey} = generateKeyPairSync('rsa',{
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: "pem"
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
},)

const rootPath = path.join(process.cwd(), 'keys');
fs.writeFileSync(`${rootPath}/public.pem`, publicKey);
fs.writeFileSync(`${rootPath}/private.pem`, privateKey);