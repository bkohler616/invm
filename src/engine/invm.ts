import {FileType} from "./enums/fileType";
import {createAllocation, NewAllocation} from "./structure_interfaces/allocation";

export class Invm {
    private filePath?: string;
    private fileType?: FileType;
    constructor(
        filePath?: string,
        fileType?: FileType
    ) {
        if (filePath) {
            this.filePath = filePath;
        }
        if (fileType) {
            this.fileType = fileType;
        }
    }


    //#region SaveData
    /**
     * Set a new save path.
     * @param newFilePath
     */
    setFilePath(newFilePath: string) {
        this.filePath = newFilePath;
    }

    /**
     * Set the type of file desired to save.
     * @param fileType
     */
    setFileType(fileType: FileType) {
        this.fileType = fileType;
    }

    /**
     * Export to a single location once
     * @param filePath
     * @param fileType
     */
    commitToTempLocation(filePath: string, fileType: FileType) {
        console.log(filePath, fileType);
    }

    /**
     * Force save of files.
     */
    commitToDisk() {

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
