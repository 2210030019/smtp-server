
export const checkMail = (session)=>{
    const spam = {
        isSpam : false,
        reason : null
    };
    if(!session.from || session.from==""){
        spam.isSpam=true;
        spam.reason="Missing sender";
    }
    else if(!session.to || session.to==""){
        spam.isSpam=true;
        spam.reason="Missing reciever";
    }
    else if(!session.data || session.data==""){
        spam.isSpam=true;
        spam.reason="Data missing";
    }
    else if(session.data.includes("lottery") || session.data.includes("urgent") || session.data.includes("free money") || session.data.includes("click here")){
        spam.isSpam=true;
        spam.reason="Suspicious content";
    }
    else if(session.from.includes("spam.com") || session.from.includes("tempmail.com")){
        spam.isSpam=true;
        spam.reason="Suspicious sender";
    }
    return spam;

}