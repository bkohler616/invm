/**
 * Typing for the {@link wrapFunction}
 */
export type AnyFunctionSpreadable = (...args: any[]) => any[] | void;
export type AnyFunction = (...args: any[]) => any;

/**
 * Wrap a function in either a pre-func or post-func.
 * @param fn - The function to wrap up; This is the intended function that should be called.
 * @param fnPre {FunctionWrapOptions} - The function to call with the arguments provided BEFORE the wrapped function. Can modify the data being sent to {@param fn}.
 * @param fnPost {FunctionWrapOptions} - The function to call with the arguments provided AFTER the wrapped function. Can modify the data that was responded from {@param fn}
 */
export const wrapFunction = <Func extends AnyFunction>(fn: Func, fnPre?: FunctionWrapOptions, fnPost?: FunctionWrapOptions): ((...args: Parameters<Func>) => ReturnType<Func>) => {
    return (...args: Parameters<Func>): ReturnType<Func> => {
        let newArgs = [...args];
        if (fnPre) {
            const res = fnPre.func(...args);
            if (res && fnPre.modifiesReturnValue) {
                newArgs = [...res];
            }
        }
        let results = fn(...newArgs);
        if (fnPost) {
            const newRes = fnPost.func(results);
            if (newRes && fnPost.modifiesReturnValue) {
                results = newRes;
            }
        }
        return results;
    };
};

export function addFunctionCaller(binder: ThisParameterType<Function>, funcToWrap: AnyFunction) {
    const preFunc: FunctionWrapOptions = {
        func: (...args: Parameters<AnyFunction>) => {
            const stackTrace = new Error()?.stack?.split('\n')[4]?.trim().replace(/^at /, '');
            args.splice(1, 0, stackTrace);
            return [
                ...args
            ]
        },
        modifiesReturnValue: true
    }

    return wrapFunction(funcToWrap.bind(binder), preFunc);
}

/**
 * Intended to be used with {@link wrapFunction}
 * @param func {AnyFunction} - A function that will be called.
 * @param modifiesReturnValue {boolean} - Informational if the function declared at {@param func} should overwrite the respective return value.
 */
export interface FunctionWrapOptions {
    func: AnyFunctionSpreadable,
    modifiesReturnValue?: boolean,
}
