<#
  Synchronise le portfolio avec GitHub : commit + push automatiques.
  Chaque push déclenche le workflow « Déploiement GitHub Pages » (site à jour en ~1 min).

    powershell -ExecutionPolicy Bypass -File scripts/auto-sync.ps1         surveille le dossier en continu
    powershell -ExecutionPolicy Bypass -File scripts/auto-sync.ps1 -Once   synchronise une fois puis quitte

  Le mode continu est lancé par VS Code à l'ouverture du dossier (.vscode/tasks.json),
  le mode -Once par Claude Code à la fin de chaque réponse (hook Stop dans .claude/settings.json).
#>
param(
  [switch]$Once,
  # secondes sans nouvelle modification avant d'envoyer
  [int]$Delay = 8
)

# git et gh ont pu être installés après l'ouverture de VS Code
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root

function Write-Log([string]$text) { Write-Host ('[{0:HH:mm:ss}] {1}' -f (Get-Date), $text) }

# Commit de tout ce qui a changé, puis push. Renvoie un message, ou $null s'il n'y avait rien à envoyer.
function Sync-GitHub {
  # VS Code et Claude Code peuvent lancer la synchro en même temps : un seul passage à la fois
  $mutex = New-Object System.Threading.Mutex($false, 'PortfolioNathanTogoloAutoSync')
  try { $null = $mutex.WaitOne(60000) } catch [System.Threading.AbandonedMutexException] {}
  try {
    $summary = $null
    if (git status --porcelain) {
      git add -A
      $files = @(git -c core.quotepath=false diff --cached --name-only)
      if ($files.Count -gt 0) {
        $summary = ($files | Select-Object -First 3) -join ', '
        if ($files.Count -gt 3) { $summary += " (+$($files.Count - 3))" }
        # message passé par fichier UTF-8 pour garder les accents
        $msgFile = Join-Path $env:TEMP 'portfolio-auto-sync-msg.txt'
        [IO.File]::WriteAllText($msgFile, "Mise à jour : $summary", (New-Object Text.UTF8Encoding $false))
        git commit -q -F $msgFile
        Remove-Item -LiteralPath $msgFile -ErrorAction SilentlyContinue
      }
    }

    $ahead = [int](git rev-list --count '@{u}..HEAD' 2>$null)
    if ($ahead -eq 0) { return $null }

    # récupère d'abord ce qui aurait été modifié directement sur github.com
    git pull -q --rebase 2>$null
    if ($LASTEXITCODE -ne 0) {
      git rebase --abort 2>$null
      return "Conflit avec GitHub : rien n'a été envoyé. Les modifications restent en local."
    }
    git push -q 2>$null
    if ($LASTEXITCODE -ne 0) { return "Échec de l'envoi sur GitHub (connexion ?). Nouvel essai à la prochaine modification." }

    $sha = git rev-parse --short HEAD
    if ($summary) { return "Envoyé sur GitHub ($sha) : $summary. Site à jour dans ~1 min." }
    return "Envoyé sur GitHub ($sha). Site à jour dans ~1 min."
  }
  finally { $mutex.ReleaseMutex(); $mutex.Dispose() }
}

# Empreinte des fichiers modifiés (chemin + date + taille) : change à chaque enregistrement
function Get-WorkingState {
  $lines = @(git -c core.quotepath=false status --porcelain -uall)
  ($lines | ForEach-Object {
    $path = $_.Substring(3).Trim('"')
    if ($path -like '* -> *') { $path = ($path -split ' -> ')[-1].Trim('"') }
    $item = Get-Item -LiteralPath (Join-Path $root $path) -ErrorAction SilentlyContinue
    if ($item) { "$_|$($item.LastWriteTimeUtc.Ticks)|$($item.Length)" } else { $_ }
  }) -join "`n"
}

if ($Once) {
  $result = Sync-GitHub
  if ($result) {
    # sortie JSON pour Claude Code ; accents échappés car la console Windows n'est pas en UTF-8
    $json = @{ systemMessage = $result } | ConvertTo-Json -Compress
    [regex]::Replace($json, '[^\x00-\x7F]', { param($m) '\u{0:x4}' -f [int][char]$m.Value })
  }
  exit 0
}

Write-Log "Synchro GitHub active pour $root"
Write-Log "Chaque modification est envoyée $Delay s après le dernier enregistrement."
$result = Sync-GitHub
if ($result) { Write-Log $result }

$last = Get-WorkingState
$since = Get-Date
$tick = 0
while ($true) {
  Start-Sleep -Seconds 2
  $state = Get-WorkingState
  if ($state -ne $last) {
    $last = $state
    $since = Get-Date
  }
  elseif ($state -and ((Get-Date) - $since).TotalSeconds -ge $Delay) {
    $result = Sync-GitHub
    if ($result) { Write-Log $result }
    $last = Get-WorkingState
  }
  elseif (-not $state -and (++$tick % 30) -eq 0) {
    # commits faits à la main mais pas encore envoyés
    $result = Sync-GitHub
    if ($result) { Write-Log $result }
  }
}
