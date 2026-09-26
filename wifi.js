// Red del escritorio: independiente de la conexión real del equipo.
let wifiEncendido = true;
let firefoxScrollRed = 0;
function pmPuedeDesbloquear(p) {
  return p.estado === 'blocked' && !(p.appId === 'firefox' && p.navegando && !wifiEncendido);
}
function pmSincronizarWifi() {
  const p = pmProcesoAplicacion('firefox');
  if (!p || p.estado === 'new') return;
  if (!wifiEncendido && p.navegando) {
    if (p.estado !== 'blocked') {
      pmCancelar(p.temporizadorCPU);
      p.temporizadorCPU = null;
      pmCambiarEstado(p,'blocked');
      p.inicioEjecucion = null;
      p.bloqueoWifi = true;
      p.pcb.io = 'Conexión de red';
    }
  } else if (p.bloqueoWifi) {
    p.bloqueoWifi = false;
    p.esperaPlanificador = false;
    pmCambiarEstado(p,'ready');
  }
}
function pmAlternarWifi() {
  wifiEncendido = !wifiEncendido;
  const boton = document.getElementById('wifi');
  const etiqueta = wifiEncendido ? 'WiFi encendido' : 'WiFi apagado';

  document.getElementById('system-controls').title = etiqueta + ' · Sonido: 50 % · Batería: 100 %';
  boton.classList.toggle('wifi-off',!wifiEncendido);
  boton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 8a15 15 0 0 1 18 0M6 12a10 10 0 0 1 12 0M9 16a5 5 0 0 1 6 0${wifiEncendido ? '' : 'M3 3l18 18'}"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg>`;
  pmActualizarPanelWifi();
  actualizarUI();
  firefoxConexionVista();
}
function firefoxConexionVista() {
  const page = document.getElementById('firefox-page');
  const error = document.getElementById('firefox-offline');
  if (!page || !error) return;
  const sinRed = !wifiEncendido && firefoxHistory[firefoxHistory.length-1].type !== 'home';
  const scroll = page.parentElement;
  if (sinRed && error.hidden) firefoxScrollRed = scroll.scrollTop;
  const restaurar = !sinRed && !error.hidden;
  page.hidden = sinRed;
  error.hidden = !sinRed;
  if (sinRed) scroll.scrollTop = 0;
  else if (restaurar) scroll.scrollTop = firefoxScrollRed;
}

function pmAbrirPanelWifi() {
  const panel=document.getElementById('wifi-panel');
  panel.hidden=!panel.hidden;
  document.getElementById('system-controls').setAttribute('aria-expanded',String(!panel.hidden));
  pmActualizarPanelWifi();
  if(!panel.hidden)document.getElementById('wifi-switch').focus();
}
function pmCerrarPanelWifi(devolverFoco=false) {
  document.getElementById('wifi-panel').hidden=true;
  document.getElementById('system-controls').setAttribute('aria-expanded','false');
  if(devolverFoco)document.getElementById('system-controls').focus();
}
function pmActualizarPanelWifi() {
  const control=document.getElementById('wifi-switch');
  control.setAttribute('aria-checked',String(wifiEncendido));
  document.getElementById('wifi-network-state').textContent=wifiEncendido?'Conectada':'WiFi desactivado';
  document.getElementById('wifi-network').classList.toggle('disconnected',!wifiEncendido);
}
document.addEventListener('pointerdown',event=>{
  const panel=document.getElementById('wifi-panel');
  if(panel && !panel.hidden && !panel.contains(event.target) && !document.getElementById('system-controls').contains(event.target))pmCerrarPanelWifi();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape' && !document.getElementById('wifi-panel').hidden)pmCerrarPanelWifi(true);
});
