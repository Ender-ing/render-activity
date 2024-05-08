@echo off
setlocal enabledelayedexpansion

:: This file is meant to copy all static server files into the .OUTPUT directory
echo [44;45m Copying root base files... [0m

:: Get environment variables
FOR /F "tokens=*" %%i in (../.secret.env) do SET %%i

:: Change to the target directory 
pushd %ROOTS_PATH%

:: Iterate through each folder in the directory
for /D %%f in (*) do (
    :: Only process folders that don't have a dot in their name
    set name=%%~f
    IF NOT "!name:~0,1!" == "." (
        echo Handling %%f

        :: Copy all gen.* files
        mkdir %OUTPUT_PATH%\%%f > nul 2>&1
        copy %ROOTS_PATH%\%%f\gen.info.json %OUTPUT_PATH%\%%f\gen.info.json > nul 2>&1
        copy %ROOTS_PATH%\%%f\gen.logo.svg %OUTPUT_PATH%\%%f\gen.logo.svg > nul 2>&1
        copy %ROOTS_PATH%\%%f\gen.maskable.svg %OUTPUT_PATH%\%%f\gen.maskable.svg > nul 2>&1
    )
)

:: Return to the original directory
popd