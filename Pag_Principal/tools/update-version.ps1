# update-version.ps1
# Gera um arquivo version.json em Pag_Principal/html/version.json
# Baseado no número de commits do repositório Git (patch = número de commits)
# Execute a partir da raiz do repositório ou forneça o caminho do repositório como primeiro argumento.

param(
    [string]$RepoPath = "$PSScriptRoot\..\..\",
    [string]$OutPath = "$PSScriptRoot\..\html\version.json",
    [string]$Tag = "Alpha",
    [int]$Major = 1,
    [int]$Minor = 0,
    [int]$MaxUpdates = 50
)

# Resolve caminhos
$RepoPath = Resolve-Path -Path $RepoPath
$OutPath = Resolve-Path -Path $OutPath -ErrorAction SilentlyContinue
if (-not $OutPath) {
    # se não existir ainda, constrói caminho absoluto
    $OutPath = Join-Path -Path (Resolve-Path "$PSScriptRoot\..\html") -ChildPath "version.json"
}

# Função para obter contagem de commits via git
function Get-GitCommitCount($path) {
    try {
        $startInfo = New-Object System.Diagnostics.ProcessStartInfo
        $startInfo.FileName = 'git'
        $startInfo.Arguments = 'rev-list --count HEAD'
        $startInfo.WorkingDirectory = $path
        $startInfo.RedirectStandardOutput = $true
        $startInfo.UseShellExecute = $false
        $startInfo.CreateNoWindow = $true

        $p = New-Object System.Diagnostics.Process
        $p.StartInfo = $startInfo
        $p.Start() | Out-Null
        $out = $p.StandardOutput.ReadToEnd().Trim()
        $p.WaitForExit()
        if ($p.ExitCode -eq 0 -and $out -match '^[0-9]+$') {
            return [int]$out
        }
    } catch {
        # ignore
    }
    return $null
}

# Obtém contagem de commits
$commitCount = Get-GitCommitCount -path $RepoPath
if (-not $commitCount) {
    Write-Host "Aviso: não foi possível obter contagem de commits via git. Usando patch=0." -ForegroundColor Yellow
    $commitCount = 0
}

# Monta versão
$patch = $commitCount
$display = "${Tag} ${Major}.${Minor}.${patch}"
# Formata a data como DD-MM-YYYY (dia-mês-ano)
$date = (Get-Date).ToString('dd-MM-yyyy')

# Objeto JSON
$jsonObj = [PSCustomObject]@{
    tag = $Tag
    major = $Major
    minor = $Minor
    patch = $patch
    display = $display
    date = $date
}

# Grava version.json no OutPath (Pag_Principal/html/version.json) e também na raiz do repositório (fallback)
$json = $jsonObj | ConvertTo-Json -Depth 3
Set-Content -Path $OutPath -Value $json -Encoding UTF8
Write-Host "Wrote version to $OutPath -> $display ($date)"

$repoRootVersion = Join-Path -Path $RepoPath -ChildPath "version.json"
Set-Content -Path $repoRootVersion -Value $json -Encoding UTF8
Write-Host "Wrote version to $repoRootVersion -> $display ($date)"

# === GERA updates.json a partir do git log ===
function Get-GitLog($path, $max){
    try{
        $startInfo = New-Object System.Diagnostics.ProcessStartInfo
        $startInfo.FileName = 'git'
        $startInfo.Arguments = "log -n $max --pretty=format:%ad:::%s --date=short"
        $startInfo.WorkingDirectory = $path
        $startInfo.RedirectStandardOutput = $true
        $startInfo.UseShellExecute = $false
        $startInfo.CreateNoWindow = $true

        $p = New-Object System.Diagnostics.Process
        $p.StartInfo = $startInfo
        $p.Start() | Out-Null
        $out = $p.StandardOutput.ReadToEnd().Trim()
        $p.WaitForExit()
        if ($p.ExitCode -eq 0) { return $out }
    } catch { }
    return $null
}

$rawLog = Get-GitLog -path $RepoPath -max $MaxUpdates
if ($rawLog) {
    $lines = $rawLog -split "\n"
    $updates = @()
    foreach ($line in $lines) {
        if ($line -match "^(.*?):::(.*)$") {
            $d = $matches[1].Trim()
            $m = $matches[2].Trim()
            # Remove acentos (diacríticos) para evitar problemas de leitura nos logs
            try {
                $norm = $m.Normalize([System.Text.NormalizationForm]::FormD)
                $m = ([regex]'\p{Mn}').Replace($norm, '')
            } catch {
                # se falhar, mantém a mensagem original
            }
            # git --date=short produz YYYY-MM-DD; converte para DD-MM-YYYY (dia-mês-ano)
            if ($d -match '^(\d{4})-(\d{2})-(\d{2})$') {
                $year = $matches[1]
                $month = $matches[2]
                $day = $matches[3]
                $d = "$day-$month-$year"
            }
            $updates += [PSCustomObject]@{ date = $d; message = $m }
        }
    }
    $updatesJson = $updates | ConvertTo-Json -Depth 4
    $repoRootUpdates = Join-Path -Path $RepoPath -ChildPath "updates.json"
    Set-Content -Path $repoRootUpdates -Value $updatesJson -Encoding UTF8
    Write-Host "Wrote updates to $repoRootUpdates (count: $($updates.Count))"

    # também grava cópia em Pag_Principal/html/updates.json
    $outUpdatesPath = Join-Path -Path (Resolve-Path "$PSScriptRoot\..\html") -ChildPath "updates.json"
    Set-Content -Path $outUpdatesPath -Value $updatesJson -Encoding UTF8
    Write-Host "Wrote updates to $outUpdatesPath (count: $($updates.Count))"
} else {
    Write-Host "Aviso: não foi possível obter git log para gerar updates.json." -ForegroundColor Yellow
}

# Exit com sucesso
exit 0
