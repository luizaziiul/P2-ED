const $=id=>document.getElementById(id),DX=40,DY=52,R=17;
let nid=1,S,base=[],timer=null;
const mk=v=>({id:nid++,v,l:null,r:null});
const H=n=>n?1+Math.max(H(n.l),H(n.r)):0,C=n=>n?1+C(n.l)+C(n.r):0;
const fresh=()=>({root:null,steps:[],i:0,cur:null,path:new Set(),vis:new Set(),found:null,out:[],ops:0,cmp:0,opOps:0,log:[],vars:{},trav:false});

/* ---------- árvore (inserção silenciosa para montar cenários) ---------- */
function ins(root,v){
  if(!root)return[mk(v),0];
  let n=root,c=0;
  for(;;){c++;if(v===n.v)return[root,c];const k=v<n.v?'l':'r';if(!n[k]){n[k]=mk(v);return[root,c]}n=n[k]}
}
function build(vals){let r=null,t=0;for(const v of vals){const x=ins(r,v);r=x[0];t+=x[1]}return{root:r,cost:t}}

/* ---------- desenho ---------- */
function layout(root){
  let i=0,md=0;const ns=[];
  (function go(n,d){if(!n)return;go(n.l,d+1);n.x=i++*DX;n.y=d*DY;md=Math.max(md,d);ns.push(n);go(n.r,d+1)})(root,0);
  return{ns,w:Math.max(0,(i-1)*DX),h:md*DY};
}
function draw(svg,root,st){
  if(!root){svg.setAttribute('viewBox','-100 -20 200 40');svg.innerHTML='<text x="0" y="5" text-anchor="middle" fill="currentColor">Árvore vazia</text>';return}
  const L=layout(root),m=R+12;
  svg.setAttribute('viewBox',`${-m} ${-m} ${L.w+2*m} ${L.h+2*m}`);
  const act=id=>st&&(st.path.has(id)||st.cur===id);
  let h='';
  for(const n of L.ns)for(const c of[n.l,n.r])if(c)h+=`<line class="e${act(n.id)&&act(c.id)?' on':''}" x1="${n.x}" y1="${n.y}" x2="${c.x}" y2="${c.y}"/>`;
  for(const n of L.ns){
    let k='n';
    if(st){if(st.vis.has(n.id))k+=' vis';if(st.path.has(n.id))k+=' path';if(st.cur===n.id)k+=' cur';if(st.found===n.id)k+=' found'}
    h+=`<g class="${k}" transform="translate(${n.x},${n.y})"><circle r="${R}"/><text dy=".35em">${n.v}</text></g>`;
  }
  svg.innerHTML=h;
}

/* ---------- planejamento de passos ---------- */
function walk(v,isIns){
  const st=[],p=[];let n=S.root,c=0;
  if(!n){
    st.push({msg:isIns?`Árvore vazia: ${v} vira a raiz.`:`Árvore vazia: ${v} não existe.`,vars:{alvo:v,atual:'None'},path:[],cur:null,
      apply:isIns?()=>{S.root=mk(v);S.found=S.root.id;S.cur=S.root.id}:null});
    return st;
  }
  while(n){
    c++;const q=n,pth=p.slice();
    const vars={alvo:v,atual:q.v,profundidade:pth.length,'comparações na operação':c};
    if(v===q.v){
      st.push({cur:q.id,path:pth,c:1,o:1,vars,found:isIns?undefined:q.id,
        msg:isIns?`${v} == ${q.v}: valor já existe, duplicados são ignorados.`:`${v} == ${q.v}: encontrado após ${c} comparação(ões)!`});
      return st;
    }
    const k=v<q.v?'l':'r',dir=k==='l'?'esquerda':'direita';
    st.push({cur:q.id,path:pth,c:1,o:1,vars,msg:`${v} ${v<q.v?'<':'>'} ${q.v}: seguir para a ${dir}.`});
    p.push(q.id);
    if(!q[k]){
      st.push({cur:q.id,path:pth,vars:{...vars,['filho '+dir]:'None'},
        msg:isIns?`Filho da ${dir} de ${q.v} está vazio: inserir ${v} aqui.`:`Filho da ${dir} de ${q.v} é nulo: ${v} não existe na árvore.`,
        apply:isIns?()=>{const m=mk(v);q[k]=m;S.found=m.id;S.cur=m.id;S.path=new Set(pth.concat(q.id))}:null});
      return st;
    }
    n=q[k];
  }
  return st;
}
function trav(type){
  const st=[],stk=[];let k=0;
  (function go(n,who){
    const pth=()=>stk.map(x=>x.id).slice(0,-1);
    if(!n){
      st.push({cur:stk.length?stk[stk.length-1].id:null,path:pth(),o:1,vars:{'pilha de chamadas':stk.map(x=>x.v).join(' → ')||'(vazia)'},msg:`${who} é None: a chamada retorna.`});
      return;
    }
    stk.push(n);
    const stack=stk.map(x=>x.v).join(' → ');
    st.push({cur:n.id,path:pth(),o:1,vars:{nó:n.v,'pilha de chamadas':stack},msg:`Chamada recursiva em ${n.v}.`});
    const vis=()=>{const o=++k;st.push({cur:n.id,path:pth(),o:1,visit:n.id,val:n.v,vars:{nó:n.v,'pilha de chamadas':stack,'ordem de visita':o},msg:`Visita ${n.v}: ${o}º valor impresso.`})};
    if(type==='pre')vis();
    go(n.l,`filho esquerdo de ${n.v}`);
    if(type==='in')vis();
    go(n.r,`filho direito de ${n.v}`);
    if(type==='post')vis();
    stk.pop();
  })(S.root,'raiz');
  return st;
}

/* ---------- execução ---------- */
const pending=()=>S.i<S.steps.length;
function exec(quiet){
  if(!pending())return false;
  const s=S.steps[S.i++];
  S.cur=s.cur;S.path=new Set(s.path);S.ops+=s.o||0;S.opOps+=s.o||0;S.cmp+=s.c||0;
  if(s.visit){S.vis.add(s.visit);S.out.push(s.val)}
  if(s.found!==undefined)S.found=s.found;
  if(s.apply)s.apply();
  S.vars=s.vars||{};S.log.push(s.msg);
  if(!pending())S.log.push('✔ Operação concluída.');
  if(!quiet)render();
  return true;
}
function begin(){
  pause();while(exec(true));
  Object.assign(S,{steps:[],i:0,cur:null,path:new Set(),vis:new Set(),found:null,out:[],opOps:0,vars:{},trav:false});
}
function queue(steps,title,isTrav){
  S.steps=steps;S.i=0;S.trav=!!isTrav;
  S.log.push(`▶ ${title}: ${steps.length} passos. Use Executar ou Próximo passo.`);render();
}
function tick(){exec();if(!pending())pause()}
function play(){
  if(!pending()){S.log.push('Nenhuma operação pendente: escolha Inserir, Buscar ou uma travessia.');render();return}
  if(timer)return;
  timer=setInterval(tick,1700-$('sp').value*150);$('bPlay').classList.add('on');
}
function pause(){clearInterval(timer);timer=null;$('bPlay').classList.remove('on')}
function step(){pause();if(!exec())S.log.push('Nenhuma operação pendente.'),render()}

/* ---------- cenários ---------- */
function load(vals,label){
  pause();base=vals.slice();S=fresh();
  const b=build(vals);S.root=b.root;
  S.log.push(`${label}: ${vals.length} valores [${vals.join(', ')}]. Construção custou ${b.cost} comparações; altura ${H(S.root)}.`);
  render();
}
function readVal(){const v=parseInt($('val').value,10);if(isNaN(v)){S.log.push('Digite um número inteiro.');render();return null}return v}

/* ---------- painel ---------- */
function render(){
  draw($('tree'),S.root,S);
  $('m').innerHTML=[['Operações acumuladas',S.ops],['Comparações acumuladas',S.cmp],['Nós / altura',C(S.root)+' / '+H(S.root)],['Passo',S.steps.length?`${S.i}/${S.steps.length}`:'—'],['Operações nesta ação',S.opOps]]
    .map(([a,b])=>`<div class="t"><b>${b}</b><span>${a}</span></div>`).join('');
  const vr={...S.vars};if(S.trav)vr['saída até agora']=S.out.join(' ')||'(vazia)';
  const e=Object.entries(vr);
  $('v').innerHTML=e.length?e.map(([a,b])=>`<div><code>${a}</code> = ${b}</div>`).join(''):'<small>sem operação em andamento</small>';
  $('now').textContent=S.log.length?S.log[S.log.length-1]:'';
  const L=$('log');L.innerHTML=S.log.slice(-80).map((m,i,a)=>`<li${i===a.length-1?' class="now"':''}>${m}</li>`).join('');L.scrollTop=L.scrollHeight;
}

/* ---------- comparação aleatória x ordenada ---------- */
function compare(){
  const n=15,s=[...Array(n)].map((_,i)=>i+1),r=s.slice();
  for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}
  const A=build(r),B=build(s),mx=Math.max(A.cost,B.cost);
  $('cmp').hidden=false;draw($('tA'),A.root);draw($('tB'),B.root);
  const info=(x,vals)=>`<div>Inserir ${n} valores: <b>${x.cost}</b> comparações (≈ ${(x.cost/n).toFixed(1)} por valor)</div><div>Altura <b>${H(x.root)}</b>: a pior busca faz ${H(x.root)} comparações</div><div class="bar"><i style="width:${x.cost/mx*100}%"></i></div><small>Ordem: ${vals.join(', ')}</small>`;
  $('sA').innerHTML=info(A,r);$('sB').innerHTML=info(B,s);
  $('sum').textContent=`Com ${n} valores, a inserção ordenada custou ${B.cost} comparações contra ${A.cost} da aleatória (${(B.cost/A.cost).toFixed(1)}×). Com n = 1000 a diferença explode: cerca de log₂n ≈ 10 comparações por inserção contra n/2 ≈ 500 na árvore degenerada.`;
  $('cmp').scrollIntoView({behavior:'smooth',block:'nearest'});
}

/* ---------- eventos ---------- */
$('bMed').onclick=()=>load([50,30,70,20,40,60,80,35,65],'Caso Médio');
$('bPior').onclick=()=>load([1,2,3,4,5,6,7,8,9,10],'Pior Caso (valores em ordem crescente)');
$('bCus').onclick=()=>{
  const v=$('cv').value.split(/[\s,;]+/).map(x=>parseInt(x,10)).filter(x=>!isNaN(x)).slice(0,25);
  if(!v.length){S.log.push('Informe valores separados por vírgula.');render();return}
  load(v,'Exemplo Customizado');
};
$('bIns').onclick=()=>{const v=readVal();if(v===null)return;begin();queue(walk(v,true),`Inserir ${v}`)};
$('bBus').onclick=()=>{const v=readVal();if(v===null)return;begin();queue(walk(v,false),`Buscar ${v}`)};
$('bIn').onclick=()=>{begin();queue(trav('in'),'Inorder (esquerda, raiz, direita)',true)};
$('bPre').onclick=()=>{begin();queue(trav('pre'),'Preorder (raiz, esquerda, direita)',true)};
$('bPost').onclick=()=>{begin();queue(trav('post'),'Postorder (esquerda, direita, raiz)',true)};
$('bCmp').onclick=compare;
$('bPlay').onclick=play;$('bStep').onclick=step;$('bPause').onclick=pause;
$('bReset').onclick=()=>load(base,'Reiniciado');
$('sp').oninput=()=>{if(timer){pause();play()}};
$('val').onkeydown=e=>{if(e.key==='Enter')$('bIns').click()};

load([50,30,70,20,40,60,80,35,65],'Caso Médio');
