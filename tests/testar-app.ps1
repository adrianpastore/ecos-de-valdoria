# Ecos de Valdoria — testa o app instalável (PWA): service worker, cópia guardada e abrir sem internet
# Uso (na pasta do jogo): powershell -ExecutionPolicy Bypass -File tests\testar-app.ps1
# O service worker só funciona em https ou localhost, então este script sobe um servidor local (só nesta máquina) e:
#  fase 1: abre uma página que registra o sw.js e lista o que ele guardou;
#  fase 2: "desliga a internet" (o servidor recusa os arquivos do jogo) e abre o index.html por dentro da página: tem de carregar da cópia.
$ErrorActionPreference = 'Stop'
$raiz = Split-Path $PSScriptRoot -Parent
$nav = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
         "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
         "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
         "$env:LocalAppData\Google\Chrome\Application\chrome.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $nav) { Write-Output 'Nenhum Edge ou Chrome encontrado.'; exit 2 }
$porta = Get-Random -Minimum 20000 -Maximum 40000
$base = "http://localhost:$porta/"
$tipos = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.json'='application/json; charset=utf-8'; '.png'='image/png'; '.md'='text/plain; charset=utf-8' }
$pagina = @{
 1 = "(async()=>{const say=t=>fetch('/_resultado?t='+encodeURIComponent(t));try{await navigator.serviceWorker.register('sw.js');await navigator.serviceWorker.ready;let n=0,prev=-1;for(let i=0;i<60;i++){const ks=await caches.keys();if(ks.length){n=(await(await caches.open(ks[0])).keys()).length;if(n===prev&&n>0)break;prev=n;}await new Promise(r=>setTimeout(r,250));}const ks=await caches.keys(),urls=(await(await caches.open(ks[0])).keys()).map(r=>new URL(r.url).pathname).sort();say('OK '+ks[0]+': '+urls.length+' arquivos guardados: '+urls.join(' '));}catch(e){say('ERRO '+e);}})();"
 2 = "(async()=>{const say=t=>fetch('/_resultado?t='+encodeURIComponent(t));try{await navigator.serviceWorker.ready;const f=document.createElement('iframe');f.src='index.html';document.body.append(f);await new Promise(r=>f.onload=r);await new Promise(r=>setTimeout(r,800));const d=f.contentDocument,n=d.querySelectorAll('.ccard').length;say((n===3?'OK':'FALHA')+' sem internet: '+n+' classes na tela inicial, nome da pagina: '+d.title+', controlada pelo service worker: '+!!f.contentWindow.navigator.serviceWorker.controller);}catch(e){say('ERRO '+e);}})();"
}
$ls = New-Object Net.HttpListener; $ls.Prefixes.Add($base); $ls.Start()
$tmp = Join-Path $env:TEMP ('valdoria-app-' + [Guid]::NewGuid().ToString('N'))
$falhou = $false
try {
  foreach ($fase in 1, 2) {
    $p = Start-Process $nav -PassThru -ArgumentList '--headless=new', '--disable-gpu', "--user-data-dir=$tmp\perfil", "${base}_app-teste.html?fase=$fase"
    $fim = (Get-Date).AddSeconds(60); $res = $null
    while (-not $res -and (Get-Date) -lt $fim) {
      $t = $ls.GetContextAsync(); while (-not $t.Wait(500)) { if ((Get-Date) -gt $fim) { break } }
      if (-not $t.IsCompleted) { break }
      $ctx = $t.Result; $cam = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/')); if ($cam -eq '') { $cam = 'index.html' }
      if ($cam -eq '_resultado') { $res = [Uri]::UnescapeDataString(($ctx.Request.Url.Query -replace '^\?t=', '')); $ctx.Response.StatusCode = 204; $ctx.Response.Close(); continue }
      if ($cam -eq '_app-teste.html') { $b = [Text.Encoding]::UTF8.GetBytes("<!doctype html><meta charset=utf-8><body><script>$($pagina[$fase])</script>"); $ctx.Response.ContentType = 'text/html; charset=utf-8' }
      elseif ($fase -eq 2) { $ctx.Response.Abort(); continue }   # "sem internet": o arquivo nem chega
      else {
        $arq = Join-Path $raiz $cam
        if (-not (Test-Path $arq -PathType Leaf)) { $ctx.Response.StatusCode = 404; $ctx.Response.Close(); continue }
        $b = [IO.File]::ReadAllBytes($arq); $tp = $tipos[[IO.Path]::GetExtension($arq)]; if ($tp) { $ctx.Response.ContentType = $tp }
      }
      $ctx.Response.OutputStream.Write($b, 0, $b.Length); $ctx.Response.Close()
    }
    try { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } catch {}
    Get-CimInstance Win32_Process -Filter "Name='$(Split-Path $nav -Leaf)'" | Where-Object { $_.CommandLine -match [regex]::Escape($tmp) } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
    Start-Sleep 1
    if (-not $res) { $res = 'FALHA: a página não respondeu em 60 s' }
    Write-Output "Fase ${fase}: $res"
    if ($res -notmatch '^OK') { $falhou = $true; break }
  }
} finally { $ls.Stop() }
if ($falhou) { exit 1 } else { Write-Output '=== APP: TUDO OK ==='; exit 0 }
