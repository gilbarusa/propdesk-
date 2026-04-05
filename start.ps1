# ============================================
#   Willow Property Manager - Local Server
# ============================================
# Double-click this file or run: powershell -ExecutionPolicy Bypass -File start.ps1

$port = 8080
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "  ============================================" -ForegroundColor DarkYellow
Write-Host "    Willow Property Manager" -ForegroundColor Yellow
Write-Host "    Local Server starting..." -ForegroundColor DarkYellow
Write-Host "  ============================================" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "  Serving from: $root" -ForegroundColor Gray
Write-Host "  URL: http://localhost:$port" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Open browser
Start-Process "http://localhost:$port"

# Create a simple HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "  Server running..." -ForegroundColor Green

$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ts"   = "application/typescript"
    ".sql"  = "text/plain"
    ".md"   = "text/plain"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }

        $filePath = Join-Path $root $localPath.Replace("/", "\")

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

            $response.ContentType = $contentType
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)

            $timestamp = Get-Date -Format "HH:mm:ss"
            Write-Host "  [$timestamp] 200 $localPath" -ForegroundColor DarkGray
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Not Found: $localPath")
            $response.OutputStream.Write($msg, 0, $msg.Length)

            $timestamp = Get-Date -Format "HH:mm:ss"
            Write-Host "  [$timestamp] 404 $localPath" -ForegroundColor Red
        }

        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "`n  Server stopped." -ForegroundColor Yellow
}
