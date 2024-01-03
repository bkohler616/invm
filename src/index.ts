import {CliInterface} from './cli';
import {LoggerSource, LoggingSystem} from './shared/loggingSystem';

const isCli = true;
if (isCli) {
    try {
        new CliInterface().startCli()
            .catch((e) => {
                LoggingSystem.getLogger(LoggerSource.InvmFatalHandler).fatal('Something really bad happened and we killed the CLI!', e);
            });
    } catch (e) {
        LoggingSystem.getLogger(LoggerSource.InvmFatalHandler).fatal('Something really bad happened and we killed the whole application!', e);
    }
}
