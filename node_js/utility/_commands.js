/**
 * 
 * Manage commands!
 * 
**/

const { log, error, info, CONSOLE_SOFT_ERROR } = require('./_console');
const { spawn } = require('child_process');

// Manage commands
function executeCommand(name, args = [], ext = {}){
    return new Promise((resolve, reject) => {
        info(`Executing command '${name} ${args.join(" ")}'!`);
        const cmd = spawn(name, args, ext);
        cmd.stdout.on('data', (data) => log(data.toString()));
        cmd.stderr.on('data', (data) => log(data.toString()));
        cmd.on('close', (code) => {
            info(`Done executing '${name}'!`);
            resolve();
        });
    });
}

module.exports = {
    executeCommand
};