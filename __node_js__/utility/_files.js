/**
 * 
 * File-management functions
 * 
**/

const fs = require('fs');

// Get input (same as output) path
export const path = process.argv[2];

// Get file content
export async function getContent(path){
    return await fs.readFileSync(path, 'utf-8');
}

// Overwrite file content
export async function writeContent(path, content){
    await fs.writeFileSync(path, content);
}