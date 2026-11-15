param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$serverPath = Join-Path $projectRoot 'server.mjs'
$runtimePath = Join-Path $projectRoot '.runtime'
New-Item -ItemType Directory -Path $runtimePath -Force | Out-Null
function Get-MuseumHealth([int]$Port) {
    try { return Invoke-RestMethod -Uri "http://127.0.0.1:$Port/__health" -TimeoutSec 1 -ErrorAction Stop } catch { return $null }
}
$nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
$nodePath = if ($nodeCommand) { $nodeCommand.Source } else { $null }
if (-not $nodePath) {
    $savedNodePath = Join-Path $projectRoot 'runtime-node.txt'
    if (Test-Path -LiteralPath $savedNodePath) {
        $savedNode = (Get-Content -LiteralPath $savedNodePath -Raw).Trim()
        if (Test-Path -LiteralPath $savedNode) { $nodePath = $savedNode }
    }
}
if (-not $nodePath) {
    $normalNode = Join-Path $env:ProgramFiles 'nodejs\node.exe'
    if (Test-Path -LiteralPath $normalNode) { $nodePath = $normalNode }
}
if (-not $nodePath) {
    $runtimes = Get-ChildItem -Path "$env:ProgramFiles\WindowsApps\OpenAI.CodexPrimaryRuntime.*" -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending
    foreach ($runtime in $runtimes) {
        $candidateNode = Join-Path $runtime.FullName 'dependencies\node\bin\node.exe'
        if (Test-Path -LiteralPath $candidateNode) { $nodePath = $candidateNode; break }
    }
}
if (-not $nodePath) { throw 'Node.js topilmadi. https://nodejs.org dan Node.js ornating.' }
$ready = $null
foreach ($candidatePort in 4177..4186) {
    $health = Get-MuseumHealth $candidatePort
    if ($health -and $health.app -eq 'muzeycha-local' -and $health.version -eq 2 -and $health.root -eq $projectRoot) { $ready = $health; break }
    if (Get-NetTCPConnection -State Listen -LocalPort $candidatePort -ErrorAction SilentlyContinue) { continue }
    $serverProcess = Start-Process -FilePath $nodePath -ArgumentList @("`"$serverPath`"", '--port', "$candidatePort") -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimePath 'server.log') -RedirectStandardError (Join-Path $runtimePath 'server-error.log') -PassThru
    for ($attempt=0; $attempt -lt 30; $attempt++) {
        $health = Get-MuseumHealth $candidatePort
        if ($health -and $health.app -eq 'muzeycha-local' -and $health.pid -eq $serverProcess.Id) { $ready = $health; break }
        $serverProcess.Refresh()
        if ($serverProcess.HasExited) { break }
        Start-Sleep -Milliseconds 200
    }
    if ($ready) { break }
}
if (-not $ready) { throw "Sayt ishga tushmadi. Tekshiring: $runtimePath\server-error.log" }
$siteUrl = "http://127.0.0.1:$($ready.port)/"
@{ port=$ready.port; pid=$ready.pid; url=$siteUrl; server=$serverPath } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $runtimePath 'server.json') -Encoding UTF8
Write-Output "Sayt tayyor: $siteUrl"
Write-Output 'Server fon rejimida ishlaydi. Toxtatish uchun stop.cmd faylini oching.'
if (-not $NoBrowser) { Start-Process -FilePath $siteUrl }
