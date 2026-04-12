import dns from "dns/promises";
import { log } from "../utils/logger.js";

export const resolveMx = async (domain) => {
    try {
        const mxRecords = await dns.resolveMx(domain);
        mxRecords.sort((a, b) => a.priority - b.priority);
        return mxRecords[0].exchange;
    }
    catch (err) {
        log(err, "error");
        return null;
    }
}