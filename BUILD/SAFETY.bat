@echo off
setlocal enabledelayedexpansion

:: Handle environment variables checks

:: Skip exit
goto _cv_content_

:: Exit code
:_cv_exit_
echo Variable "%_cv_value_%" is less than 16 characters.
exit /B 1

:: Content
:_cv_content_

:: You may use this code to check the value of a variable
:: set _cv_value_=%MY_VAR%
:: if "!_cv_value_:~18!" EQU "" ( goto _cv_exit_ )
:: set _cv_value_=

set _cv_value_=%OUTPUT_PATH%::
if "!_cv_value_:~18!" EQU "" ( goto _cv_exit_ )
set _cv_value_=

set _cv_value_=%RESOURCES_PATH%::
if "!_cv_value_:~18!" EQU "" ( goto _cv_exit_ )
set _cv_value_=

set _cv_value_=%BUILD_PATH%::
if "!_cv_value_:~18!" EQU "" ( goto _cv_exit_ )
set _cv_value_=

set _cv_value_=%ROOTS_PATH%::
if "!_cv_value_:~18!" EQU "" ( goto _cv_exit_ )
set _cv_value_=

:: Backup checks (with original names)
:: if "!MY_VAR:~16!" EQU "" ( goto _cv_exit_ );
set _cv_value_=Backup_Check

if "!OUTPUT_PATH:~16!" EQU "" ( goto _cv_exit_ );

if "!RESOURCES_PATH:~16!" EQU "" ( goto _cv_exit_ );

if "!BUILD_PATH:~16!" EQU "" ( goto _cv_exit_ );

if "!ROOTS_PATH:~16!" EQU "" ( goto _cv_exit_ );

exit /B 0