import ILogger from "../ILogger";

export default class MultipleLogger implements ILogger {

    private loggers: ILogger[];

    public constructor(loggers: ILogger[]) {
        this.loggers = loggers;
    }

    public log(msg: string) {
        this.loggers.forEach(logger => {
            logger.log(msg);
        });
    }

    public info(msg: string) {
        this.loggers.forEach(logger => {
            logger.info(msg);
        });
    }

    public error(msg: string) {
        this.loggers.forEach(logger => {
            logger.error(msg);
        });
    }

    public warn(msg: string) {
        this.loggers.forEach(logger => {
            logger.warn(msg);
        });
    }
}
