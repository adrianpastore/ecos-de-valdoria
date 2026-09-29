# Ecos de Valdoria — gera os ícones do app (PWA) a partir dos sprites do próprio jogo
# Uso (na pasta do jogo): powershell -ExecutionPolicy Bypass -File tests\gerar-icones.ps1
# Abre uma cópia temporária do index.html no Edge/Chrome sem janela, desenha os ícones num canvas e grava os PNG em icones\.
$ErrorActionPreference = 'Stop'
$raiz = Split-Path $PSScriptRoot -Parent
$nav = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
         "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
         "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
         "$env:LocalAppData\Google\Chrome\Application\chrome.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $nav) { Write-Output 'Nenhum Edge ou Chrome encontrado.'; exit 2 }

# O herói inicial (Guerreiro) sobre couro escuro, com um brilho dourado atrás e a sombra no chão.
# "mask" = versão com margem maior: o Android recorta o ícone em círculo ou gota, e só os 80% do meio são garantidos.
$desenho = @'
<script>{const out=[];try{
 const hero=previewLook('guerreiro');
 const icon=(sz,mask)=>{const c=cnv(sz,sz),x=c.getContext('2d');x.imageSmoothingEnabled=false;
  x.fillStyle='#1d140e';x.fillRect(0,0,sz,sz);
  const g=x.createRadialGradient(sz/2,sz*.45,0,sz/2,sz*.45,sz*.52);g.addColorStop(0,'rgba(240,190,70,.6)');g.addColorStop(.6,'rgba(200,130,40,.18)');g.addColorStop(1,'rgba(200,130,40,0)');x.fillStyle=g;x.fillRect(0,0,sz,sz);
  if(!mask){const b=Math.max(2,Math.round(sz/48));x.fillStyle='#e8b43c';x.fillRect(0,0,sz,b);x.fillRect(0,sz-b,sz,b);x.fillRect(0,0,b,sz);x.fillRect(sz-b,0,b,sz);x.fillStyle='#1b1320';x.fillRect(b,b,sz-2*b,b);x.fillRect(b,sz-2*b,sz-2*b,b);x.fillRect(b,b,b,sz-2*b);x.fillRect(sz-2*b,b,b,sz-2*b);}
  const k=Math.floor(sz*(mask?.5:.66)/16),w=16*k,feet=Math.round(sz*(mask?.73:.82));
  x.fillStyle='rgba(0,0,0,.45)';x.beginPath();x.ellipse(sz/2,feet-k,w*.34,w*.09,0,0,6.29);x.fill();
  x.drawImage(hero,Math.round(sz/2-w/2),feet-w,w,w);return c.toDataURL('image/png');};
 for(const[n,sz,m]of[['icone-192.png',192,0],['icone-512.png',512,0],['icone-mascara-512.png',512,1],['icone-apple-180.png',180,0],['favicon-32.png',32,0]])out.push(n+'='+icon(sz,m));
}catch(e){out.push('ERRO='+e.stack);}const pre=document.createElement('pre');pre.id='ICONES';pre.textContent=out.join('\n');document.body.prepend(pre);}</script>
'@

$idx = Join-Path $raiz 'index.html'
$tmpHtml = Join-Path $raiz '_icones-tmp.html'
$tmp = Join-Path $env:TEMP ('valdoria-icones-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory $tmp | Out-Null
try {
  $html = [IO.File]::ReadAllText($idx, [Text.Encoding]::UTF8).Replace('</body>', $desenho + '</body>')
  [IO.File]::WriteAllText($tmpHtml, $html, (New-Object Text.UTF8Encoding $false))
  $p = Start-Process $nav -PassThru -RedirectStandardOutput "$tmp\dom.txt" -RedirectStandardError "$tmp\log.txt" -ArgumentList `
    '--headless=new', '--disable-gpu', "--user-data-dir=$tmp\perfil", '--dump-dom', ([Uri]$tmpHtml).AbsoluteUri
  if (-not $p.WaitForExit(120000)) { Write-Output 'O navegador não respondeu.'; exit 3 }
  Start-Sleep 1
  $dom = [IO.File]::ReadAllText("$tmp\dom.txt", [Text.Encoding]::UTF8)
  if ($dom -notmatch '(?s)<pre id="ICONES">(.*?)</pre>') { Write-Output 'Não achei os ícones na página.'; exit 1 }
  $dest = Join-Path $raiz 'icones'; New-Item -ItemType Directory -Force $dest | Out-Null
  foreach ($linha in ([Net.WebUtility]::HtmlDecode($matches[1]) -split "`n")) {
    $nome, $url = $linha -split '=', 2
    if ($nome -eq 'ERRO') { Write-Output "Erro ao desenhar: $url"; exit 1 }
    [IO.File]::WriteAllBytes((Join-Path $dest $nome), [Convert]::FromBase64String($url.Substring($url.IndexOf(',') + 1)))
    Write-Output "icones\$nome"
  }
} finally { if (Test-Path $tmpHtml) { [IO.File]::Delete($tmpHtml) } }
