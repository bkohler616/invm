import {Allocation, Checkin, Checkout, Condition, Item, Package, Tag} from "./structure_interfaces";
import {FileData} from "./file-state-managers/fileData";
import {FileType} from "./file-state-managers/fileType";
import {JsonFileManager} from "./file-state-managers/jsonFileManager";
import {Logger} from "log4js";
import {LoggerSource, LoggingSystem} from "../shared/loggingSystem";

export class InventoryStateManager {
    private invmState: InventoryState = {
        allocations: [],
        conditions: [],
        items: [],
        packages: [],
        tags: [],
        checkouts: [],
        checkins: [],
    }
    private logger: Logger;
    constructor(initialState?: InventoryState) {
        if (initialState) {
            this.invmState = initialState;
        }
        this.logger = LoggingSystem.getLogger(this, LoggerSource.InvmStateManager);
        this.logger.info('using it!');


    }

    //#region Public file functions
    public loadFromFileData(fileData: FileData): Promise<void> {
        if (fileData.fileType !== FileType.JSON) {
            throw `File type ${fileData.fileType} not supported`;
        }

        return this.loadFromJsonFiles(fileData);
    }

    public initializeFileData(fileData: FileData): Promise<void> {
        if (fileData.fileType !== FileType.JSON) {
            throw `File type ${fileData.fileType} not supported`;
        }

        return this.initializeJsonFiles(fileData);
    }

    public saveFileData(fileData: FileData, force: boolean = false, overwriteStateToSave?: InventoryState): Promise<void> {
        if (fileData.fileType !== FileType.JSON) {
            throw `File type ${fileData.fileType} not supported`;
        }

        if (overwriteStateToSave) {
            this.invmState = overwriteStateToSave;
        }

        return this.saveJsonFiles(fileData, force);
    }
    //#endregion

    //#region JSON file handlers
    private saveJsonFiles(fileData: FileData, force: boolean = false): Promise<void> {
        const jsonFileMan = new JsonFileManager(fileData);
        return jsonFileMan.isDataDirectorySetup()
            .then((val) => {
                if (val && !force) {
                    throw 'Data already exists, did not save';
                }
                if (!val) {
                    return this.initializeJsonFiles(fileData, true);
                }
                return
            }).then(() => {
                return jsonFileMan.saveFullState(this.invmState);
            });
    }

    private loadFromJsonFiles(fileData: FileData): Promise<void> {
        const jsonFileMan = new JsonFileManager(fileData);
        return jsonFileMan.isLoadable()
            .then((val) => val ? jsonFileMan.getFullState(): Promise.reject("Could not load"))
            .then((val) => {
                this.invmState = val;
            });
    }

    private initializeJsonFiles(fileData: FileData, force: boolean = false): Promise<void> {
        const jsonFileMan = new JsonFileManager(fileData);
        return jsonFileMan.isLoadable()
            .then((val) => {
                if (val && !force) {
                    throw 'Data already exists, did not re-initialize';
                }
                return jsonFileMan.initialize()
                    .then(() => this.saveJsonFiles(fileData, true));
            });
    }
    //#endregion


}

export interface InventoryState {
    allocations: Allocation[],
    conditions: Condition[],
    items: Item[],
    packages: Package[],
    tags: Tag[],
    checkouts: Checkout[],
    checkins: Checkin[],
    [keys: string]: object[],
}
