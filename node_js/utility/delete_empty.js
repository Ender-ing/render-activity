/**
 * 
 * Manage deleting empty folders
 * 
**/

// delete_empty.js <input_path>

const { arg1 } = require("./_args");
const { deleteEmptyFolders } = require("./_files");

deleteEmptyFolders(arg1);