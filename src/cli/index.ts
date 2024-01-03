import yargs from 'yargs';
import { Options } from 'yargs';
import {defaultFileData} from "./defaults";
import {Logger, LoggingSystem, LoggerSource} from "../shared/loggingSystem";
import {Invm} from "../engine/invm";

enum commands {
    ADD,
    REMOVE,
    FIND,
    LIST,
    CHECKIN,
    CHECKOUT
}
export class CliInterface {
    private testOptions: { [key: string]: Options; } = {
        run: {
            type: "boolean",
            default: true,
            hidden: true,
        },
        type: {
            type: "string",
            choices: ["allocation", "condition", "item", "package", "tag"]
        }
    };

    private logger: Logger;
    private invm: Invm;


    constructor() {
        const logPath = defaultFileData.mainDirectoryPath + defaultFileData.logDirectory + defaultFileData.logFile;
        LoggingSystem.configure(false, logPath);
        this.logger = LoggingSystem.getLogger(LoggerSource.CliMain);
        this.logger.trace('Started up logging system in CLI');
        this.invm = new Invm(defaultFileData);
    }

    public async startCli() {
        const argvv = yargs(process.argv.slice(2))
            .options(this.testOptions)
            .scriptName('invm')
            .usage('$0 <cmd> [args]')
            .command([{
                command: 'add <type> [value]',
                aliases: ['create', 'a', 'c'],
                describe: 'Add a <type> with [key=value]s to the inventory system',
                handler: (argv) => {
                    this.handle(argv, commands.ADD);
                },
            }, {
                command: 'remove <type> [value]',
                aliases: ['delete', 'r', 'd'],
                describe: 'Remove a <type> with a specific value',
                handler: (argv) => {
                    this.logger.debug(`REMOVE - ${JSON.stringify(argv)}`);
                },
            }, {
                command: 'find <type> [value]',
                aliases: ['search', 'query', 's', 'q', 'f'],
                describe: 'Find a <type> with a specific value',
                handler: (argv) => {
                    this.logger.debug(`FIND -  ${JSON.stringify(argv)}`);
                },
            }, {
                command: 'list <type> [value]',
                aliases: ['l'],
                describe: 'List a <type>',
                handler: (argv) => {
                    this.logger.debug(`LIST -  ${JSON.stringify(argv)}`);
                },
            }])
            .help()
            .recommendCommands()
            .demandCommand()
            .parseSync()
        if (!argvv['run']) {
            console.log('Closing due to run being false.');
            process.exit();
        }

        await this.invm.initializeInvStateFileData();
    }

    private handle(argv: yargs.ArgumentsCamelCase, command: commands ) {
        this.logger.debug(`${command} - ${JSON.stringify(argv)}`);
        if (command === commands.ADD) {

        }
    }
}

