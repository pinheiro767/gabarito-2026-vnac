const estruturas = [
  'Fáscia supraespinal','Ligamento cutâneo','Artéria interóssea anterior','Artéria recorrente ulnar anterior','Veia metacarpal dorsal','Veia cefálica do antebraço','Nervo musculocutâneo','Nervo mediano','Artéria tibial anterior','Tronco tibiofibular','Veia marginal medial','Arco venoso dorsal do pé','Nervo fibular profundo','Retináculo superior dos extensores','Veia safena magna','Nervo femoral','Veia obturatória','Nervo obturatório','Membrana costocoracoide','Nervo peitoral lateral','Artéria glútea inferior','Nervo isquiático','Veia safena parva','Nervo sural'
];
const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
function placeholder(n){return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#eef4fb"/><text x="50%" y="45%" text-anchor="middle" font-family="Arial" font-size="58" fill="#174ea6" font-weight="700">${n}.png</text><text x="50%" y="55%" text-anchor="middle" font-family="Arial" font-size="28" fill="#667085">Substitua pela imagem real</text></svg>`)}`}
function imgPath(n){return `imagens/${n}.png`}
function build(){
  estruturas.forEach((nome,i)=>{const n=i+1; const card=document.createElement('article'); card.className='card'; card.innerHTML=`<div class="card-head"><span class="num">${String(n).padStart(2,'0')}</span><span class="tag">Estrutura</span></div><div class="imgwrap"><img src="${imgPath(n)}" alt="${nome}" onerror="this.src='${placeholder(n)}'"></div><div class="name">${nome}</div><div class="obs">Imagem: imagens/${n}.png</div>`; grid.appendChild(card); card.querySelector('img').addEventListener('click',e=>{modalImg.src=e.currentTarget.src; modalCaption.textContent=`${String(n).padStart(2,'0')} — ${nome}`; modal.classList.add('show')})})
}
function close(){modal.classList.remove('show')} document.getElementById('closeModal').onclick=close; modal.addEventListener('click',e=>{if(e.target===modal)close()});
function loadImageAsDataURL(url){return new Promise(resolve=>{const img=new Image(); img.crossOrigin='anonymous'; img.onload=()=>{const c=document.createElement('canvas'); c.width=img.naturalWidth||img.width; c.height=img.naturalHeight||img.height; c.getContext('2d').drawImage(img,0,0); resolve({data:c.toDataURL('image/png'),w:c.width,h:c.height,ok:true})}; img.onerror=()=>{const p=placeholder(url.match(/(\d+)/)?.[1]||'?'); const im=new Image(); im.onload=()=>{const c=document.createElement('canvas'); c.width=1200;c.height=800;c.getContext('2d').drawImage(im,0,0);resolve({data:c.toDataURL('image/png'),w:1200,h:800,ok:false})}; im.src=p}; img.src=url+'?v='+Date.now()})}
async function gerarPDF(){
  const { jsPDF } = window.jspdf; const pdf = new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
  const pageW=210,pageH=297,margin=14;
  for(let i=0;i<estruturas.length;i++){
    if(i>0) pdf.addPage(); const n=i+1; const nome=estruturas[i];
    pdf.setFillColor(247,249,252); pdf.rect(0,0,pageW,pageH,'F');
    pdf.setTextColor(23,32,51); pdf.setFont('helvetica','bold'); pdf.setFontSize(16); pdf.text('Gabarito da Prova Prática — Medicina 2026',margin,16);
    pdf.setFontSize(11); pdf.setTextColor(102,112,133); pdf.text('09/06/2026',margin,23);
    pdf.setFont('helvetica','bold'); pdf.setFontSize(18); pdf.setTextColor(11,87,208); pdf.text(`Estrutura ${String(n).padStart(2,'0')}`,margin,36);
    pdf.setFontSize(15); pdf.setTextColor(23,32,51); pdf.text(nome,margin,45,{maxWidth:pageW-margin*2});
    const img=await loadImageAsDataURL(imgPath(n));
    const boxX=margin, boxY=55, boxW=pageW-margin*2, boxH=210;
    const ratio=Math.min(boxW/img.w, boxH/img.h); const w=img.w*ratio, h=img.h*ratio; const x=boxX+(boxW-w)/2, y=boxY+(boxH-h)/2;
    pdf.setDrawColor(216,222,233); pdf.roundedRect(boxX,boxY,boxW,boxH,3,3);
    pdf.addImage(img.data,'PNG',x,y,w,h,undefined,'FAST');
    pdf.setFont('helvetica','normal'); pdf.setFontSize(9); pdf.setTextColor(102,112,133); pdf.text(`Arquivo: imagens/${n}.png${img.ok?'':' — imagem provisória/não encontrada'}`,margin,282);
  }
  pdf.save('gabarito-prova-pratica-medicina-2026.pdf');
}
document.getElementById('btnPdf').addEventListener('click',gerarPDF); document.getElementById('btnPrint').addEventListener('click',()=>window.print());
build(); if('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js');
