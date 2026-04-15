import fs from "fs";
import crypto from "crypto";

const privateKey = fs.readFileSync(`${process.cwd()}/keys/private.pem`).toString();
const publicKey = fs.readFileSync(`${process.cwd()}/keys/public.pem`).toString();

export const signEmail = (from, to, data)=>{
    const sign = crypto.createSign('RSA-SHA256');
    from=from.replace(/[\r]/g, "");
    to=to.replace(/[\r]/g, "");
    data=data.replace(/[\r]/g, "");
    const dataToSign= `from:${from}\nto:${to}\ndata:${data}\n`;
    sign.update(dataToSign);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');
    // console.log("signEmail:" ,dataToSign);
    return `DKIM-Signature: ${signature}`;
}

export const verifySign = (from, to, data, signature)=>{
    const verify = crypto.createVerify('RSA-SHA256');
    const dataToSign= `from:${from}\nto:${to}\ndata:${data}`;
    // console.log("verifySign:" ,dataToSign);
    verify.update(dataToSign);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');

}