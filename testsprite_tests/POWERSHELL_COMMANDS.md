# TestSprite PowerShell Commands

## Quick Reference

### 1. Check TestSprite Package Location
```powershell
Test-Path "C:\Users\AMICLONE\AppData\Local\npm-cache\_npx\8ddf6bea01b2519d\node_modules\@testsprite\testsprite-mcp\dist\index.js"
```

### 2. Run TestSprite Tests
```powershell
cd D:\PNP-DS
node C:\Users\AMICLONE\AppData\Local\npm-cache\_npx\8ddf6bea01b2519d\node_modules\@testsprite\testsprite-mcp\dist\index.js generateCodeAndExecute
```

### 3. Check if Dev Server is Running
```powershell
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Dev server is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Dev server is not running" -ForegroundColor Red
}
```

### 4. Start Dev Server
```powershell
cd D:\PNP-DS
npm run dev
```

### 5. Start Dev Server in Background
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\PNP-DS'; npm run dev"
```

### 6. Check Test Results
```powershell
Get-Content D:\PNP-DS\testsprite_tests\tmp\test_results.json | ConvertFrom-Json | Format-Table title, testStatus
```

### 7. View Failed Tests Only
```powershell
$results = Get-Content D:\PNP-DS\testsprite_tests\tmp\test_results.json | ConvertFrom-Json
$results | Where-Object { $_.testStatus -eq "FAILED" } | Format-Table title, testError
```

### 8. Count Test Results
```powershell
$results = Get-Content D:\PNP-DS\testsprite_tests\tmp\test_results.json | ConvertFrom-Json
Write-Host "Total: $($results.Count)" -ForegroundColor Cyan
Write-Host "Passed: $(($results | Where-Object { $_.testStatus -eq 'PASSED' }).Count)" -ForegroundColor Green
Write-Host "Failed: $(($results | Where-Object { $_.testStatus -eq 'FAILED' }).Count)" -ForegroundColor Red
```

### 9. Run TestSprite with Custom Instructions
```powershell
cd D:\PNP-DS
$config = Get-Content testsprite_tests\tmp\config.json | ConvertFrom-Json
$config.executionArgs.additionalInstruction = "Your custom test instructions here"
$config | ConvertTo-Json -Depth 10 | Set-Content testsprite_tests\tmp\config.json
node C:\Users\AMICLONE\AppData\Local\npm-cache\_npx\8ddf6bea01b2519d\node_modules\@testsprite\testsprite-mcp\dist\index.js generateCodeAndExecute
```

### 10. Create PowerShell Alias for TestSprite
```powershell
# Add to your PowerShell profile
function Run-TestSprite {
    param(
        [string]$Instruction = ""
    )
    
    $TestSpritePath = "C:\Users\AMICLONE\AppData\Local\npm-cache\_npx\8ddf6bea01b2519d\node_modules\@testsprite\testsprite-mcp\dist\index.js"
    $ProjectPath = "D:\PNP-DS"
    
    Set-Location $ProjectPath
    
    if ($Instruction) {
        $config = Get-Content testsprite_tests\tmp\config.json | ConvertFrom-Json
        $config.executionArgs.additionalInstruction = $Instruction
        $config | ConvertTo-Json -Depth 10 | Set-Content testsprite_tests\tmp\config.json
    }
    
    node $TestSpritePath generateCodeAndExecute
}

# Usage: Run-TestSprite
# Usage: Run-TestSprite -Instruction "Test all edge cases"
```

## Using the Test Runner Script

```powershell
# Run the provided script
.\testsprite_tests\run-tests.ps1
```

## Notes

- The `testsprite-mcp` package is not available via `npx` - it's only available as a cached version
- Always ensure the dev server is running on port 3000 before running tests
- Test results are saved to `testsprite_tests\tmp\test_results.json`
- Test videos are available via the `testVisualization` URLs in the results
