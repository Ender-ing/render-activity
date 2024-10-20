@echo off
:: This file is meant to handle the processing of the Docusaurus project

echo [44;45m Building Docusaurus project... [0m

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
pushd %DOCUSAURUS_PATH%

:: Delete cache file
del "%DOCUSAURUS_PATH%\.docusaurus" > NUL
del "%DOCUSAURUS_PATH%\build" > NUL

:: Do other stuff before building the project!

:: build the project
CMD "Running Backup" /C "npm run build"

:: Move files to the docs subdomain directory!
robocopy "%DOCUSAURUS_PATH%\build" "%OUTPUT_PATH%\docs" /s /mov /e

:: Return to the original directory
popd