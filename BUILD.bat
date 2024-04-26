@echo off

:: Buuil all global index resources (@vite)
CMD "Running Backup" /C "build-global-index.bat"

:: Build all needed material resources (@material)
:: Note: make sure you can use the "npx rollup" command before running this script
CMD "Running Backup" /C "build-material-imports.bat"

:: Compress all custom material code (material)
:: Make sure to install terser command before using: npm install -g terser@latest
:: Make sure to install clean-css-cli command before using: npm install clean-css-cli -g
CMD "Running Backup" /C "compress-custom-material.bat"

:: Generate all brand assets
CMD "Running Backup" /C "generate-brand-assets.bat"
