@echo off

:: Use this code to get environment variables
:: FOR /F "tokens=*" %%i in (BUILD.env) do SET %%i

cls
echo [101;93m STARTING BUILDING PROCESS [0m

:: You may use the `INSTALL-DEP.bat` file to install all the needed global NodeJS dependencies
:: INSTALL-DEP.bat

:: Build all global index resources (@vite)
CMD "Running Backup" /C "build-global-index.bat"

:: Build all needed material resources (@material)
:: Note: make sure you can use the "npx rollup" command before running this script
CMD "Running Backup" /C "build-material-imports.bat"

:: Compress all custom material code (material)
CMD "Running Backup" /C "compress-custom-material.bat"

:: Generate all root directories files
CMD "Running Backup" /C "generate-root-files.bat"

echo [101;93m BUILDING PROCESS DONE! [0m
