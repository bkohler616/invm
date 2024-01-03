import yargs from 'yargs';
import { Options } from 'yargs';
import {defaultFileData} from "./defaults";
import {Logger, LoggingSystem, LoggerSource} from "../engine/loggingSystem";

export class CliInterface {
    private testOptions: { [key: string]: Options; } = {
        p: {
            type: "string",
            default: false
        },
        ppp: {
            type: "string",
            default: false
        }
    };

    private logger: Logger;


    constructor() {
        const argv = yargs(process.argv.slice(2)).options(this.testOptions).parseSync();
        console.log('(%d,%d)', argv.p, argv.ppp);
        console.log(JSON.stringify(argv));
        const logPath = defaultFileData.mainDirectoryPath + defaultFileData.logDirectory;
        LoggingSystem.configure(false, logPath);
        this.logger = LoggingSystem.getLogger(LoggerSource.CliMain);
        this.logger.info('Starting up, parameters passed in are: ', argv);
    }
}

