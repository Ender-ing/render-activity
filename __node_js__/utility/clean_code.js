/**
 * 
 * Remove comments from files
 * 
**/

// node clean_code.js <path>

// Get file-system functions
import { path, getContent, writeContent } from './_files';

// Clean comments
function cleanComments(code) {
    const stack = [];
    let inComment = false;
    let commentType = null; // 0 - linear, 1 - multilinear
    let inString = false;
    let newCode = "";
    let currIndex = -1;
    let skipChar = false,
        resetSkip = false;

    for (let char of code) {
        if(skipChar){
            resetSkip = true;
        }
        currIndex++;
        if (!skipChar && inString) {
            // Inside a string, append the character
            newCode += char;

            // Check for string termination depending on quote type
            if (char === '"' && stack[stack.length - 1] === '"') {
                inString = false;
                stack.pop();
            } else if (char === "'" && stack[stack.length - 1] === "'") {
                inString = false;
                stack.pop();
            } else if (char === "`" && stack[stack.length - 1] === "`") {
                inString = false;
                stack.pop();
            }
        } else if(!skipChar) {
            // Outside a string
            if (!inComment && char === '/' && code[currIndex + 1] === '/') {
                // Single-line comment, skip to end of line
                inComment = true;
                commentType = 0;
                stack.push('/'); // Push slash
            } else if (!inComment && char === '/' && code[currIndex + 1] === '*') {
                // Multi-line comment, start tracking
                inComment = true;
                commentType = 1;
                stack.push('/'); // Push opening slash for multi-line comment tracking
            } else if(char === '\n' && inComment && commentType === 0){
                // End linear comment
                inComment = false;
                commentType = null;
                stack.pop();

                // Keep new line character
                newCode += char;
            } else if (char === '*' && inComment && commentType === 1 && code[currIndex + 1] === '/') {
                inComment = false;
                commentType = null;
                stack.pop(); // Pop closing slash from stack

                // Skip next char
                skipChar = true;
            } else if (!inComment && (char === '"' || char === "'" || char === '`')) {
                // Entering a string, track quote type
                inString = true;
                stack.push(char);

                newCode += char;
            } else if (!inComment) {
                // Append characters that are not part of comments or strings
                newCode += char;
            }
        }
        if(resetSkip){
            resetSkip = false;
            skipChar = false;
        }
    }

    return newCode;
}

// Cleanup whitespace
function cleanWhitespace(text) {
    let inQuotes = false;
    let currentQuote = null;
    let cleanedText = '';
  
    for (const char of text) {
        if ((char === '"' || char === "'" || char === '`') && (currentQuote == null || currentQuote === char)) {
            inQuotes = !inQuotes;
            if(inQuotes){
                currentQuote = char;
            }else{
                currentQuote = null;
            }
            cleanedText += char;
        } else if (char.match(/\s/) && !inQuotes) {
            if (cleanedText.length === 0 || cleanedText.slice(-1) !== ' ') {
                cleanedText += ' '; // Add only a single space as needed
            }
        } else {
            cleanedText += char;
        }
    }
  
    return cleanedText;
}

// Cleanup comments
async function cleanupContent(path){
    let content = await getContent(path);
    content = cleanComments(content);
    content = cleanWhitespace(content);
    await writeContent(path, content);
}

// Cleanup code!
cleanupContent(path);