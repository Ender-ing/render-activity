@echo off

:: This file is meant to empty the .OUTPUT directory!
echo [44;45m Cleaning up .OUTPUT directory... [0m

:: Get environment variables
FOR /F "tokens=*" %%i in (../.env) do SET %%i

:: Attempt to delete the folder
rmdir /s /q %OUTPUT_PATH% 2>nul

:: Check if deletion was successful
if exist %OUTPUT_PATH% (
    echo Folder deletion failed. Please check permissions or if the folder is in use.
    exit 1
) else (
    :: Create the folder (handle potential errors)
    mkdir %OUTPUT_PATH% 2>nul

    :: Check if the folder was created successfully
    if exist %OUTPUT_PATH% (
        echo The output folder %OUTPUT_PATH% has been cleaned up successfully!
    ) else (
        echo Error creating folder. Check permissions or path.
        exit 1
    )
)
