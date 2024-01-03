import {Allocation} from "./structure_interfaces";
import {Condition} from "./structure_interfaces";
import {Item} from "./structure_interfaces";
import {Package} from "./structure_interfaces";
import {Tag} from "./structure_interfaces";
import {Checkout} from "./structure_interfaces";
import {Checkin} from "./structure_interfaces";
import {FileData} from "./file-state-managers/fileData";
import {FileType} from "./file-state-managers/fileType";
import {JsonFileManager} from "./file-state-managers/jsonFileManager";

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
    constructor(initialState?: InventoryState) {
        if (initialState) {
            this.invmState = initialState;
        }
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

    public saveFileData(fileData: FileData, force: boolean = false): Promise<void> {
        if (fileData.fileType !== FileType.JSON) {
            throw `File type ${fileData.fileType} not supported`;
        }

        return this.saveJsonFiles(fileData, force);
    }
    //#endregion

    //#region JSON file handlers
    private saveJsonFiles(fileData: FileData, force: boolean = false): Promise<void> {
        const jsonFileMan = new JsonFileManager(fileData);
        return jsonFileMan.isLoadable()
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
                if (!val && !force) {
                    throw 'Data already exists, did not re-initialize';
                }
                return jsonFileMan.initialize();
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
