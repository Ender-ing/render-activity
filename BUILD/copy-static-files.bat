@echo off
setlocal enabledelayedexpansion

:: This file is meant to copy all static server files into the .OUTPUT directory
echo [44;45m Copying root base files... [0m

:: Get environment variables
FOR /F "tokens=*" %%i in (../.env) do SET %%i

:: Change to the target directory 
pushd %ROOTS_PATH%

:: Iterate through each folder in the directory
for /D %%f in (*) do (
    :: Only process folders that don't have a dot in their name
    set name=%%~f
    IF NOT "!name:~0,1!" == "." (
        echo Handling %%f

        :: Copy all files
        xcopy /E /I /Y "%ROOTS_PATH%\%%f" "%OUTPUT_PATH%\%%f" > nul 2>&1

        :: Compress folder contents in NodeJS and Replace content variables in NodeJS
        :: Generate SiteMap based on index.display files
        CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\static.js %OUTPUT_PATH%\%%f %ROOTS_PATH%\%%f %OUTPUT_PATH%\%%f\gen.info.json %BUILD_PATH%\global\locale\"
    )
)

:: Return to the original directory
popd