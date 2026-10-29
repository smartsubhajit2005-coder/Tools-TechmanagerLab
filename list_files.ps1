$files = Get-ChildItem 'E:\Projects\Tools Website\site-clean' -File
Write-Host "Total files: $($files.Count)"
foreach ($f in $files) {
    $content = [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes($f.FullName))
    Write-Host "$($f.Name): $($content.Length) chars"
}