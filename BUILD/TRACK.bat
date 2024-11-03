@echo off
:: This file is meant to generate build tracking files!

echo [44;45m Generating build tracking files... [0m

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

:: Generate a random 32-character hexadecimal string using PowerShell
powershell -Command "[System.Guid]::NewGuid().ToString('N')" > build.txt

:: Echo the time to the build file
:: (Need to actually add this later on...)
echo "YYYY-MM-DD HH:MM:SS TT" >> build.txt

:: Return to the original directory
popd