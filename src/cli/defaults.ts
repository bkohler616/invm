import {FileType} from '../engine/file-state-managers/fileType';

import {homedir} from 'os';

const homeDirectory = homedir();
export const defaultFileData = {
    mainDirectoryPath: `${homeDirectory}/.invm/`,
    fileType: FileType.JSON,
    configsDirectory: 'configs/',
    dataDirectory: 'data/',
    logDirectory: 'logs/',
    logFile: 'invm.log',
};
