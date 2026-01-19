# TestSprite Test Runner Script
# This script runs TestSprite tests using the cached MCP package

$TestSpritePath = "C:\Users\AMICLONE\AppData\Local\npm-cache\_npx\8ddf6bea01b2519d\node_modules\@testsprite\testsprite-mcp\dist\index.js"
$ProjectPath = "D:\PNP-DS"

Write-Host "`n🚀 Starting TestSprite Test Execution...`n" -ForegroundColor Cyan

# Check if dev server is running
Write-Host "Checking if dev server is running on port 3000..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 5 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Dev server is running`n" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Dev server not running. Please start it with: npm run dev`n" -ForegroundColor Yellow
    Write-Host "Starting dev server in background..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectPath'; npm run dev" -WindowStyle Minimized
    Write-Host "Waiting 15 seconds for server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
}

# Change to project directory
Set-Location $ProjectPath

# Run TestSprite
Write-Host "Executing TestSprite tests...`n" -ForegroundColor Cyan
node $TestSpritePath generateCodeAndExecute

Write-Host "`n✅ Test execution complete!`n" -ForegroundColor Green
