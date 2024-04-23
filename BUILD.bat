@echo off

:: Buuil all global index resources (@vite)
CMD "Running Backup" /C "build-global-index.bat"

:: Build all needed material resources (@material)
CMD "Running Backup" /C "build-material-imports.bat"
