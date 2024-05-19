@echo off

:: This file is meant to setup the .git temporary directory!
echo [44;45m Creating temporary .git directory... [0m

:: Get environment variables
FOR /F "tokens=*" %%i in (../.secret.env) do SET %%i
call ./SAFETY.bat || ( set errorTrigger="call" && goto local_bat_error )
if %errorlevel% NEQ 0 ( set errorTrigger="level" && goto local_bat_error )

:: Temporary git path
set TEMP_GIT_PATH=%TEMP%\endering-build-temp-git

:: Check if deletion was successful
if exist %TEMP_GIT_PATH%\.git (
    echo Temporary git directory already exists!

    :: Change to the target directory
    pushd %TEMP_GIT_PATH%

    :: Fetch latest changes
    CMD "Running Backup" /C "git reset --hard HEAD"
    CMD "Running Backup" /C "git pull"

    :: Return to the original directory
    popd
) else (

    :: Attempt to delete the folder
    rmdir /s /q %TEMP_GIT_PATH% 2>nul

    :: Create the folder (with .git folder)
    mkdir %TEMP_GIT_PATH%

    :: Change to the target directory 
    pushd %TEMP_GIT_PATH% 

    :: Clone repository
    CMD "Running Backup" /C "git clone git@github.com:Ender-ing/host.git %TEMP_GIT_PATH%"

    :: Return to the original directory
    popd

    :: Check if the folder was created successfully
    if exist %TEMP_GIT_PATH%\.git (
        echo The temporary git folder %TEMP_GIT_PATH% has been created successfully!
    ) else (
        echo Error creating git folder. Check permissions or path.
        exit 1
    )
)