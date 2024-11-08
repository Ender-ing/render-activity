@echo off
:: This file is meant to execute JSON after: source build actions

echo [44;45m Cleaning up OUTPUT root files... [0m

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
pushd %OUTPUT_PATH%

:: Check all directory actions (roots.manifest.json & gen.version.txt files will be updated!)
CMD "Running Backup" /C "node %BUILD_PATH%\node_js\utility\source_actions.js %OUTPUT_PATH% %BUILD_PATH%\roots.manifest.json 0"

:: Move files and delete .secrets folder
xcopy /E /I "%OUTPUT_PATH%\.secrets\*" "%OUTPUT_PATH%" 
del /f /q %OUTPUT_PATH%\.secrets > NUL 2>&1
rmdir /s /q %OUTPUT_PATH%\.secrets > NUL 2>&1

:: Return to the original directory
popd