<#
Start both backend and frontend for development on Windows.

Usage:
  .\scripts\start-dev.ps1

If execution is blocked, run in PowerShell:
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
#>

param(
  [switch]$NoNewWindow
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$root = Split-Path -Parent $scriptDir
Write-Host "Repository root: $root"

# Basic checks
if (-not (Test-Path (Join-Path $root 'package.json'))) {
  Write-Error "package.json not found in repository root: $root"
  exit 1
}
if (-not (Test-Path (Join-Path $root 'frontend'))) {
  Write-Error "Frontend folder 'frontend' not found under repository root: $root"
  exit 1
}

function Start-TerminalProcess($cwd, $command) {
  $cwdEscaped = $cwd -replace "'", "''"
  $psCommand = "Set-Location -Path '$cwdEscaped'; $command"
  Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", $psCommand
}

if ($NoNewWindow) {
  Write-Host "Starting backend and frontend as background jobs in current window..."
  Start-Job -ScriptBlock { cd $using:root; npm run start } | Out-Null
  Start-Job -ScriptBlock { cd (Join-Path $using:root 'frontend'); npm run dev } | Out-Null
  Write-Host "Started jobs. Use Get-Job to inspect and Receive-Job to view output."
} else {
  Write-Host "Opening two PowerShell windows: backend and frontend"
  Start-TerminalProcess $root "npm run start"
  Start-TerminalProcess (Join-Path $root 'frontend') "npm run dev"
  Write-Host "Launched both processes in new windows."
}
