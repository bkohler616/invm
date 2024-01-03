import {FileType} from "../engine/file-state-managers/fileType";

const homedir = require('os').homedir();
export const defaultFileData = {
    mainDirectoryPath: `${homedir}/.invm/`,
    fileType: FileType.JSON,
    configsDirectory: 'configs/',
    dataDirectory: 'data/',
    logDirectory: 'logs/',
    logFile: 'invm.log',
}
