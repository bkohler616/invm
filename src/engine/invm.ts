import {FileType} from "./file-state-managers/fileType";
import {createAllocation, NewAllocation} from "./structure_interfaces/allocation";
import {InventoryStateManager} from "./inv_state_manager";
import {FileData} from "./file-state-managers/fileData";

export class Invm {
    private fileData: FileData;
    private invState: InventoryStateManager;
    constructor(
        defaultLoc: FileData,
    ) {
        this.fileData = defaultLoc;
        this.invState = new InventoryStateManager();
    }


    //#region SaveData
    /**
     * Set a new save path.
     * @param newFileData
     */
    setFileData(newFileData: FileData) {
        this.fileData = newFileData;
    }

    loadInvStateFromFileData() {
        return this.invState.loadFromFileData(this.fileData);
    }

    initializeInvStateFileData() {
        return this.invState.initializeFileData(this.fileData);
    }

    saveInvState() {
        return this.invState.saveFileData(this.fileData);
    }
    //#endregion



    //#region AddData
    addAllocation(request: NewAllocation) {
        const alloc = createAllocation(request);
    }

    addCondition() {

    }

    addTag() {

    }

    addItem() {

    }

    addPackage() {

    }

    //#endregion

    //#region GetData
    getAllocation() {

    }

    getCondition() {

    }

    getTag() {

    }

    getItem() {

    }

    getPackage() {

    }
    //#endregion

    //#region UpdateData
    updateAllocation() {

    }

    updateCondition() {

    }

    updateTag() {

    }

    updateItem() {

    }

    updatePackage() {

    }
    //#endregion

    //#region Checkin/Checkout

    //#endregion

    //#region DeleteData
    deleteAllocation() {

    }

    deleteCondition() {

    }

    deleteTag() {

    }

    deleteItem() {

    }

    deletePackage() {

    }
    //#endregion

    //#region PermanentlyDeleteData

    //#endregion
}
