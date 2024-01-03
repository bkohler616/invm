import * as log4js from 'log4js';
import {Level, Logger} from "log4js";

type AnyFunction = (...args: any[]) => any;

type logType = {
    level?: Level,
    [prop: string]: any
};

export abstract class LoggingSystem {
    private static storeTemp = true;
    private static storeTempBuffer: logType[];
    public static configure(storeTemp = true, fileLocation?: string) {
        const logConfiguration: log4js.Configuration = {
            appenders: {
                out: {
                    type: "stdout"
                }
            },
            categories: {
                default: {
                    appenders: ["out", "file"],
                    level: "debug",
                }
            }
        }

        if (fileLocation) {
            logConfiguration.appenders.file = {
                type: 'file',
                filename: fileLocation,
                maxLogSize: 10 * 1024 * 1024, // = 10Mb
                backups: 5, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
            }
        }
        log4js.configure(logConfiguration);
        if (this.storeTempBuffer) {
            this.storeTemp = false;
            const bufferedLogger = log4js.getLogger('startup-buffer-logs');
            this.storeTempBuffer.forEach((i) => {
                // Holy god I hated this. Spreads are dumb for some reason right now. Have to do it the stupid way.
                const newObj = {...i};
                const level = i.level || 'ERROR';
                delete newObj.level;
                bufferedLogger.log(level, ...Object.values(newObj));
            });
        }

        this.storeTemp = storeTemp;
        this.storeTempBuffer = [];
    }

    public static getLogger(logger: LoggerSource) {
        if (!log4js.isConfigured()) {
            this.configure();
        }
        const newLogger = log4js.getLogger(logger);
        newLogger.log = this.wrap(newLogger.log);
        return newLogger;
    }

    /**
     * Wrap a function, store data into @storeTempBuffer if @storeTemp is set for flushing later.
     * @param fn
     */
    private static wrap = <Func extends AnyFunction>(fn: Func): ((...args: Parameters<Func>) => ReturnType<Func>) => {
        return (...args: Parameters<Func>): ReturnType<Func> => {
            if (this.storeTemp) {

            }
            return fn(...args);
        };
    };
}


export interface LogEvent {
    logger: Logger,
    event: string,
    message: string
}

export enum LoggerSource {
    JsonFileManager = 'JsonFileManager',
    ZipFileManager = 'ZipFileManager',
    CliMain = 'CLI-Main',
}

export {Logger} from "log4js";
