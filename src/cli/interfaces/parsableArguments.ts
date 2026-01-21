import yargs from 'yargs';

export interface ParsableArguments extends yargs.ArgumentsCamelCase {
    name?: string;
}