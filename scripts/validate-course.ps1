# validate-course.ps1 — mechanical checks for the AI-DLC course player
# Usage:
#   .\scripts\validate-course.ps1              # whole-file checks only
#   .\scripts\validate-course.ps1 -Module M05  # whole-file + per-module checks
# Requires: Node.js on PATH (for the syntax gate)

param(
    [string]$Module = ""
)

$ErrorActionPreference = "Stop"
$kitRoot = Split-Path -Parent $PSScriptRoot
$htmlPath = Join-Path $kitRoot "course\index.html"
$failures = @()
$passes = 0

function Check($name, $ok) {
    if ($ok) { $script:passes++; Write-Host "  PASS  $name" -ForegroundColor Green }
    else { $script:failures += $name; Write-Host "  FAIL  $name" -ForegroundColor Red }
}

Write-Host "`n=== AI-DLC course validation ===" -ForegroundColor Cyan

if (-not (Test-Path $htmlPath)) { Write-Host "course\index.html not found" -ForegroundColor Red; exit 1 }
$html = Get-Content $htmlPath -Raw -Encoding UTF8

# --- Whole-file checks -------------------------------------------------------
Write-Host "`n[Whole file]"
Check "Injection marker present exactly once" `
    (([regex]::Matches($html, [regex]::Escape("/* {{MODULE_INJECTION_POINT}} */"))).Count -eq 1)
Check "No localStorage/sessionStorage" `
    ($html -notmatch "localStorage|sessionStorage")
Check "MODS array declared" ($html -match "const\s+MODS\s*=")
Check "TRACK_META declared" ($html -match "const\s+TRACK_META\s*=")
Check "Fonts: Fraunces + JetBrains Mono referenced" `
    (($html -match "Fraunces") -and ($html -match "JetBrains\+?Mono|JetBrains Mono"))
Check "File under 2.5 MB" ((Get-Item $htmlPath).Length -lt 2.5MB)

# --- Node syntax gate --------------------------------------------------------
Write-Host "`n[Syntax gate]"
$scriptMatch = [regex]::Match($html, "(?s)<script>(.*)</script>\s*</body>")
if (-not $scriptMatch.Success) {
    Check "Main <script> block found" $false
} else {
    Check "Main <script> block found" $true
    $tmpJs = Join-Path $env:TEMP "aidlc-course-check.js"
    Set-Content -Path $tmpJs -Value $scriptMatch.Groups[1].Value -Encoding UTF8
    $node = Get-Command node -ErrorAction SilentlyContinue
    if ($null -eq $node) {
        Check "node --check (Node.js on PATH)" $false
    } else {
        & node --check $tmpJs 2>$null
        Check "node --check passes" ($LASTEXITCODE -eq 0)
    }
    Remove-Item $tmpJs -ErrorAction SilentlyContinue
}

# --- Per-module checks -------------------------------------------------------
if ($Module -ne "") {
    Write-Host "`n[Module $Module]"
    $modPattern = "(?s)\{\s*id:\s*""$Module"".*?\n\s*\},"
    $modMatch = [regex]::Match($html, $modPattern)
    Check "Module object present" $modMatch.Success
    if ($modMatch.Success) {
        $mod = $modMatch.Value
        Check "Required fields (track/title/minutes/audience/body)" `
            (($mod -match "track:") -and ($mod -match "title:") -and ($mod -match "minutes:") `
             -and ($mod -match "audience:") -and ($mod -match "body:"))
        Check "audience is leader|practitioner|both" `
            ($mod -match 'audience:\s*"(leader|practitioner|both)"')
        Check "Has inline SVG with viewBox" (($mod -match "<svg") -and ($mod -match "viewBox"))
        Check "Has exactly one .analogy block (Lakeview build)" `
            (([regex]::Matches($mod, 'class="analogy"')).Count -eq 1)
        Check "Has .lab section" ($mod -match 'class=""?lab')
        Check "Has .recap section" ($mod -match 'class=""?recap')
        Check "No hard-coded hex colors in body" `
            (-not ([regex]::Match($mod, 'body:\s*`(?s).*').Value -match "#[0-9a-fA-F]{6}\b"))
    }
    Check "Standalone lab file exists (labs\$Module-lab.md)" `
        (Test-Path (Join-Path $kitRoot "labs\$Module-lab.md"))
}

# --- Summary -----------------------------------------------------------------
Write-Host "`n=== Summary: $passes passed, $($failures.Count) failed ===" -ForegroundColor Cyan
if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}
exit 0
