$bytes = [System.IO.File]::ReadAllBytes('E:\Projects\Tools Website\site-clean\index.html')
$base64 = [System.Convert]::ToBase64String($bytes)
$base64 | Out-File -Encoding ASCII 'E:\Projects\Tools Website\index_html_b64.txt'
Write-Host "Length: $($base64.Length)"