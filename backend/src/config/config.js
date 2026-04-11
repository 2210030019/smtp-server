import "dotenv/config";

export const config = {
    port : process.env.SMTP_PORT,
    domain : process.env.DOMAIN,
    host : process.env.SMTP_HOST
}