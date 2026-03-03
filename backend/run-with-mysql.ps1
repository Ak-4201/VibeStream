# Run backend with Aiven MySQL (Option A: env vars in PowerShell)
# From the backend folder: .\run-with-mysql.ps1

$env:SPRING_PROFILES_ACTIVE = "mysql"
# Set password from Aiven Console (Connection info). Do not commit the real password.
if (-not $env:SPRING_DATASOURCE_PASSWORD) { $env:SPRING_DATASOURCE_PASSWORD = "your-aiven-password" }

$backendDir = $PSScriptRoot
$wrapperJar = Join-Path $backendDir ".mvn\wrapper\maven-wrapper.jar"

# Prefer mvn if in PATH; else use Maven wrapper via Java (avoids batch-file path issues)
if (Get-Command mvn -ErrorAction SilentlyContinue) {
    Set-Location $backendDir
    mvn spring-boot:run
} else {
    $javaExe = if ($env:JAVA_HOME) { "$env:JAVA_HOME\bin\java.exe" } else { (Get-Command java -ErrorAction SilentlyContinue).Source }
    if (-not $javaExe) { Write-Error "Java not found. Set JAVA_HOME or add java to PATH."; exit 1 }
    Set-Location $backendDir
    & $javaExe -classpath $wrapperJar "-Dmaven.multiModuleProjectDirectory=$backendDir" org.apache.maven.wrapper.MavenWrapperMain spring-boot:run
}
