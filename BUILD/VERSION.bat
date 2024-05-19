@echo off
setlocal enabledelayedexpansion

:: This file is meant to check source code for any changes
echo [44;45m Checking source for changes... [0m

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

:: Should update
set shouldUpdate=%1
set Major=%2
set increaseVersion=%2.%3.%4

:: Change to the target directory 
pushd %ROOTS_PATH%

:: Iterate through each folder in the directory
for /D %%f in (*) do (
    :: Only process folders that don't have a dot in their name
    set name=%%~f
    IF NOT "!name:~0,1!" == "." (
        echo Versioning %%f

        :: Check if directory needs to be versioned
        set shouldSkip=false
        if "%shouldUpdate%" == "false" (
            if exist %ROOTS_PATH%\%%f\gen.version.txt (
                set shouldSkip=true
            )
        )

        :: Run command
        if "!shouldSkip!" == "false" (
            :: Check directory (version.json  & gen.version.txt files will be updated!)
            CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\version.js %ROOTS_PATH%\%%f %%f %BUILD_PATH%\version.json %increaseVersion%"
        ) else (
            :: Skip command!
            echo Skipped versioning %%f!
        )
    )
)

:: Return to the original directory
popd