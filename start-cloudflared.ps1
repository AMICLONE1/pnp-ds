# Cloudflare Tunnel Starter Script
# This script starts cloudflared tunnel in a new terminal window

$cloudflaredPath = "C:\Program Files (x86)\cloudflared\cloudflared.exe"

# Check if cloudflared exists
if (-not (Test-Path $cloudflaredPath)) {
    Write-Host "❌ cloudflared not found at: $cloudflaredPath" -ForegroundColor Red
    Write-Host "`nPlease install cloudflared first:" -ForegroundColor Yellow
    Write-Host "  winget install Cloudflare.cloudflared" -ForegroundColor White
    Write-Host "  OR download from: https://github.com/cloudflare/cloudflared/releases`n" -ForegroundColor White
    exit 1
}

Write-Host "🚀 Starting Cloudflare Tunnel...`n" -ForegroundColor Cyan
Write-Host "Tunnel will expose: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Public URL will be displayed in the new window`n" -ForegroundColor Yellow

# Start cloudflared in new terminal window
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan
Write-Host '║     Cloudflare Tunnel - PowerNetPro Dev Server      ║' -ForegroundColor Cyan
Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Connecting to: http://localhost:3000' -ForegroundColor Yellow
Write-Host 'Waiting for public URL...' -ForegroundColor Yellow
Write-Host ''
& '$cloudflaredPath' tunnel --url http://localhost:3000
"@

Write-Host "✅ Tunnel started in new window!`n" -ForegroundColor Green
Write-Host "Make sure your dev server is running:" -ForegroundColor Yellow
Write-Host "  npm run dev`n" -ForegroundColor White
