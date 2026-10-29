$src = 'E:\Projects\Tools Website\site'
$dst = 'E:\Projects\Tools Website\site-clean'
$exts = @('.html', '.png', '.css', '.js')
Get-ChildItem -Path $src -File | Where-Object { $exts -contains $_.Extension } | Copy-Item -Destination $dst
$count = (Get-ChildItem -Path $dst -File).Count
Write-Host "Copied $count files"