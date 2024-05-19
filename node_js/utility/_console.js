/**
 * 
 * Manage console logs!
 * 
**/

const colors = require('colors');

// Log normal messages!
function log(...args){
    console.log(...args);
}

// Show warnings
function warn(...args){
    console.warn(args.join("\n").yellow);
}

// Show errors and end script!
function error(msg){
    if(typeof msg == 'string'){
        console.error(msg.red);
        throw new Error(msg);
    }else{
        console.error(msg.stack.red);
        throw new Error(msg);
    }
}

module.exports = {
    log,
    warn,
    error
};