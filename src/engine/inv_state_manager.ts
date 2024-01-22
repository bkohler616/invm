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
        this.logger = LoggingSystem.getLogger(LoggerSource.InvmStateManager);
        this.logger.trace('using it!');


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
    private async saveJsonFiles(fileData: FileData, force: boolean = false): Promise<void> {
        const jsonFileMan = new JsonFileManager(fileData);
        let isSetup = await jsonFileMan.isDataDirectorySetup();
        if (isSetup && !force) {
            throw 'Data already exists, did not save';
        }
        if (!isSetup) {
            await this.initializeJsonFiles(fileData, true);
        }
        return jsonFileMan.saveFullState(this.invmState);
    }

    private async loadFromJsonFiles(fileData: FileData): Promise<void> {
        const jsonFileMan = new JsonFileManager(fileData);
        const isLoadable = await jsonFileMan.isLoadable();
        this.invmState = await (isLoadable ? jsonFileMan.getFullState() : Promise.reject("Could not load"));
    }

    private async initializeJsonFiles(fileData: FileData, force: boolean = false): Promise<void> {
        const jsonFileMan = new JsonFileManager(fileData);
        let isLoadable = await jsonFileMan.isLoadable();
        if (isLoadable && !force) {
            throw 'Data already exists, did not re-initialize';
        }
        await jsonFileMan.initialize();
        return await this.saveJsonFiles(fileData, true);
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
