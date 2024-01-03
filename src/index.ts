import yargs, {Options} from 'yargs';

const testOptions: { [key: string]: Options; } = {
    p: {
        type: "string",
        default: false
    },
    ppp: {
        type: "string",
        default: false
    }
};

const argv = yargs(process.argv.slice(2)).options(testOptions).parseSync();
console.log('(%d,%d)', argv.p, argv.ppp);

console.log(JSON.stringify(argv));
