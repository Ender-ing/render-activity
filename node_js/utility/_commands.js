/**
 * 
 * Manage commands!
 * 
**/

const { log, error, info } = require('./_console');
const { spawn } = require('child_process');

// Manage commands
function executeCommand(name, args = [], ext = {}){
    info(`Executing command '${name} ${args.join(" ")}'!`);
    const cmd = spawn(name, args, ext);
    cmd.stdout.on('data', (data) => log(data));
    cmd.stderr.on('data', (data) => error(data));
    gitClone.on('close', (code) => info(`Done executing '${name}'!`));
}

module.exports = {
    executeCommand
};