import yargs, {Options} from 'yargs';
import {defaultFileData} from './defaults';
import {Logger, LoggerSource, LoggingSystem} from '../shared/loggingSystem';
import {Invm} from '../engine/invm';
import {CommandType, Inquiry} from './inquiries/Inquiry';
import {requiredKeys} from '../engine/structure_interfaces';

const cliOptions: { [key: string]: Options; } = {
    ...requiredKeys,
    run: {
        type: 'boolean',
        default: true,
        hidden: true,
    },
    type: {
        type: 'string',
        choices: ['allocation', 'condition', 'item', 'package', 'tag'] as const
    },
};

export class CliInterface {
    private logger: Logger;
    private invm: Invm;
    private commandRun: CommandType | undefined;


    constructor() {
        const logPath = defaultFileData.mainDirectoryPath + defaultFileData.logDirectory + defaultFileData.logFile;
        LoggingSystem.configure(false, logPath);
        this.logger = LoggingSystem.getLogger(LoggerSource.CliMain);
        this.logger.trace('Started up logging system in CLI');
        this.invm = new Invm(defaultFileData);
    }

    public async startCli() {
        const commandLineArgs = await yargs(process.argv.slice(2))
            .scriptName('invm')
            .usage('$0 <cmd> <args>')
            .command([{
                command: 'add <type>',
                aliases: ['create', 'a', 'c'],
                // builder: (yargs) => {
                //     yargs.positional('type', {
                //         describe: 'The type of thing to add',
                //         type: 'string',
                //         choices: ['allocation', 'condition', 'item', 'package', 'tag']});
                //     yargs.option('name', {
                //         describe: 'The name of the <type> you want to add',
                //         type: 'string'
                //     });
                //     yargs.option('tags', {
                //         describe: 'List of tags to add',
                //         type: 'array'
                //     });
                //     yargs.option('allocation', {
                //         describe: 'Name or ID of allocation to assign',
                //         type: 'string'
                //     });
                //     yargs.option('importance', {
                //         describe: 'Level of importance',
                //         type: 'number',
                //         choices: [0,1,2,3,4,5,6,7,8,9,10]
                //     });
                //     yargs.option('sub', {
                //         describe: 'Sub allocation for <type> allocation',
                //         type: 'string'
                //     });
                //
                //     return yargs;
                // },
                describe: 'Add a <type> with [key:value]s to the inventory system',
                handler: async (argv) => {
                    this.commandRun = CommandType.ADD;
                    this.logger.debug(`ADD - ${JSON.stringify(argv)}`);
                    // await this.handle(argv, CommandType.ADD);
                },
            }, {
                command: 'remove <type> [value]',
                aliases: ['delete', 'r', 'd'],
                describe: 'Remove a <type> with a specific value',
                handler: (argv) => {
                    this.commandRun = CommandType.REMOVE;
                    this.logger.debug(`REMOVE - ${JSON.stringify(argv)}`);

                },
            }, {
                command: 'find <type> [value]',
                aliases: ['search', 'query', 's', 'q', 'f'],
                describe: 'Find a <type> with a specific value',
                handler: (argv) => {
                    this.commandRun = CommandType.FIND;
                    this.logger.debug(`FIND -  ${JSON.stringify(argv)}`);
                },
            }, {
                command: 'list <type> [value]',
                aliases: ['l'],
                describe: 'List a <type>',
                handler: (argv) => {
                    this.commandRun = CommandType.LIST;
                    this.logger.debug(`LIST -  ${JSON.stringify(argv)}`);
                },
            }])
            .help()
            .recommendCommands()
            .demandCommand()
            .options({
                ...cliOptions
            })
            .parseAsync();

        console.log(commandLineArgs);
        if (!this.commandRun) {
            return;
        }

        await this.handle(commandLineArgs, this.commandRun);

    }

    private async handle(argv: yargs.ArgumentsCamelCase, command: CommandType) {
        this.logger.debug(`handling ${command} - ${JSON.stringify(argv)}`);
        const builder = Inquiry.getInstance(command, argv);
        const results = await builder.execute();
        console.log(results);
        if (!argv.run) {
            console.log('Closing due to run being false.');
            return;
        }
        await this.invm.initializeInvStateFileData();
    }
}
