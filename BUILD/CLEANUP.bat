@echo off

:: This file is meant to empty the .OUTPUT directory!
echo [44;45m Cleaning up .OUTPUT directory... [0m

:: Get environment variables
FOR /F "tokens=*" %%i in (../.secret.env) do SET %%i
call ./SAFETY.bat || ( set errorTrigger="call" && goto local_bat_error )
if %errorlevel% NEQ 0 ( set errorTrigger="level" && goto local_bat_error )

:: Attempt to delete the folder
rmdir /s /q %OUTPUT_PATH% 2>nul

:: Check if deletion was successful
if exist %OUTPUT_PATH% (
    echo Folder deletion failed. Please check permissions or if the folder is in use.
    exit 1
) else (
    :: Create the folder (with .git folder)
    CMD "Running Backup" /C "git clone git@github.com:Ender-ing/host.git %OUTPUT_PATH%"

    :: Change to the target directory 
    pushd %OUTPUT_PATH% 

    :: Iterate through each folder in the directory
    for /D %%f in (*) do (
        :: Only process folders that don't have a dot in their name
        set name=%%~f
        IF NOT "!name:~0,1!" == "." (
            :: Delete folder
            rd /s /q "%%f"
        )
    )

    :: Return to the original directory
    popd

    :: Check if the folder was created successfully
    if exist %OUTPUT_PATH% (
        echo The output folder %OUTPUT_PATH% has been cleaned up successfully!
    ) else (
        echo Error creating folder. Check permissions or path.
        exit 1
    )
)
