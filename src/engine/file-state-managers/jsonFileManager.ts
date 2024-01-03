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
        'allocations': 'allocations.json',
        'checkins': 'checkins.json',
        'checkouts': 'checkouts.json',
        'conditions': 'conditions.json',
        'items': 'items.json',
        'packages': 'packages.json',
        'tags': 'tags.json',
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
        this.logger = LoggingSystem.getLogger(LoggerSource.JsonFileManager);
    }

    //#region public initializers and checkers
    public async initialize(): Promise<void> {
        this.logger = LoggingSystem.getLogger(LoggerSource.JsonFileManager);
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

            this.logger.info('Finished file initialization');
        } catch (err) {
            this.logger.fatal(`Could not establish directories - ${err}`);
        }
    }

    public async isLoadable(): Promise<boolean> {
        const dataDir = this.directories.mainDirectoryPath + this.directories.dataDirectory;
        const pathsToCheck = [
            this.directories.mainDirectoryPath,
            this.directories.mainDirectoryPath + this.directories.configsDirectory,
            this.directories.mainDirectoryPath + this.directories.logDirectory,
            dataDir
        ];

        Object.values(this.declaredDataFileNames).forEach((val) => {
            pathsToCheck.push(dataDir + val);
        });
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
    public async getFullState() : Promise<InventoryState> {
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

        return Promise.all(promiseArray).then((allFiles) => {
            this.logger.info('Collected data! pushing into new object!');
            this.logger.debug('Final object list', allFiles);
            return allFiles.reduce((previousValue: InventoryState, currentValue: fileReadResults) => {
                const newObj = previousValue;
                newObj[currentValue.type] = currentValue.data;
                return newObj;
            }, invmState);
        });
    }

    private getFileState(path: string, type: string): Promise<fileReadResults> {
        this.logger.debug(`Fetching for path '${path}' type '${type}' `);
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8',(err, data) => {
                this.logger.debug('Received', data, err);
                if (err) {
                    this.logger.error('Failed to get file data!', err);
                    reject(err);
                    return;
                }
                this.logger.info(`Collected file ${path}; ${type}`);
                resolve({data: JSON.parse(data), type});
            });
        });
    }
    //#endregion

    //#region Save
    public saveFullState(state: InventoryState): Promise<void> {
        const allFiles: Promise<void>[] = [];
        Object.keys(state).forEach((key) => {
            if (state[key]) {
                allFiles.push(this.saveItemState(this.declaredDataFileNames[key], state[key])
                    .catch((err) => {
                        this.logger.error(`When saving ${key}, we got an error`, err);
                    }));
            }
        });
        return Promise.all(allFiles).then(() => {
            this.logger.info('Saving has completed');
        });
    }

    private saveItemState(path: string, state: object[] | undefined): Promise<void> {
        if (!path || !state || !state.length) {
            this.logger.error('One of the provided items are invalid', path, state);
            return Promise.reject('The provided path or state is invalid');
        }
        return new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(state), (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
    //#endregion

    //#region directory helpers
    private createDirectory(pathName: string, path: string): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (!fs.existsSync(this.directories.mainDirectoryPath)) {
                this.logger.warn(`Path "${pathName}" was not found; creating ${path}`);
                fs.mkdir(this.directories.mainDirectoryPath, (err) => {
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

    private checkPathExists(path: string): Promise<{path: string, val: boolean}> {
        return new Promise((resolve) => {
            fs.access(path, (err) => {
                if (err) {
                    this.logger.debug(`On checking ${path}, received: `, err);
                }
                resolve({path: path, val: !!err});
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
