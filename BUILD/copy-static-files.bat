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
call ./SAFETY.bat || ( set errorTrigger="call" && goto local_bat_error )
if %errorlevel% NEQ 0 ( set errorTrigger="level" && goto local_bat_error )

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

        :: Copy global @catch page
        xcopy /E /I /Y "%BUILD_PATH%\global\pages\@catch" "%OUTPUT_PATH%\%%f\@catch" > nul 2>&1

        :: Compress folder contents in NodeJS and Replace content variables in NodeJS
        :: Generate SiteMap based on index.display files
        CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\static.js %OUTPUT_PATH%\%%f %ROOTS_PATH%\%%f %OUTPUT_PATH%\%%f\gen.info.json %BUILD_PATH%"
    )
)

:: Return to the original directory
popd