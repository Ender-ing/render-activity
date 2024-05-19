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

// Show informative text
function info(...args){
    console.log(args.join("\n").blue);
}

// Show action text
function action(...args){
    console.log(args.join("\n").green);
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
    info,
    action,
    warn,
    error
};