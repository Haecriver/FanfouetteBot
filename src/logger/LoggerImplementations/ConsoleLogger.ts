import ILogger from "../ILogger";

// tslint:disable: no-console
export default class ConsoleLogger implements ILogger {

    public log(msg: string) {
        console.log(msg);
    }

    public info(msg: string) {
        console.info(msg);
    }

    public error(msg: string) {
        console.error(msg, new Error().stack);
    }

    public warn(msg: string) {
        console.warn(msg);
    }
}
// tslint:enable: no-console
