/**
 * 
 * Manage console logs!
 * 
**/

const colors = require('colors');

const newLine = "\n\t";

// Log normal messages!
function log(...args){
    console.log(...args);
}

// Show informative text
function info(...args){
    console.log(("(?) " + args.join(newLine)).blue);
}

// Show action text
function action(...args){
    console.log(("(#) " + args.join(newLine)).green);
}

// Show warnings
function warn(...args){
    console.warn(("(!) " + args.join(newLine)).yellow);
}

// Show errors and end script!
const CONSOLE_SOFT_ERROR = "~~CONSOLE=>ERROR-SOFT~~";
function error(...args){
    // Check flag
    let flagIndex = args.indexOf(CONSOLE_SOFT_ERROR);
    if(flagIndex != -1){
        args.slice(flagIndex, flagIndex);
    }
    if(typeof args[0] == 'string'){
        console.error(("(!) " + args.join(newLine)).red);
        // throw new Error(msg);
    }else{
        console.error(args[0].stack.red);
        throw new Error(args[0]);
    }
    if(flagIndex == -1){
        process.exit(1);
    }
}

module.exports = {
    log,
    info,
    action,
    warn,
    CONSOLE_SOFT_ERROR,
    error
};