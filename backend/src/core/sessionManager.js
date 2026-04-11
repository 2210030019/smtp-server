
export const createSession = () =>{
    const session = {
        step : "connected",
        from : null,
        to : null,
        data : "",
        isDataMode : false
    }
    return session;
}