import {InventoryState} from "../inv_state_manager";
import 'fs';
import * as fs from "fs";
import {LoggerSource, LoggingSystem, Logger} from "../loggingSystem";

export class JsonFileManager {
    /**
     * Load a file into memory
     */

    private static defaultFileNames: fileNames = {
        allocations: 'allocations.json',
        checkins: 'checkins.json',
        checkouts: 'checkouts.json',
        conditions: 'conditions.json',
        items: 'items.json',
        packages: 'packages.json',
        tags: 'tags.json'
    }

    private readonly declaredFileNames: fileNames = JsonFileManager.defaultFileNames;
    private readonly directories: directoryNames;
    private logger: Logger;

    constructor(folderNames: directoryNames, requestedFileNames: fileNames) {
        this.declaredFileNames = {
            ...this.declaredFileNames,
            ...requestedFileNames
        };

        this.directories = folderNames;
        this.logger = LoggingSystem.getLogger(LoggerSource.JsonFileManager);
    }

    public initialize(): Promise<void> {
        this.logger = LoggingSystem.getLogger(LoggerSource.JsonFileManager);
        this.logger.info('Initializing file structure');
        return this.createDirectory("mainPath", this.directories.mainPath).then(() => {
            const dataDir = this.directories.mainPath + this.directories.dataDir;
            const logsDir = this.directories.mainPath + this.directories.logDir;
            const configDir = this.directories.mainPath + this.directories.configDir;
            return Promise.all([
                this.createDirectory('dataDir', dataDir),
                this.createDirectory('logsDir', logsDir),
                this.createDirectory('configDir', configDir)
            ]);
        }).then(() => {
            this.logger.info('Finished file initialization');
        }).catch((err) => {
            this.logger.fatal(`Could not establish directories - ${err}`);
        });
    }

    public getFullState() : InventoryState {

    }

    private getFileState(structureType: <T>): Promise<<T>[]> {
        fs.readFile()
    }

    public saveFullState(state: InventoryState) {

    }

    private saveItemState(state: any[]) {

    }


    private createDirectory(pathName: string, path: string): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (!fs.existsSync(this.directories.mainPath)) {
                this.logger.warn(`Path "${pathName}" was not found; creating ${path}`);
                fs.mkdir(this.directories.mainPath, (err) => {
                    if (err) {
                        this.logger.error('Failed to create mainPath directory', err);
                        rej(err);
                    }
                    this.logger.info('Created mainPath directory');
                    res();
                });
            } else {
                this.logger.debug('Found mainPath directory');
                res();
            }
        });
    }

}

export interface fileNames {
    allocations?: string,
    checkins?: string,
    checkouts?: string,
    conditions?: string,
    items?: string,
    packages?: string,
    tags?: string
}

export interface directoryNames {
    mainPath: string,
    configDir: string, // to be used later
    dataDir: string,
    logDir: string,
}
