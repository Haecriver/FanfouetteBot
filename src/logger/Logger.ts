import LoggerSingleton from "../singletons/LoggerSingleton";

const Logger = {
    log: (msg: string) => LoggerSingleton.getInstance().log(msg),
    info: (msg: string) => LoggerSingleton.getInstance().info(msg),
    error: (msg: string) => LoggerSingleton.getInstance().error(msg),
    warn: (msg: string) => LoggerSingleton.getInstance().warn(msg),
};

export default Logger;