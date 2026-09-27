// Ficha fija del equipo de referencia; solo la concurrencia procede del navegador.
const EQUIPO_REFERENCIA = Object.freeze({cpu:'Intel Core i5-1135G7 (11.ª generación)',fisicos:4,logicos:8,ram:'16 GB',utilizable:'15.8 GB',disco:'SSD NVMe',virtualizacion:'Habilitada',sockets:1,base:'2.42 GHz'});
const concurrenciaInformada = navigator.hardwareConcurrency;
const NUCLEOS_LOGICOS = Number.isInteger(concurrenciaInformada) && concurrenciaInformada > 0 ? concurrenciaInformada : 1;
const pmHistorialCPU = [];
function pmNucleoLibre() {
  const ocupados = new Set(procesos.filter(p=>p.estado==='running').map(p=>p.nucleo));
  for(let i=0;i<NUCLEOS_LOGICOS;i++) if(!ocupados.has(i)) return i;
  return null;
}
function pmPlanificarNucleos(soloApps = false, incluirReanudados = true) {
  const listos = procesos.filter(p=>pmListoParaEjecutar(p) && (incluirReanudados || !p.esperaPlanificador) && (!soloApps || p.appId)).sort((a,b)=>a.turnosRecibidos-b.turnosRecibidos || b.prioridad-a.prioridad || a.pid-b.pid);
  for(const p of listos) {
    if(pmNucleoLibre()===null) break;
    pmIniciarEjecucion(p,false);
  }
}
function pmElegirBloqueo() {
  const activos=procesos.filter(p=>p.estado==='running');
  if(activos.length===1) { pmBloquearProceso(activos[0].pid); return; }
  if(!activos.length)return;
  const dialog=document.getElementById('pm-block-dialog');
  dialog.showModal();
  pmActualizarBloqueo();
}
function pmActualizarBloqueo() {
  const dialog=document.getElementById('pm-block-dialog');
  if(!dialog || !dialog.open)return;
  const activos=procesos.filter(p=>p.estado==='running');
  if(!activos.length) {dialog.close();return;}
  const panel=document.getElementById('pm-block-options');
  const html=activos.map(p=>`<button type="button" onclick="document.getElementById('pm-block-dialog').close();pmBloquearProceso(${p.pid})"><b>PID ${p.pid} · ${pcbEscape(p.nombre)}</b><span>Núcleo ${p.nucleo+1}</span></button>`).join('');
  if(panel.innerHTML!==html)panel.innerHTML=html;
}
function pmVista(vista) {
  ['processes','performance'].forEach(v=>{
    document.getElementById('pm-'+v).hidden=v!==vista;
    document.getElementById('pm-tab-'+v).setAttribute('aria-selected',String(v===vista));
  });
  if(vista==='performance')pmActualizarRendimiento();
}
function pmUsoCPU() { return procesos.filter(p=>p.estado==='running').length/NUCLEOS_LOGICOS*100; }
function pmActualizarRendimiento() {
  const panel=document.getElementById('pm-performance'); if(!panel)return;
  if(!panel.innerHTML) {
    const e=EQUIPO_REFERENCIA;
    panel.innerHTML=`<header class="perf-heading"><h2>CPU</h2><span>${e.cpu}</span></header><div class="perf-chart-label"><span>Uso de CPU</span><span>100 %</span></div><svg class="perf-chart" viewBox="0 0 600 180" preserveAspectRatio="none" role="img" aria-label="Uso simulado de CPU durante los últimos 60 segundos"><defs><pattern id="perf-grid" width="50" height="30" patternUnits="userSpaceOnUse"><path d="M50 0H0V30" fill="none" stroke="#294758" stroke-width="1"/></pattern></defs><rect width="600" height="180" fill="url(#perf-grid)"/><path id="perf-area" fill="#2586b530"/><path id="perf-line" fill="none" stroke="#65bce8" stroke-width="2" vector-effect="non-scaling-stroke"/></svg><div class="perf-chart-label"><span>Hace 60 segundos</span><span>Ahora</span></div><div class="perf-metrics"><div>Utilización<strong id="perf-usage"></strong></div><div>Núcleos ocupados<strong id="perf-busy"></strong></div><div>Listos en espera<strong id="perf-wait"></strong></div></div><h3>Procesadores lógicos</h3><div class="perf-cores" id="perf-cores"></div><h3>Equipo de referencia</h3><dl class="perf-specs">${[['Núcleos físicos',e.fisicos],['Lógicos de referencia',e.logicos],['RAM',e.ram],['RAM utilizable',e.utilizable],['Sockets',e.sockets],['Almacenamiento',e.disco],['Velocidad base',e.base],['Virtualización',e.virtualizacion],['Lógicos informados por el navegador',Number.isInteger(concurrenciaInformada)&&concurrenciaInformada>0?NUCLEOS_LOGICOS:'No disponible · respaldo: 1']].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  }
  const activos=procesos.filter(p=>p.estado==='running');
  document.getElementById('perf-usage').textContent=pmUsoCPU().toLocaleString('es-ES',{maximumFractionDigits:1})+' %';
  document.getElementById('perf-busy').textContent=activos.length+' / '+NUCLEOS_LOGICOS;
  document.getElementById('perf-wait').textContent=procesos.filter(p=>p.estado==='ready').length;
  document.getElementById('perf-cores').innerHTML=Array.from({length:NUCLEOS_LOGICOS},(_,i)=>{
    const p=activos.find(p=>p.nucleo===i);
    return `<div class="perf-core ${p?'busy':''}"><header><b>Núcleo ${i+1}</b><span>${p?'Ocupado':'Libre'}</span></header><p>${p?'PID '+p.pid+' · '+pcbEscape(p.nombre):'—'}</p><div class="perf-core-bar"></div></div>`;
  }).join('');
  const ahora=performance.now();
  const points=pmHistorialCPU.filter(p=>ahora-p.t<=60000).map(p=>`${Math.max(0,600-(ahora-p.t)/100)},${180-p.uso*1.8}`);
  points.push(`600,${180-pmUsoCPU()*1.8}`);
  const path='M'+points.join(' L');
  document.getElementById('perf-line').setAttribute('d',path);
  document.getElementById('perf-area').setAttribute('d',path+` L600,180 L${points[0].split(',')[0]},180 Z`);
}
setInterval(()=>{
  pmHistorialCPU.push({t:performance.now(),uso:pmUsoCPU()});
  while(pmHistorialCPU.length>61)pmHistorialCPU.shift();
  pmActualizarRendimiento();
},1000);
