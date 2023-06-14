@echo off
cls
color b
mode con cols=60 lines=20
title node_app
echo.
echo   Ejecutando la app, [NO_NAME Code inside]
echo   [in the memory of Livan @zerotaku]
prompt $G$G
if exist "%~dp0nodejs" set %path%=%path%;%~dp0nodejs
if exist "%~dp0nodejs" pushd %~dp0nodejs
%~d0
cd %~dp0
ECHO.
@echo on

::npm run dev
node src/app.js

@pause