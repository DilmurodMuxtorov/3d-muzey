$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$stateFile = Join-Path $projectRoot '.runtime\server.json'
if (-not (Test-Path -LiteralPath $stateFile)) { Write-Output 'Server ishlamayapti.'; exit 0 }
$state = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
$expectedServer = Join-Path $projectRoot 'server.mjs'
$ownedProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $([int]$state.pid)" -ErrorAction SilentlyContinue
if ($ownedProcess -and $ownedProcess.Name -eq 'node.exe' -and $ownedProcess.CommandLine.Contains('"' + $expectedServer + '"')) {
    Stop-Process -Id ([int]$state.pid)
    Write-Output 'Mahalliy server toxtatildi.'
} else { Write-Output 'Ushbu loyiha serveri ishlamayapti.' }
