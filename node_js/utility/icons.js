/**
 * 
 * Generate branding icons
 * 
**/

// node icons.js <input_path> <output_path>

// Get file-system functions
const { arg1, arg2 } = require('./_args');
const { error, info, CONSOLE_SOFT_ERROR } = require('./_console');

// Get icon-gen module
const icongen = require('icon-gen');

function generateIcons() {
    icongen(arg1, arg2, {
        report: false,
        ico: {},
        icns: {},
        favicon: {
            name: 'logo-',
            pngSizes: [72, 96, 128, 144, 152, 192, 384, 512],
            icoSizes: [32]
        }
    }).then((results) => {
        info(`Assets successfully generated from ${arg1}!`);
    }).catch((err) => {
        error(`Couldn't generate assets from ${arg1}!`, CONSOLE_SOFT_ERROR);
        error(err);
    })
}

generateIcons();