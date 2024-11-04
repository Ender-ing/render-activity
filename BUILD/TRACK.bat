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

:: Create the file and add a note to it!
echo ^(?) This is an internal file, do NOT share its contents. > build.txt

:: Generate a random 32-character hexadecimal string using PowerShell
for /f "tokens=*" %%a in ('powershell -Command "[System.Guid]::NewGuid().ToString('N')"' ) do set "randomHash=%%a"

:: Get the local timezone and time
for /f "tokens=*" %%a in ('powershell "(Get-TimeZone).DisplayName"') do set timezone=%%a
for /f "tokens=*" %%a in ('powershell Get-Date') do set fulldate=%%a

:: Echo the time to the build file
:: (Need to actually add this later on...)
echo ^(!) Build info: >> build.txt
echo Build R-Hash:              %randomHash% >> build.txt
echo Build Timezone:            %timezone% >> build.txt
echo Build Time:                %fulldate% >> build.txt

:: Get all system info
set sysInfo=(systeminfo)

:: Get info about the person who built this!
echo ^(!) User info: >> build.txt
echo User Name:                 %USERNAME% >> build.txt
%sysInfo% | findstr /i /c:"Host Name" >> build.txt

:: Get basic system info
echo ^(!) System info: >> build.txt
%sysInfo% | findstr /i /c:"OS Name" /c:"OS Version" /c:"System Manufacturer" /c:"System Model" /c:"System Type" /c:"Processor(s)" /c:"BIOS Version / Date" /c:"Total Physical Memory"  >> build.txt

:: Return to the original directory
popd