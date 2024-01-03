import yargs from 'yargs';
import { Options } from 'yargs';
import {defaultFileData} from "./defaults";
import {Logger, LoggingSystem, LoggerSource} from "../shared/loggingSystem";
import {Invm} from "../engine/invm";

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
    private invm: Invm;


    constructor() {
        const logPath = defaultFileData.mainDirectoryPath + defaultFileData.logDirectory + defaultFileData.logFile;
        LoggingSystem.configure(false, logPath);
        this.logger = LoggingSystem.getLogger(this, LoggerSource.CliMain);
        this.logger.trace('Started up logging system');

        this.invm = new Invm(defaultFileData);
        const argvv = yargs(process.argv.slice(2))
            .options(this.testOptions)
            .scriptName('invm')
            .usage('$0 <cmd> [args]')
            .command({
                command: 'add <type> [value]',
                describe: 'description',
                builder: (yargs) => yargs.default('value', 'true'),
                handler: (argv) => {
                    console.log(`setting ${argv.type}`);
                },
            })
            .help()
            .recommendCommands()
            .demandCommand()
            .argv;
        console.log('Hi!');
        console.log(argvv);
    }

    public async startCli() {
        // const argv = yargs(process.argv.slice(2)).options(this.testOptions).parseSync();
        // console.log('(%d,%d)', argv.p, argv.ppp);
        // console.log(JSON.stringify(argv));
        //
        // this.logger.info('Starting up, parameters passed in are: ', argv);
        await this.invm.initializeInvStateFileData();
    }
}

