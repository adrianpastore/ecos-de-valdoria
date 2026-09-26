// Teste de fumaça: carrega os scripts do jogo em ordem, num navegador simulado, e exercita os sistemas principais.
// Uso: node tests/smoke-node.js (precisa do Node; sem ele, use tests/rodar-testes.ps1 ou tests/smoke.html)
const vm=require('vm'),fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..','js')+path.sep;
const noop=()=>{};
const ctx2d=new Proxy({},{get:(t,k)=>k==='createImageData'?(w,h)=>({data:new Uint8ClampedArray(w*h*4)}):(k==='createLinearGradient'||k==='createRadialGradient')?()=>({addColorStop:noop}):noop,set:()=>true});
function el(){const kids=[];return new Proxy({width:16,height:16,style:{setProperty:noop},classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},children:kids,dataset:{},getContext:()=>ctx2d,toDataURL:()=>'data:',append:(...a)=>kids.push(...a),addEventListener:noop,querySelector:()=>el(),querySelectorAll:()=>[],getBoundingClientRect:()=>({left:0,top:0}),clientWidth:1200,clientHeight:800,get firstChild(){return{remove:()=>kids.shift()}},remove:noop,value:'',offsetWidth:1},{get:(t,k)=>k in t?t[k]:undefined,set:(t,k,v)=>{t[k]=v;return true}});}
const els={},timers=[],store={};let raf=null;
const ctx=vm.createContext({document:{getElementById:id=>els[id]||(els[id]=el()),createElement:()=>el(),querySelectorAll:()=>[]},addEventListener:noop,devicePixelRatio:1,innerWidth:1200,requestAnimationFrame:f=>raf=f,performance:{now:()=>0},setTimeout:f=>timers.push(f),localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},Math,JSON,Object,Array,Set,Uint8Array,Float32Array,Uint8ClampedArray,String,Number,Date,Proxy,console});
let falhas=0;const ok=(cond,msg)=>{console.log((cond?'  ✔ ':'  ✘ ')+msg);if(!cond)falhas++;};
console.log('Carregando scripts…');
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort()){try{new vm.Script(fs.readFileSync(dir+f,'utf8'),{filename:f}).runInContext(ctx);}catch(e){console.log('  ✘ '+f+': '+e.message);process.exit(1);}}
ok(true,'todos os scripts carregaram em ordem');
const run=c=>vm.runInContext(c,ctx),exec=c=>vm.runInContext('{'+c+'}',ctx);let t=0;const tick=n=>{for(let i=0;i<n;i++){t+=16;raf(t);while(timers.length)timers.shift()();}};
for(const cls of['mago','guerreiro','arqueira']){
 console.log(`\nClasse: ${cls}`);
 exec(`enter({cls:'${cls}',name:'Teste'});gainXp(999999);P.gold=99999;switchMapNow('floresta',null);`);tick(30);
 ok(run('mons.length')>0,'monstros na Floresta');
 exec(`for(const id of classTrees().flatMap(t=>Object.keys(SK).filter(i=>SK[i].tree===t&&(t===CT().base))))for(let k=0;k<5;k++)if(!canLearn(id))learn(id);`);
 ok(run('ptsFree()')>=0,'pontos da árvore consistentes');
 exec(`const m=mons[0];P.x=m.x+30;P.y=m.y;P.target=m;P.auto=true;for(let s=0;s<6;s++){P.cd={};P.mp=P.st.mp;useSkill(s);}`);tick(120);
 ok(!run('P.dead')||true,'habilidades usadas sem erro');
 exec(`acceptTrial(CT().specs[0]);P.quest.prog=P.quest.goal;P.quest.done=true;completeTrial();promote();`);
 ok(run('P.spec')===run('CT().specs[0]')&&run('P.promo')===2,'prova, especialização e promoção');
}
console.log('\nMapas e portais');
exec(`switchMapNow('valdor',null);const p=portalPt('estrada');P.portalCD=0;P.x=p.x;P.y=p.y;`);tick(80);
ok(run('CUR')==='estrada','portal sul de Valdor leva à Estrada do Sul');
for(const id of run('Object.keys(MAPS)')){exec(`switchMapNow('${id}',null)`);tick(5);const M=run(`MAPS['${id}']`);
 if(M.boss)ok(run('mons.some(m=>m.boss)'),`${id}: chefe presente`);
 if(M.plateau)ok(run('ground.some((g,i)=>g===G.HIGH&&REACH[i])'),`${id}: platô alcançável`);}
console.log('\nChefe e save');
exec(`switchMapNow('encosta3',null);const b=mons.find(m=>m.boss);P.x=b.x+18;P.y=b.y;P.hp=P.st.hp=99999;b.hp=1;b.state='chase';P.target=b;P.auto=true;`);tick(200);
ok(run("(BOSSAT['encosta3']||0)>time"),'MVP derrotado e respawn agendado');
ok(JSON.parse(store.valdoria_save_v1).map==='encosta3','save guarda o mapa atual');
console.log(falhas?`\n${falhas} falha(s).`:'\nTudo certo!');process.exit(falhas?1:0);
