// import {allKeysData} from '../../engine/structure_interfaces';
import {input} from '@inquirer/prompts';
import {ParsableArguments} from '../interfaces/parsableArguments';

export class Inquiry {
    private static instance: Inquiry;

    private commandType: CommandType;
    private providedInfo: ParsableArguments;
    private prompts: {
        message: string,
        inquirerType: string,
        inquirerData: string,
    }[] = [];
    private collectedResults: {[key: string]: string | number} = {};

    constructor(commandType: CommandType, providedInfo: ParsableArguments) {
        this.commandType = commandType;
        this.providedInfo = providedInfo;
        this.cleanupProvidedParameters();
    }

    public static getInstance(commandType?: CommandType, providedInfo?: ParsableArguments): Inquiry {
        if (commandType && providedInfo) {
            Inquiry.instance = new Inquiry(commandType, providedInfo);
        }
        if (!Inquiry.instance) {
            throw new Error('Instance not defined');
        }
        return Inquiry.instance;
    }

    public async execute() {
        this.cleanupProvidedParameters();

        for (const i of this.prompts) {
            if (i.inquirerType === 'input') {
                this.collectedResults[i.inquirerData] = await input({...i});
            }
        }

        return this.collectedResults;
    }

    private cleanupProvidedParameters() {
        if (!this.providedInfo.name && this.commandType !== CommandType.LIST) {
            this.prompts.push({
                message: `Enter the name of the ${this.providedInfo.type}`,
                inquirerType: 'input',
                inquirerData: 'name',
            });
        }
        if (this.providedInfo.name) { this.collectedResults['name'] = this.providedInfo.name; }
    }

    // private getArgData() {
    //     const argData = {};
    //     if (this.providedInfo.name) {
    //
    //     }
    // }

}

export enum CommandType {
    ADD = 1,
    REMOVE,
    FIND,
    LIST,
    CHECKIN,
    CHECKOUT
}
