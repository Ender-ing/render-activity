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

:: Generate a random 32-character string
setlocal enabledelayedexpansion
set "randomString="
for /l %%n in (1,1,32) do (
    set /a randomChar=0x%random% %% 16
    set "randomChar=!randomChar:~-1!"
    if !randomChar! geq A (
        set "randomChar=!randomChar:A=a!"
    )
    set "randomString=!randomString!!randomChar!"
)

:: Change to the target directory 
pushd %OUTPUT_PATH%

:: Save this string in the file!
echo %randomString% > build.txt

:: Get the current time in GMT+2
for /f "tokens=1-6 delims=/: " %%a in ('date /t') do (
    set year=%%a
    set month=%%b
    set day=%%c
)
for /f "tokens=1-3 delims=:. " %%a in ('time /t') do (
    set hour=%%a
    set minute=%%b
    set second=%%c
)

:: Calculate GMT+2 time
set /a hour+=2
if %hour% geq 24 (
    set /a hour-=24
    set /a day+=1
)

:: Format the datetime string
set datetime=%year%-%month%-%day% %hour%-%minute%-%second%

:: Echo the time to the build file
echo %datetime% >> build.txt

:: Return to the original directory
popd