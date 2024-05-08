@echo off

:: Use this code to get environment variables
:: FOR /F "tokens=*" %%i in (../.secret.env) do SET %%i

:: Check command arguments
set noStatic=false

for /f "tokens=*" %%a in ("%*") do (
    if /i "%%a" == "--no-static" (
        set noStatic=true
        break
    )
)

cls
echo [101;93m STARTING BUILDING PROCESS [0m

:: You may use the `INSTALL-DEP.bat` file to install all the needed NodeJS dependencies
:: INSTALL-DEP.bat

:: Clean up .OUTPUT directory
CMD "Running Backup" /C "CLEANUP.bat"

:: Copy base static files
if "%noStatic%" == "true" (
    CMD "Running Backup" /C "copy-gen-files.bat"
) else (
    CMD "Running Backup" /C "copy-static-files.bat"
)

:: Build all global index resources (@vite)
CMD "Running Backup" /C "build-global-index.bat"

:: Build all needed material resources (@material)
:: Note: make sure you can use the "npx rollup" command before running this script
CMD "Running Backup" /C "build-material-imports.bat"

:: Compress all custom material code (material)
:: YOU CAN REMOVE THIS ONCE YOU COMPLETE THE BASE STATIC FILES COPY COMMAND!
:: (You'd just have to move the related files to the resources directory)
CMD "Running Backup" /C "compress-custom-material.bat"

:: Generate all root directories files
CMD "Running Backup" /C "generate-root-files.bat"

:: Cleanup .OUTPUT directory
CMD "Running Backup" /C "AFTER-CLEANUP.bat"

echo [101;93m BUILDING PROCESS DONE! [0m
