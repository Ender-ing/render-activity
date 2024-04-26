/**
 * 
 * Generate branding icons
 * 
**/

// node icons.js <input_path> <output_path>

// Get file-system functions
const { path, path2 } = require('./_files');

// Get icon-gen module
const icongen = require('icon-gen');

function generateIcons() {
    icongen(path, path2, {
        report: true,
        ico: {},
        icns: {},
        favicon: {
            name: 'logo-',
            pngSizes: [72, 96, 128, 144, 152, 192, 384, 512],
            icoSizes: [32]
        }
    })
        .then((results) => {
            console.log(results)
        })
        .catch((err) => {
            console.error(err)
        })
}

generateIcons();