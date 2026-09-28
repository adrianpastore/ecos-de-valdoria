# Ecos de Valdoria — roda o teste de fumaça sem abrir janela (Edge ou Chrome em modo headless)
# Uso: powershell -ExecutionPolicy Bypass -File tests\rodar-testes.ps1
# Usa um perfil de navegador temporário, então nunca toca no save de quem joga.
$ErrorActionPreference = 'Stop'
$raiz = Split-Path $PSScriptRoot -Parent
$nav = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
         "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
         "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
         "$env:LocalAppData\Google\Chrome\Application\chrome.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $nav) { Write-Output 'Nenhum Edge ou Chrome encontrado.'; exit 2 }

$tmp = Join-Path $env:TEMP ('valdoria-teste-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory $tmp | Out-Null
$url = ([Uri](Join-Path $raiz 'index.html')).AbsoluteUri + '?teste'
try {
  # o navegador sem janela às vezes trava sozinho: após 3 minutos sem resposta, encerra e tenta mais uma vez
  foreach ($tentativa in 1, 2) {
    $p = Start-Process $nav -PassThru -RedirectStandardOutput "$tmp\dom.txt" -RedirectStandardError "$tmp\log.txt" -ArgumentList `
      '--headless=new', '--disable-gpu', "--user-data-dir=$tmp\perfil$tentativa", '--dump-dom', $url
    if ($p.WaitForExit(180000)) { break }
    Get-CimInstance Win32_Process -Filter "Name='$(Split-Path $nav -Leaf)'" | Where-Object { $_.CommandLine -match [regex]::Escape($tmp) } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
    if ($tentativa -eq 2) { Write-Output 'O navegador travou duas vezes seguidas (3 min sem resposta cada). Provável laço infinito no jogo.'; exit 3 }
    Write-Output 'O navegador travou; tentando de novo...'; Start-Sleep 2
  }
  # processos filhos do navegador podem segurar o arquivo por alguns instantes depois de fechar
  $dom = $null
  for ($i = 0; $i -lt 40 -and $null -eq $dom; $i++) { try { $dom = [IO.File]::ReadAllText("$tmp\dom.txt", [Text.Encoding]::UTF8) } catch { Start-Sleep -Milliseconds 250 } }
  if ($null -eq $dom) { Write-Output 'Não consegui ler o resultado do navegador.'; exit 1 }
  if ($dom -notmatch '(?s)<pre id="smoke"[^>]*>(.*?)</pre>') { Write-Output 'O teste não chegou ao fim (provável erro ao carregar os scripts).'; exit 1 }
  $res = [Net.WebUtility]::HtmlDecode($matches[1])
  Write-Output $res
  if ($res -match 'TUDO OK') { exit 0 } else { exit 1 }
} finally { Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue }
