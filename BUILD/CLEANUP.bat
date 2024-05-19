@echo off

:: This file is meant to empty the .OUTPUT directory!
echo [44;45m Cleaning up .OUTPUT directory... [0m

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

:: Temporary git path
set TEMP_GIT_PATH=%TEMP%\endering-build-temp-git

:: Attempt to delete the folder
rmdir /s /q %OUTPUT_PATH% 2>nul

:: Check if deletion was successful
if exist %OUTPUT_PATH% (
    echo Folder deletion failed. Please check permissions or if the folder is in use.
    exit 1
) else (
    :: Create directory
    mkdir %OUTPUT_PATH%

    :: Change to the target directory 
    pushd %TEMP_GIT_PATH%

    :: Copy .git folder
    echo Copying .git directory...
    xcopy /E /H /C /Y /I .git %OUTPUT_PATH%\.git

    :: Copy root files
    for %%f in (*) do (
        echo Copying %%f...
        copy %TEMP_GIT_PATH%\%%f %OUTPUT_PATH%\%%f
    )

    :: Return to the original directory
    popd

    :: Check if the folder was created successfully
    if exist %OUTPUT_PATH%\.git (
        echo The output folder %OUTPUT_PATH% has been cleaned up successfully!
    ) else (
        echo Error creating output folder. Check permissions or path.
        exit 1
    )
)
