@echo off
:: This file is meant to install all NodeJS modules used by the BUILD command!

cls

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

echo [101;93m INSTALLING NODEJS DEPENDENCIES! [0m

echo [44;45m INSTALLING GLOBAL NODEJS DEPENDENCIES... [0m

pushd %BUILD_PATH%\node_js\material-imports
CMD "Running Backup" /C "npm i"
popd
pushd %BUILD_PATH%\node_js\global-index
CMD "Running Backup" /C "npm i"
popd

echo [44;45m INSTALLING LOCAL NODEJS DEPENDENCIES... [0m

CMD "Running Backup" /C "npm install -g terser@latest"

echo [101;93m NODEJS DEPENDENCIES INSTALLED! [0m
