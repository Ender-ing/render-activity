@echo off
setlocal enabledelayedexpansion
:: This file is meant to copy all static server files into the .OUTPUT directory

echo [44;45m Copying root base files... [0m

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