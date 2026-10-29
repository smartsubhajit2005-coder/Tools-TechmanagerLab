$bytes = [System.IO.File]::ReadAllBytes('E:\Projects\Tools Website\site-clean\base64.html')
$base64 = [System.Convert]::ToBase64String($bytes)
$base64 | Out-File -Encoding ASCII 'E:\Projects\Tools Website\base64_html_b64.txt' -NoNewline
Write-Host "Length: $($base64.Length)"