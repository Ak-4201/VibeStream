@echo off
setlocal
set "MAVEN_PROJECTBASEDIR=%~dp0"
if defined JAVA_HOME set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
if not defined JAVA_EXE for %%i in (java.exe) do set "JAVA_EXE=%%~$PATH:i"
if not defined JAVA_EXE echo JAVA_HOME not set and java not in PATH. exit /b 1
"%JAVA_EXE%" -classpath "%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*
exit /b %ERRORLEVEL%
