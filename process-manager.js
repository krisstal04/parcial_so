/* ============================================
   MINI OS - Administrador de Procesos
   Lógica de la simulación de procesos del SO
   ============================================ */

var procesos = [];
var pidCounter = 1;
var automatizadoInterval = null;
const DURACION_CPU_MS = 4000;
const LIMITE_PROCESOS_ACTIVOS = 8;
const temporizadores = new Set();
const APLICACIONES_CON_PROCESO = ['word', 'spotify', 'firefox', 'notes', 'calculator', 'terminal-app'];

function pmPuedeCrearProceso() {
  return procesos.filter(p => !['finished', 'zombie'].includes(p.estado)).length < LIMITE_PROCESOS_ACTIVOS;
}

function pmProcesoAplicacion(appId) {
  return procesos.find(p => p.appId === appId && !['finished', 'zombie'].includes(p.estado));
}

// Firefox conserva la CPU durante la navegación local.
function pmFirefoxActividad(activa) {
  const p = pmProcesoAplicacion('firefox');
  if (!p) return;
  p.navegando = activa;
  if (p.estado === 'running') {
    pmCancelar(p.temporizadorCPU);
    p.temporizadorCPU = null;
    p.inicioEjecucion = null;
    pmCambiarEstado(p, 'ready');
  }
  p.tiempoRestante = DURACION_CPU_MS;
  actualizarUI();
}
function pmTieneTrabajo(p) { return !p.appId || !!p.actividad || (p.appId === 'firefox' && p.navegando); }
function pmActividadContinua(p) { return p.actividad && p.actividad.tipo === 'continua' || p.appId === 'firefox' && p.navegando; }
function pmActividadApp(appId, activa, demora = 0) {
  const p = pmProcesoAplicacion(appId);
  if (!p) return;
  pmCancelar(p.temporizadorInactividad);
  p.temporizadorInactividad = null;
  if (activa) {
    p.actividad = {tipo:'continua'};
    if (demora) p.temporizadorInactividad = pmProgramar(() => {
      if (procesos.includes(p) && pmProcesoAplicacion(appId) === p) pmActividadApp(appId,false);
    },demora);
  } else {
    p.actividad = null;
    if (p.estado === 'running') {
      pmCancelar(p.temporizadorCPU);
      p.temporizadorCPU = null;
      pmCambiarEstado(p,'ready');
      p.inicioEjecucion = null;
    }
  }
  actualizarUI();
}
function pmTrabajoBreve(appId, completar) {
  const p = pmProcesoAplicacion(appId);
  if (!p || p.actividad) return false;
  p.actividad = {tipo:'trabajo', completar};
  p.tiempoRestante = 500;
  actualizarUI();
  return true;
}
function pmAppOcupada(appId) { const p = pmProcesoAplicacion(appId); return !!(p && p.actividad); }
function pmAbrirAplicacion(appId) {
  if (!APLICACIONES_CON_PROCESO.includes(appId)) return;
  return pmProcesoAplicacion(appId) || pmCrearProceso(null, appId);
}

function pmCerrarAplicacion(appId) {
  const proceso = pmProcesoAplicacion(appId);
  if (proceso) {
    pmFinalizarProceso(proceso);
    actualizarUI();
  }
}

function pmCompletarTurno(proceso) {
  if (proceso.appId) {
    const completar = proceso.actividad && proceso.actividad.completar;
    proceso.actividad = null;
    proceso.tiempoRestante = DURACION_CPU_MS;
    pmCambiarEstado(proceso, 'ready');
    if (completar) completar();
  } else {
    pmFinalizarProceso(proceso);
  }
}

// Registrar también la admisión y el arranque para cancelar todo al limpiar.
function pmProgramar(accion, demora) {
  const id = setTimeout(() => {
    temporizadores.delete(id);
    accion();
  }, demora);
  temporizadores.add(id);
  return id;
}

function pmCancelar(id) {
  if (id !== null && id !== undefined) {
    clearTimeout(id);
    temporizadores.delete(id);
  }
}

// Cada proceso ocupa un procesador lógico durante su turno.
function pmIniciarEjecucion(proceso, refrescar = true) {
  const nucleo = pmNucleoLibre();
  if (proceso.estado !== 'ready' || !pmTieneTrabajo(proceso) || nucleo === null) return;
  proceso.esperaPlanificador = false;
  proceso.nucleo = nucleo;
  pmCambiarEstado(proceso, 'running');
  proceso.turnosRecibidos++;
  proceso.inicioEjecucion = performance.now();
  if (pmActividadContinua(proceso)) {
    proceso.temporizadorCPU = null;
    if (refrescar) actualizarUI();
    return;
  }
  proceso.temporizadorCPU = pmProgramar(() => {
    if (!procesos.includes(proceso) || proceso.estado !== 'running') return;
    proceso.temporizadorCPU = null;
    proceso.inicioEjecucion = null;
    proceso.tiempoRestante = 0;
    pmCompletarTurno(proceso);
    actualizarUI();
  }, proceso.tiempoRestante);
  if (refrescar) actualizarUI();
}

function pmFinalizarProceso(proceso) {
  pmCancelar(proceso.temporizadorInactividad);
  proceso.actividad = null;
  pmCancelar(proceso.temporizadorCPU);
  pmCancelar(proceso.temporizadorAdmision);
  proceso.temporizadorCPU = null;
  proceso.temporizadorAdmision = null;
  proceso.inicioEjecucion = null;
  proceso.tiempoRestante = 0;
  proceso.recursosLiberados = true;
  proceso.codigoSalida = 0;
  pmCambiarEstado(proceso, proceso.padre && !proceso.padre.resultadoRecogido ? 'zombie' : 'finished');
  if (proceso.estado === 'zombie') proceso.inicioZombi = performance.now();
}

// Nombres de procesos simulados
const NOMBRES_PROCESOS = [
  'Explorador', 'VS Code', 'Discord', 'Zoom', 'Chrome', 'Slack',
  'Git', 'Docker', 'Node.js', 'Python', 'MySQL', 'NGINX'
];

// Obtener proceso por ID
function getProceso(pid) {
  return procesos.find(p => p.pid === pid);
}

// Crear nuevo proceso
function pmCrearProceso(padre = null, appId = null) {
  if (!pmPuedeCrearProceso()) return null;
  const disponibles = NOMBRES_PROCESOS.filter(nombre => !procesos.some(p => p.nombre === nombre));
  const nombres = disponibles.length ? disponibles : NOMBRES_PROCESOS;
  const nombre = appId ? APPS[appId].title : padre ? 'Exportar' : nombres[Math.floor(Math.random() * nombres.length)];
  const prioridad = Math.floor(Math.random() * 10) + 1;
  
  const proceso = {
    pid: pidCounter++,
    nombre: nombre,
    estado: 'new',
    prioridad: prioridad,
    appId: appId,
    turnosRecibidos: 0,
    tiempoRestante: DURACION_CPU_MS,
    inicioEjecucion: null,
    temporizadorCPU: null,
    padre: padre,
    fechaCreacion: new Date()
  };
  
  pmCrearPCB(proceso);
  procesos.push(proceso);
  actualizarUI();
  
  // Transición automática: Nuevo -> Listo después de un momento
  proceso.temporizadorAdmision = pmProgramar(() => {
    proceso.temporizadorAdmision = null;
    if (procesos.includes(proceso) && proceso.estado === 'new') {
      pmCambiarEstado(proceso, 'ready');
      actualizarUI();
    }
  }, 1500);
  return proceso;
}

// Avanzar estado del siguiente proceso en cola
function pmAvanzarEstado() {
  if (pmNucleoLibre() === null) return;
  // Buscar procesos listos para pasar a ejecución
  const listos = procesos.filter(p => p.estado === 'ready' && pmTieneTrabajo(p));
  
  if (listos.length > 0) {
    // Repartir turnos; la prioridad desempata para evitar que una app acapare la CPU.
    listos.sort((a, b) => a.turnosRecibidos - b.turnosRecibidos || b.prioridad - a.prioridad || a.pid - b.pid);
    pmIniciarEjecucion(listos[0]);
  } else {
    // Si no hay listos, intentar poner uno nuevo directo
    const nuevos = procesos.filter(p => p.estado === 'new');
    if (nuevos.length > 0) {
      pmCancelar(nuevos[0].temporizadorAdmision);
      nuevos[0].temporizadorAdmision = null;
      pmCambiarEstado(nuevos[0], 'ready');
      actualizarUI();
    }
  }
}

// Bloquear un proceso en ejecución
function pmBloquearProceso(pid) {
  const proceso = procesos.find(p => p.estado === 'running' && (pid === undefined || p.pid === Number(pid)));
  if (!proceso) return;
  if (pmActividadContinua(proceso)) {
    pmCambiarEstado(proceso, 'blocked');
    proceso.inicioEjecucion = null;
    proceso.tiempoRestante = DURACION_CPU_MS;
    actualizarUI();
    return;
  }
  proceso.tiempoRestante = Math.max(0,
    proceso.tiempoRestante - (performance.now() - proceso.inicioEjecucion));
  pmCancelar(proceso.temporizadorCPU);
  proceso.temporizadorCPU = null;
  proceso.inicioEjecucion = null;
  // Si la CPU ya completó el trabajo, no crear una espera después de terminar.
  if (proceso.tiempoRestante > 0) pmCambiarEstado(proceso, 'blocked');
  else pmCompletarTurno(proceso);
  actualizarUI();
}

// Desbloquear un proceso
function pmDesbloquearProceso() {
  const bloqueados = procesos.filter(pmPuedeDesbloquear);
  if (bloqueados.length > 0) {
    pmCambiarEstado(bloqueados[0], 'ready');
    actualizarUI();
  }
}

// El hijo recorre los estados normales antes de quedar pendiente de su padre.
function pmCrearZombi() {
  const padre = { nombre: 'Gestor de documentos', resultadoRecogido: false };
  const proceso = pmCrearProceso(padre);
  actualizarUI();
}

function pmRecogerZombi(pid) {
  const proceso = getProceso(pid);
  if (!proceso || proceso.estado !== 'zombie' || !proceso.padre) return;
  // El padre recoge el resultado y la fila queda como historial.
  proceso.padre.resultadoRecogido = true;
  proceso.padre.codigoRecibido = proceso.codigoSalida;
  pmCambiarEstado(proceso, 'finished');
  actualizarUI();
}

function pmDetalleProceso(proceso) {
  if (proceso.appId) {
    const detalle = proceso.estado === 'finished' ? 'Aplicación cerrada. Registro conservado.'
      : proceso.estado === 'blocked' ? 'Espera de entrada/salida simulada. Desbloquear la devuelve a Listo.'
      : 'Aplicación abierta. Turnos de CPU de 4 s hasta cerrar su ventana.';
    return `<small class="process-detail">${detalle}</small>`;
  }
  if (!proceso.padre) return '<small class="process-detail">Proceso de prueba · termina tras 4 s de CPU.</small>';
  const detalle = proceso.estado === 'zombie'
    ? 'Terminó (salida 0). Recursos liberados; el padre aún no recoge el resultado.'
    : proceso.padre.resultadoRecogido
      ? 'El padre recogió el resultado. Registro conservado como historial.'
      : 'Al terminar, esperará a que su padre recoja el resultado.';
  return `<small class="process-detail">${proceso.padre.nombre}. ${detalle}</small>`;
}

// Automatizar el ciclo de procesos
function pmAutomatizar() {
  if (automatizadoInterval) {
    clearInterval(automatizadoInterval);
    automatizadoInterval = null;
    actualizarUI();
    return;
  }
  
  automatizadoInterval = setInterval(() => {
    // Usar las mismas reglas y el mismo reloj de CPU que el modo manual.
    // Detener este intervalo detiene los nuevos turnos, no el trabajo en curso.
    pmPlanificarNucleos();
    // La recogida del resultado es manual para poder observar el zombi.
    if (procesos.some(p => p.estado === 'blocked') && Math.random() > 0.5) {
      pmDesbloquearProceso();
    }
    actualizarUI();
  }, 2000);
  actualizarUI();
}

// Reiniciar la simulación sin cerrar las ventanas ni perder sus documentos.
function pmLimpiar() {
  const abiertas = typeof ventanas === 'undefined' ? []
    : APLICACIONES_CON_PROCESO.filter(appId => ventanas[appId]);
  temporizadores.forEach(id => clearTimeout(id));
  temporizadores.clear();
  procesos = [];
  pmHistorialCPU.length = 0;
  if (automatizadoInterval) {
    clearInterval(automatizadoInterval);
    automatizadoInterval = null;
  }
  abiertas.forEach(pmAbrirAplicacion);
  if (abiertas.includes('firefox')) firefoxHome();
  if (abiertas.includes('spotify')) { spotifyPlaying=false; spotifyUpdatePlayer(); }
  const entrada=document.getElementById('terminal-input');
  if (entrada) entrada.disabled=false;
  actualizarUI();
}

// Eliminar un proceso específico
function pmEliminarProceso(pid) {
  const proceso = getProceso(pid);
  if (proceso && proceso.appId && !['finished', 'zombie'].includes(proceso.estado)) {
    cerrarVentana(proceso.appId);
    return;
  }
  if (proceso) {
    pmCancelar(proceso.temporizadorCPU);
    pmCancelar(proceso.temporizadorAdmision);
  }
  procesos = procesos.filter(p => p.pid !== pid);
  actualizarUI();
}

// Actualizar la interfaz del administrador de procesos
function actualizarUI() {
  pmSincronizarWifi();
  pmPlanificarNucleos(!automatizadoInterval, false);
  pmActualizarRendimiento();
  pmActualizarBloqueo();
  const resumen = document.getElementById('pm-summary');
  if (resumen) {
    const activos = procesos.filter(p => !['finished', 'zombie'].includes(p.estado)).length;
    const pendientes = procesos.filter(p => p.estado === 'zombie').length;
    resumen.textContent = `${procesos.length} procesos registrados · ${activos} activos · ${pendientes} zombis pendientes`;
  }
  const modo = document.getElementById('pm-mode');
  if (modo) modo.textContent = automatizadoInterval ? 'Modo automático' : 'Modo manual';
  const enCPU = procesos.find(p => p.estado === 'running');
  const bloqueados = procesos.filter(p => p.estado === 'blocked');
  const automatico = document.getElementById('pm-auto');
  if (automatico) {
    const icono = automatizadoInterval
      ? '<rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" stroke="none"/>'
      : '<path d="M20 7a9 9 0 1 0 1 8"/><path d="M20 2v6h-6"/>';
    const etiqueta = automatizadoInterval ? 'Detener automatización' : 'Automatizar';
    automatico.innerHTML = `<span class="pm-btn-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icono}</svg></span><span>${etiqueta}</span>`;
    automatico.className = 'pm-btn ' + (automatizadoInterval ? 'pm-btn-warning' : 'pm-btn-secondary');
  }
  const controles = [
    ['pm-new', !pmPuedeCrearProceso()],
    ['pm-zombie', !pmPuedeCrearProceso()],
    ['pm-advance', pmNucleoLibre() === null || !procesos.some(p => p.estado === 'ready' && pmTieneTrabajo(p) || p.estado === 'new')],
    ['pm-block', !enCPU],
    ['pm-unblock', !bloqueados.some(pmPuedeDesbloquear)]
  ];
  controles.forEach(([id, deshabilitado]) => {
    const boton = document.getElementById(id);
    if (boton) {
      boton.disabled = deshabilitado;
      boton.style.opacity = deshabilitado ? '0.5' : '1';
      boton.style.cursor = deshabilitado ? 'not-allowed' : 'pointer';
    }
  });
  // Actualizar contadores
  const estados = ['new', 'ready', 'running', 'blocked', 'finished', 'zombie'];
  estados.forEach(estado => {
    const el = document.getElementById('count-' + estado);
    if (el) {
      el.textContent = procesos.filter(p => p.estado === estado).length;
    }
  });
  
  // Tarjetas de procesos agrupadas por estado.
  const container = document.getElementById('process-queues');
  if (container) {
    container.innerHTML = estados.map(estado => {
      const miembros = procesos.filter(p => p.estado === estado);
      return `<section class="queue-column" aria-label="Procesos en ${capitalize(estado)}">
        <div class="queue-label">${capitalize(estado)} <span>(${miembros.length})</span></div>
        <div class="process-queue">${miembros.length ? miembros.map(p => {
          const accion = p.appId && !['finished','zombie'].includes(p.estado) ? 'Cerrar aplicación' : 'Eliminar registro';
          return `<div class="process-slot ${p.estado}" title="PID ${p.pid} · ${pcbEscape(p.nombre)}"><span class="pid">${p.pid}</span><span class="pname">${pcbEscape(p.nombre)}</span><button type="button" class="remove-btn" aria-label="${accion} ${p.pid}" title="${accion}" onclick="pmEliminarProceso(${p.pid})"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8m0-8-8 8"/></svg></button></div>`;
        }).join('') : '<div class="process-slot empty" aria-label="Sin procesos"><span class="pid">—</span></div>'}</div>
      </section>`;
    }).join('');
  }
  
  pmRenderPCB();
  
  // Resaltar estado activo en el diagrama
  estados.forEach(estado => {
    const circles = document.querySelectorAll(`.state-circle[data-state="${estado}"]`);
    const count = procesos.filter(p => p.estado === estado).length;
    circles.forEach(c => {
      if (count > 0) {
        c.style.opacity = '1';
        c.style.filter = 'brightness(1.1) drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))';
      } else {
        c.style.opacity = '0.3';
        c.style.filter = 'none';
      }
    });
  });
}

function capitalize(str) {
  const nombres = { new: 'Nuevo', ready: 'Listo', running: 'Ejecución', blocked: 'Bloqueado', finished: 'Finalizado', zombie: 'Zombi' };
  return nombres[str] || str;
}

// Al abrir el process manager, crear algunos procesos iniciales
pmProgramar(() => {
  if (procesos.length === 0) {
    pmCrearProceso();
    pmProgramar(pmCrearProceso, 500);
    pmProgramar(pmCrearProceso, 1000);
  }
}, 500);
