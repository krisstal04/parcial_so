/* PCB didáctico: reloj de CPU independiente del refresco de pantalla. */
function pcbHex(n) { return '0x' + Math.floor(n).toString(16).toUpperCase().padStart(6, '0'); }
function pcbEscape(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function pcbHora(d) { return d.toLocaleTimeString('es-ES', {hour12:false}); }
function pmCrearPCB(p) {
  p.nucleo = null;
  p.pcb = {base:p.pid * 4096, cpu:0, inicio:null, presupuesto:0,
    cambio:p.fechaCreacion, io:null, ultimaIO:'Ninguna', guardados:0};
}
function pcbDatos(p) {
  const b = p.pcb;
  const tramo = b.inicio === null ? 0 : Math.min(b.presupuesto, Math.max(0, performance.now() - b.inicio));
  const cpu = b.cpu + tramo, pasos = Math.floor(cpu / 50);
  return {cpu, pc:b.base + (pasos % 512) * 4,
    sp:b.base + 4080 - (pasos % 32) * 4, r0:pasos % 65536, r1:(pasos * 3) % 65536};
}
function pmCambiarEstado(p, estado) {
  if (p.estado === estado) return;
  const b = p.pcb;
  if (p.estado === 'running') {
    b.cpu = pcbDatos(p).cpu;
    b.inicio = null;
    b.guardados++;
    p.nucleo = null;
  }
  if (p.estado === 'blocked' && b.io) {
    b.ultimaIO = b.io + (estado === 'ready' ? ' completada' : ' cancelada');
    b.io = null;
  }
  if (estado === 'blocked') {
    const operaciones = {word:'Escritura en disco',spotify:'Lectura de audio',firefox:'Lectura de recurso local',notes:'Escritura en disco','terminal-app':'Entrada de terminal',calculator:'Entrada de usuario'};
    b.io = operaciones[p.appId] || 'Lectura de archivo';
  }
  p.estado = estado;
  b.cambio = new Date();
  if (estado === 'running') {
    b.inicio = performance.now();
    b.presupuesto = pmActividadContinua(p) ? Infinity : p.tiempoRestante;
  }
}
function pcbValores(p) {
  const d = pcbDatos(p), b = p.pcb;
  const terminado = ['finished','zombie'].includes(p.estado);
  return {
    pc:pcbHex(d.pc), cpu:(d.cpu / 1000).toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1}) + ' s',
    memoria:terminado ? 'Liberada' : pcbHex(b.base) + '–' + pcbHex(b.base + 4095),
    io:b.io ? b.io + ' pendiente' : 'Sin pendientes',
    cambio:pcbHora(b.cambio), sp:pcbHex(d.sp), r0:pcbHex(d.r0), r1:pcbHex(d.r1),
    contexto:terminado ? 'Registro final conservado' : p.estado === 'running' ? 'Activo en CPU' : b.guardados ? 'Contexto guardado' : 'Contexto inicial',
    turnos:String(p.turnosRecibidos), guardados:String(b.guardados), ultimaIO:b.ultimaIO,
    salida:p.codigoSalida === undefined ? '—' : String(p.codigoSalida)
  };
}
function pcbCelda(p, key, value, cls='') {
  const labels={pc:'PC',memoria:'Memoria asignada',io:'Estado de E/S',cpu:'CPU acumulada',cambio:'Último cambio'};
  return `<td data-label="${labels[key]}" class="${cls}" id="pcb-${p.pid}-${key}">${pcbEscape(value)}</td>`;
}
function pmRenderPCB() {
  const body = document.getElementById('process-table-body');
  if (!body) return;
  const focus = document.activeElement && document.activeElement.id;
  body.innerHTML = procesos.length ? procesos.map(p => {
    const v = pcbValores(p);
    const close = p.appId && !['finished','zombie'].includes(p.estado);
    return `<tr class="pcb-process ${p.estado === 'running' ? 'pcb-in-cpu' : ''}">
      <td data-label="PID" class="pcb-mono pcb-pid">${p.pid}</td><td data-label="Nombre" class="pcb-name">${pcbEscape(p.nombre)}${p.padre ? `<small class="pcb-parent">Padre: ${pcbEscape(p.padre.nombre)}</small>` : ''}</td>
      <td data-label="Estado"><span class="pcb-state ${p.estado}">${capitalize(p.estado)}</span></td>
      <td data-label="Prioridad" class="pcb-mono pcb-number">${p.prioridad}<span class="pcb-muted"> / 10</span></td>
      ${pcbCelda(p,'pc',v.pc,'pcb-mono')}${pcbCelda(p,'memoria',v.memoria,'pcb-mono')}
      ${pcbCelda(p,'io',v.io,'pcb-io')}${pcbCelda(p,'cpu',v.cpu,'pcb-mono pcb-number')}
      <td data-label="Creado" class="pcb-mono">${pcbHora(p.fechaCreacion)}</td>${pcbCelda(p,'cambio',v.cambio,'pcb-mono')}
      <td data-label="Acciones"><div class="pcb-actions"><button id="pcb-close-${p.pid}" title="${close ? 'Cerrar aplicación' : 'Eliminar registro'}" aria-label="${close ? 'Cerrar aplicación' : 'Eliminar registro'} ${p.pid}" class="pcb-close" onclick="pmEliminarProceso(${p.pid})"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8m0-8-8 8"/></svg></button>${p.estado === 'zombie' ? `<button id="pcb-collect-${p.pid}" onclick="pmRecogerZombi(${p.pid})">Recoger</button>` : ''}</div></td>
      </tr>`;
  }).join('') : '<tr><td colspan="11" class="pcb-empty">No hay procesos registrados.</td></tr>';
  if (focus && focus.startsWith('pcb-')) {
    const control = document.getElementById(focus);
    if (control) control.focus({preventScroll:true});
  }
}
// Refrescar únicamente valores: no reconstruir controles ni tocar diagrama/colas.
setInterval(() => {
  if (!document.getElementById('process-table-body')) return;
  procesos.filter(p => p.estado === 'running').forEach(p => {
    const v = pcbValores(p);
    ['pc','cpu'].forEach(key => {
      ['pcb-'].forEach(prefix => {
        const cell = document.getElementById(`${prefix}${p.pid}-${key}`);
        if (cell) cell.textContent = v[key];
      });
    });
  });
}, 500);
