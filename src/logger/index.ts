class Logger {
    info(info: string){
        console.log(info);
    }
    error(errType: string, err: string | Error){
        console.warn(errType+":\n"+err);
    }
}

export default new Logger;