import {InventoryState} from "../inv_state_manager";
import 'fs';
import * as fs from "fs";
import {Logger, LoggerSource, LoggingSystem} from "../../shared/loggingSystem";
import {FileData} from "./fileData";

interface fileReadResults {
    data: object[],
    type: string
}

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
        tags: 'tags.json',
    }

    private readonly declaredDataFileNames: fileNames = JsonFileManager.defaultFileNames;
    private readonly directories: FileData;
    private logger: Logger;

    constructor(folderNames: FileData, requestedDataFileNames: fileNames = JsonFileManager.defaultFileNames) {
        this.declaredDataFileNames = {
            ...this.declaredDataFileNames,
            ...requestedDataFileNames
        };

        this.directories = folderNames;
        this.logger = LoggingSystem.getLogger(this, LoggerSource.JsonFileManager);
    }

    //#region public initializers and checkers
    /**
     * Initialize the directories for invm engine to work.
     */
    public async initialize(): Promise<void> {
        this.logger = LoggingSystem.getLogger(this, LoggerSource.JsonFileManager);
        this.logger.info('Initializing file structure');
        try {
            await this.createDirectory("mainPath", this.directories.mainDirectoryPath);
            const dataDir = this.directories.mainDirectoryPath + this.directories.dataDirectory;
            const logsDir = this.directories.mainDirectoryPath + this.directories.logDirectory;
            const configDir = this.directories.mainDirectoryPath + this.directories.configsDirectory;
            await Promise.all([
                this.createDirectory('dataDir', dataDir),
                this.createDirectory('logsDir', logsDir),
                this.createDirectory('configDir', configDir)
            ]);

            this.logger.info('Finished directory initialization');
        } catch (err) {
            this.logger.fatal(`Could not establish directories - ${err}`);
        }
    }

    /**
     * Determines if all files are loadable to perform a {@link getFileState}.
     * Calls {@link isDataDirectorySetup} to ensure the data directory is established.
     */
    public async isLoadable(): Promise<boolean> {
        if(!await this.isDataDirectorySetup()) {
            this.logger.debug('Data directory is not setup.');
            return false;
        }
        const dataDir = this.directories.mainDirectoryPath + this.directories.dataDirectory;
        const pathsToCheck: string[] = [];

        Object.values(this.declaredDataFileNames).forEach((val) => {
            pathsToCheck.push(dataDir + val);
        });
        return this.checkPaths(pathsToCheck);
    }

    /**
     * Checks to see if the main and data directory exists.
     */
    public async isDataDirectorySetup() {
        const dataDir = this.directories.mainDirectoryPath + this.directories.dataDirectory;
        const pathsToCheck = [
            this.directories.mainDirectoryPath,
            dataDir
        ];

        return this.checkPaths(pathsToCheck);
    }

    /**
     * Takes the paths provided and queries via {@link checkPathExists} to see if the path exists
     * @param pathsToCheck {string[]}
     * @private
     */
    private async checkPaths(pathsToCheck: string[]) {
        const checkingPromises: Promise<{ path: string, val: boolean }>[] = [];
        pathsToCheck.forEach((i) => {
            checkingPromises.push(this.checkPathExists(i));
        })
        const values_1 = await Promise.all(checkingPromises);
        if (values_1.find((i_1) => !i_1.val)) {
            this.logger.info('Not all paths were valid');
            values_1.forEach((i_2) => {
                if (i_2.val) {
                    this.logger.debug(`Path ${i_2.path} - ${i_2.val}`);
                } else {
                    this.logger.warn(`Path ${i_2.path} does not exist`);
                }
            });
            return false;
        }
        return true;
    }
    //#endregion

    //#region Load
    /**
     * Collect the full {@link InventoryState} from the files declared at {@link declaredDataFileNames}
     */
    public async getFullState(): Promise<InventoryState> {
        this.logger.info('Fetching data');
        this.logger.debug('Fetching data for paths: ', this.declaredDataFileNames);


        const promiseArray: Promise<fileReadResults>[] = [];
        Object.keys(this.declaredDataFileNames).forEach((key) => {
            promiseArray.push(this.getFileState(this.directories.mainDirectoryPath + this.declaredDataFileNames[key], key));
        });

        let invmState: InventoryState = {
            allocations: [],
            conditions: [],
            items: [],
            packages: [],
            tags: [],
            checkouts: [],
            checkins: [],
        };

        const allFiles = await Promise.all(promiseArray);
        this.logger.info('Collected data! pushing into new object!');
        this.logger.debug('Final object list', allFiles);
        return allFiles.reduce((previousValue: InventoryState, currentValue: fileReadResults) => {
            const newObj = previousValue;
            newObj[currentValue.type] = currentValue.data;
            return newObj;
        }, invmState);
    }

    /**
     * Get a singular file state for a specific type.
     * @param path {string} - The path of the file to collect data from. Must be JSON.
     * @param type {string} - The type of data to be collected - for logging purposes
     * @private
     */
    private getFileState(path: string, type: string): Promise<fileReadResults> {
        this.logger.debug(`Fetching for path '${path}' type '${type}' `);
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8',(err, data) => {
                this.logger.debug('Received', data, err);
                if (err) {
                    this.logger.error('Failed to get file data!', err);
                    return reject(err);
                }
                this.logger.info(`Collected file ${path}; ${type}`);
                resolve({data: JSON.parse(data), type});
            });
        });
    }
    //#endregion

    //#region Save
    /**
     * Save the full inventory state to the {@link declaredDataFileNames} paths.
     * @param state {InventoryState} - The state to write to record to all files.
     */
    public async saveFullState(state: InventoryState): Promise<void> {
        const allFiles: Promise<void>[] = [];
        Object.keys(state).forEach((key) => {
            if (state[key]) {
                allFiles.push(this.saveObjectState(this.declaredDataFileNames[key], state[key])
                    .catch((err) => {
                        this.logger.error(`When saving ${key}, we got an error`, err);
                    }));
            }
        });
        await Promise.all(allFiles);
        this.logger.info('Saving has completed');
    }

    /**
     * Save a state object array to a path.
     * @param path {string} - Path on where to save the file
     * @param state {object[]} - The object to record
     * @private
     */
    private saveObjectState(path: string, state: object[] | undefined): Promise<void> {
        if (!path || !state || !state.length) {
            this.logger.error('One of the provided items are invalid', path, state);
            return Promise.reject('The provided path or state is invalid');
        }
        return new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(state), (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    //#endregion

    //#region directory helpers
    /**
     * Creates a directory at the specified path. Calls {@link fs.existsSync} to check if it exists already, and uses {@link fs.mkdir} to create the directory
     * @param pathName {string} - Friendly path name for logging
     * @param path {string} - The path to create/
     * @private
     */
    private createDirectory(pathName: string, path: string): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (!fs.existsSync(path)) {
                this.logger.warn(`PathName "${pathName}" was not found; creating ${path}`);
                fs.mkdir(path, (err) => {
                    if (err) {
                        this.logger.error(`Failed to create ${pathName} directory`, err);
                        return rej(err);
                    }
                    this.logger.info(`Created ${pathName} directory`);
                    return res();
                });
            } else {
                this.logger.debug(`Found ${pathName} ; ${path} directory`);
                return res();
            }
        });
    }

    /**
     * Checks if the specified path exists by using {@link fs.access}.
     * @param path {string}
     * @private
     */
    private checkPathExists(path: string): Promise<{path: string, val: boolean}> {
        return new Promise((resolve) => {
            fs.access(path, (err) => {
                if (err) {
                    this.logger.debug(`On checking ${path}, received: `, err);
                }
                resolve({path: path, val: !err});
            });
        });
    }
    //#endregion
}

export interface fileNames {
    allocations?: string,
    checkins?: string,
    checkouts?: string,
    conditions?: string,
    items?: string,
    packages?: string,
    tags?: string,
    [index: string]: any
}
