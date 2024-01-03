import {FileType} from "./fileType";

export interface FileData {
    mainDirectoryPath: string,
    fileType: FileType
    configsDirectory: string,
    dataDirectory: string,
    logDirectory: string,
}
