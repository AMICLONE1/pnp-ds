# Cloudflare Tunnel Setup

## Overview

Cloudflare Tunnel (cloudflared) allows you to expose your local development server to the internet, making it accessible via a public URL. This is useful for:
- Testing with external services (like TestSprite)
- Sharing your app with team members
- Testing on mobile devices
- Webhook testing

## Installation

### Option 1: Using winget (Recommended for Windows)

```powershell
winget install Cloudflare.cloudflared
```

After installation, restart your terminal or refresh the PATH:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Option 2: Manual Download

1. Visit: https://github.com/cloudflare/cloudflared/releases
2. Download `cloudflared-windows-amd64.exe` (or appropriate version)
3. Rename to `cloudflared.exe`
4. Add to PATH or place in project directory

### Option 3: Using Chocolatey

```powershell
choco install cloudflared
```

### Option 4: Using Scoop

```powershell
scoop install cloudflared
```

## Verification

After installation, verify it works:

```powershell
cloudflared --version
```

## Usage

### Basic Tunnel (Temporary URL)

Start a tunnel to your local development server:

```powershell
cloudflared tunnel --url http://localhost:3000
```

This will:
- Create a temporary public URL (e.g., `https://xxxxx.trycloudflare.com`)
- Tunnel all traffic to `http://localhost:3000`
- Display the URL in the terminal

### Start in New Terminal Window

**Option 1: Using the helper script (Recommended)**
```powershell
.\start-cloudflared.ps1
```

**Option 2: Manual command**
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cloudflared tunnel --url http://localhost:3000"
```

**Option 3: Using full path (if not in PATH)**
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& 'C:\Program Files (x86)\cloudflared\cloudflared.exe' tunnel --url http://localhost:3000"
```

### Start with Custom Port

If your dev server runs on a different port:

```powershell
cloudflared tunnel --url http://localhost:8080
```

## Important Notes

1. **Temporary URLs**: The free tunnel URLs are temporary and change each time you restart cloudflared
2. **Dev Server Required**: Make sure your Next.js dev server is running (`npm run dev`) before starting the tunnel
3. **Security**: These URLs are public - don't expose sensitive data
4. **Rate Limits**: Free tunnels have rate limits

## Troubleshooting

### "cloudflared is not recognized"

**Solution 1**: Restart your terminal/PowerShell after installation

**Solution 2**: Manually add to PATH:
```powershell
# Find where cloudflared was installed (usually in AppData or Program Files)
# Then add to PATH:
$env:Path += ";C:\path\to\cloudflared"
```

**Solution 3**: Use full path:
```powershell
& "C:\Users\$env:USERNAME\AppData\Local\Microsoft\WinGet\Packages\Cloudflare.cloudflared_Microsoft.Winget.Source_*\cloudflared.exe" tunnel --url http://localhost:3000
```

### Connection Refused

- Ensure your dev server is running on the specified port
- Check firewall settings
- Verify the port number is correct

### Tunnel Closes Immediately

- Check if cloudflared has proper permissions
- Verify internet connection
- Check cloudflared logs for errors

## Advanced Usage

### Named Tunnels (Persistent URLs)

For persistent URLs, you need to:
1. Create a Cloudflare account
2. Create a named tunnel
3. Configure it with your domain

See: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

### Multiple Tunnels

You can run multiple tunnels simultaneously:
```powershell
# Terminal 1
cloudflared tunnel --url http://localhost:3000

# Terminal 2
cloudflared tunnel --url http://localhost:3001
```

## Integration with TestSprite

When using TestSprite, you can:
1. Start cloudflared tunnel
2. Copy the public URL
3. Update TestSprite config with the public URL instead of localhost

## Quick Reference

```powershell
# Start tunnel (using helper script - recommended)
.\start-cloudflared.ps1

# Start tunnel (manual)
cloudflared tunnel --url http://localhost:3000

# Start in new window (manual)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cloudflared tunnel --url http://localhost:3000"

# Check version
cloudflared --version

# Get help
cloudflared tunnel --help
```

## Helper Script

A PowerShell helper script (`start-cloudflared.ps1`) is available in the project root for easy tunnel management. It:
- Checks if cloudflared is installed
- Starts the tunnel in a new terminal window
- Provides clear status messages
- Handles path issues automatically

## Alternative Solutions

If cloudflared doesn't work, consider:
- **ngrok**: `ngrok http 3000`
- **localtunnel**: `npx localtunnel --port 3000`
- **serveo**: `ssh -R 80:localhost:3000 serveo.net`

---

**Last Updated**: January 2026
