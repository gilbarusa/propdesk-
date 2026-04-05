@echo off
title Willow Property Manager - Local Server
echo.
echo   Starting Willow Property Manager...
echo   http://localhost:8080
echo.
echo   (Keep this window open. Close it to stop the server.)
echo.
start http://localhost:8080
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $listener = [System.Net.HttpListener]::new(); $listener.Prefixes.Add('http://localhost:8080/'); $listener.Start(); Write-Host 'Server running on http://localhost:8080'; while ($listener.IsListening) { $ctx = $listener.GetContext(); $path = $ctx.Request.Url.LocalPath; if ($path -eq '/') { $path = '/index.html' } $file = Join-Path '%~dp0' ($path -replace '/','\'); if (Test-Path $file) { $ext = [System.IO.Path]::GetExtension($file).ToLower(); $mime = @{'.html'='text/html';'.js'='application/javascript';'.css'='text/css';'.json'='application/json';'.png'='image/png';'.jpg'='image/jpeg';'.svg'='image/svg+xml';'.ico'='image/x-icon'}; $ct = if($mime[$ext]){$mime[$ext]}else{'application/octet-stream'}; $ctx.Response.ContentType = $ct; $bytes = [System.IO.File]::ReadAllBytes($file); $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length) } else { $ctx.Response.StatusCode = 404; $msg = [System.Text.Encoding]::UTF8.GetBytes('Not Found'); $ctx.Response.OutputStream.Write($msg, 0, $msg.Length) }; $ctx.Response.Close() } }"
