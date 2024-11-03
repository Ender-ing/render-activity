@echo off
:: This file is meant to run all other .bat files in the .BUILD folder

:: Exit
goto local_bat_file
:local_bat_error
echo [91m An error occurred white attempting to load environment variables ^(errorlevel: %errorlevel%, errorTrigger: %errorTrigger%^) [0m
exit /B 1
:local_bat_file

:: Get environment variables
FOR /F "tokens=*" %%i in (../.secret.env) do SET %%i
call ../SAFETY.bat || ( set errorTrigger="call" && goto local_bat_error )
if %errorlevel% NEQ 0 ( set errorTrigger="level" && goto local_bat_error )

:: Check command arguments
set noStatic=false
set autoVersionUpdate=true
set addMajor=0
set addMinor=0
set addPatch=0

for /f "tokens=*" %%a in ("%*") do (
    if /i "%%a" == "--no-static" (
        set noStatic=true
        break
    ) else if /i "%%a" == "--no-auto-update" (
        set autoVersionUpdate=false
        break
    ) else if /i "%%a" == "--major" (
        set addMajor=1
        break
    ) else if /i "%%a" == "--minor" (
        set addMinor=1
        break
    ) else if /i "%%a" == "--patch" (
        set addPatch=1
        break
    )
)

cls
echo [101;93m STARTING BUILDING PROCESS [0m

:: You may use the `INSTALL-DEP.bat` file to install all the needed NodeJS dependencies
:: INSTALL-DEP.bat

:: Check version status
:: (Only checks source, will edit source)
REM CMD "Running Backup" /C "VERSION.bat %autoVersionUpdate% %addMajor% %addMinor% %addPatch%"

:: Set up temporary git directory
REM CMD "Running Backup" /C "GIT.bat"

:: Clean up .OUTPUT directory & copy git files
REM CMD "Running Backup" /C "CLEANUP.bat"

:: Copy base static files
if "%noStatic%" == "true" (
    REM CMD "Running Backup" /C "copy-gen-files.bat"
) else (
    REM CMD "Running Backup" /C "copy-static-files.bat"
)

:: Build all global index resources (@vite)
REM CMD "Running Backup" /C "build-global-index.bat"

:: Build all needed material resources (@material)
:: Note: make sure you can use the "npx rollup" command before running this script
REM CMD "Running Backup" /C "build-material-imports.bat"

:: Compress all custom material code (material)
:: YOU CAN REMOVE THIS ONCE YOU COMPLETE THE BASE STATIC FILES COPY COMMAND!
:: (You'd just have to move the related files to the resources directory)
REM CMD "Running Backup" /C "compress-custom-material.bat"

:: Generate all root directories files
REM CMD "Running Backup" /C "generate-root-files.bat"

:: Build the "docs" directory
REM CMD "Running Backup" /C "ext-docusaurus-build.bat"

:: Cleanup .OUTPUT directory
REM CMD "Running Backup" /C "AFTER-CLEANUP.bat"

:: Track the build
CMD "Running Backup" /C "TRACK.bat"

echo [101;93m BUILDING PROCESS DONE! [0m
