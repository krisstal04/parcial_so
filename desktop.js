/* ============================================
   MINI OS - Escritorio
   Gestión de ventanas, barra de tareas, apps
   ============================================ */

let zIndexCounter = 100;
let ventanas = {};
let ventanaActiva = null;

// Abrir una aplicación
function openApp(appId) {
  const app = APPS[appId];
  if (!app) return;
  
  // Si la ventana ya existe, restaurarla
  if (ventanas[appId]) {
    activarVentana(appId);
    return;
  }
  if (APLICACIONES_CON_PROCESO.includes(appId) && !pmPuedeCrearProceso()) {
    alert('Se alcanzó el límite de 8 procesos activos. Cierra o finaliza uno para abrir otra aplicación.');
    return;
  }
  
  const container = document.getElementById('windows-container');
  const id = 'ventana-' + appId;
  
  const div = document.createElement('div');
  div.className = 'window';
  div.id = id;
  div.style.width = app.width + 'px';
  div.style.height = app.height + 'px';
  div.style.left = (80 + Object.keys(ventanas).length * 30) + 'px';
  div.style.top = (40 + Object.keys(ventanas).length * 30) + 'px';
  div.style.zIndex = ++zIndexCounter;
  
  div.innerHTML = `
    <div class="window-header">
      <span class="window-title">
        <span class="window-title-icon">${app.icon}</span>
        ${app.title}
      </span>
      <div class="window-controls">
        <button class="window-btn btn-minimize" aria-label="Minimizar" onclick="minimizarVentana('${appId}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 16h14"/></svg></button>
        <button class="window-btn btn-maximize" aria-label="Maximizar o restaurar" onclick="maximizarVentana('${appId}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="1"/></svg></button>
        <button class="window-btn btn-close" aria-label="Cerrar" onclick="cerrarVentana('${appId}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
      </div>
    </div>
    <div class="window-content">${app.content}</div>
  `;
  
  div.addEventListener('pointerdown', () => activarVentana(appId), true);
  container.appendChild(div);
  
  // Hacer la ventana arrastrable
  hacerArrastrable(div, appId);
  
  ventanas[appId] = { elemento: div, appId: appId, minimizada: false, maximizada: false };
  ventanaActiva = appId;
  ajustarVentana(appId);
  
  actualizarBarraTareas();
  
  inicializarAplicacion(appId);
  pmAbrirAplicacion(appId);

  // Si es el process manager, actualizar
  if (appId === 'process-manager') {
    setTimeout(actualizarUI, 100);
  }
}

// Llevar al frente desde la ventana, el escritorio o la barra de tareas.
function activarVentana(appId) {
  const v = ventanas[appId];
  if (!v || (ventanaActiva === appId && !v.minimizada)) return;
  v.elemento.classList.remove('minimized');
  v.minimizada = false;
  v.elemento.style.zIndex = ++zIndexCounter;
  ventanaActiva = appId;
  actualizarBarraTareas();
}

function seleccionarVentanaVisible() {
  const visibles = Object.values(ventanas).filter(v => !v.minimizada);
  visibles.sort((a, b) => Number(b.elemento.style.zIndex) - Number(a.elemento.style.zIndex));
  ventanaActiva = visibles.length ? visibles[0].appId : null;
}

// Cerrar ventana
function cerrarVentana(appId) {
  pmCerrarAplicacion(appId);
  const ventana = document.getElementById('ventana-' + appId);
  if (ventana) {
    ventana.remove();
    delete ventanas[appId];
  }
  if (ventanaActiva === appId) seleccionarVentanaVisible();
  actualizarBarraTareas();
}

// Minimizar ventana
function minimizarVentana(appId) {
  const ventana = document.getElementById('ventana-' + appId);
  if (ventana) {
    ventana.classList.add('minimized');
    ventanas[appId].minimizada = true;
  }
  if (ventanaActiva === appId) seleccionarVentanaVisible();
  actualizarBarraTareas();
}

// Mantener cada ventana dentro del escritorio, también al cambiar de tamaño.
function ajustarVentana(appId) {
  const v = ventanas[appId];
  if (!v || v.maximizada) return;
  const desktop = document.getElementById('desktop');
  const width = Math.min(APPS[appId].width, desktop.clientWidth);
  const height = Math.min(APPS[appId].height, desktop.clientHeight);
  const style = v.elemento.style;
  style.width = width + 'px';
  style.height = height + 'px';
  style.left = Math.max(0, Math.min(parseFloat(style.left) || 0, desktop.clientWidth - width)) + 'px';
  style.top = Math.max(0, Math.min(parseFloat(style.top) || 0, desktop.clientHeight - height)) + 'px';
}
window.addEventListener('resize', () => Object.keys(ventanas).forEach(ajustarVentana));

// Maximizar/restaurar ventana
function maximizarVentana(appId) {
  const ventana = document.getElementById('ventana-' + appId);
  if (!ventana) return;
  
  if (ventanas[appId].maximizada) {
    // Restaurar
    ventana.style.width = APPS[appId].width + 'px';
    ventana.style.height = APPS[appId].height + 'px';
    ventana.style.left = '100px';
    ventana.style.top = '50px';
    ventanas[appId].maximizada = false;
    ajustarVentana(appId);
  } else {
    // Maximizar
    ventana.style.width = '100%';
    // El escritorio ya reserva los 52 px de la barra de Inicio.
    ventana.style.height = '100%';
    ventana.style.left = '0';
    ventana.style.top = '0';
    ventanas[appId].maximizada = true;
  }
}

// Actualizar barra de tareas
function actualizarBarraTareas() {
  const contenedor = document.getElementById('taskbar-apps');
  contenedor.innerHTML = '';
  
  Object.keys(ventanas).forEach(appId => {
    const v = ventanas[appId];
    const app = APPS[appId];
    
    const btn = document.createElement('button');
    btn.className = 'taskbar-app' + (ventanaActiva === appId ? ' active' : '');
    btn.setAttribute('aria-label', app.title);
    btn.innerHTML = `<span class="taskbar-app-icon">${app.icon}</span><span class="taskbar-app-label">${app.title}</span>`;
    btn.onclick = () => {
      if (!v.minimizada && ventanaActiva === appId) {
        minimizarVentana(appId);
      } else {
        activarVentana(appId);
      }
    };
    contenedor.appendChild(btn);
  });
}

// Menú inicio
function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  menu.classList.toggle('hidden');
}

// Menú contextual
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Hacer ventanas arrastrable con el mouse
function hacerArrastrable(elemento, appId) {
  const header = elemento.querySelector('.window-header');
  let offsetX, offsetY;
  
  header.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.window-controls')) return;
    e.preventDefault();
    
    const rect = elemento.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    const onMouseMove = (ev) => {
      let x = ev.clientX - offsetX;
      let y = ev.clientY - offsetY;
      
      // Limitar a los bordes
      x = Math.max(0, Math.min(x, window.innerWidth - rect.width));
      y = Math.max(0, Math.min(y, document.getElementById('desktop').clientHeight - rect.height));
      
      elemento.style.left = x + 'px';
      elemento.style.top = y + 'px';
    };
    
    const onMouseUp = () => {
      document.removeEventListener('pointermove', onMouseMove);
      document.removeEventListener('pointerup', onMouseUp);
      document.removeEventListener('pointercancel', onMouseUp);
    };
    
    document.addEventListener('pointermove', onMouseMove);
    document.addEventListener('pointerup', onMouseUp);
    document.addEventListener('pointercancel', onMouseUp);
  });
}

// Reloj del sistema
function actualizarReloj() {
  const ahora = new Date();
  const horas = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  const reloj = document.getElementById('clock');
  if (reloj) reloj.textContent = horas + ':' + minutos;
  const fecha = document.getElementById('taskbar-date');
  if (fecha) fecha.textContent = ahora.toLocaleDateString('es-PA', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

setInterval(actualizarReloj, 1000);
actualizarReloj();

// Cerrar menú inicio al hacer clic fuera
document.addEventListener('click', (e) => {
  const menu = document.getElementById('start-menu');
  const startBtn = document.getElementById('start-btn');
  if (menu && !menu.classList.contains('hidden') && !menu.contains(e.target) && !startBtn.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Abrir el administrador de procesos al inicio
  setTimeout(() => openApp('process-manager'), 300);
});

/* ============================================
   FUNCIONES DE APLICACIONES
   ============================================ */

// Calculadora
let calcDisplay = '0';
let calcCurrentOp = null;
let calcPrevValue = null;
let calcWaitingForOperand = false;

function calcUpdateDisplay() {
  const display = document.getElementById('calc-display');
  if (!display) return;
  display.textContent = calcDisplay;
  display.style.setProperty('--calc-scale', String(1 / Math.max(1, calcDisplay.length * 0.65)));
  display.parentElement.scrollLeft = display.parentElement.scrollWidth;
}

function calcDigit(d) {
  if (pmAppOcupada('calculator')) return;
  if (calcWaitingForOperand) {
    calcDisplay = String(d);
    calcWaitingForOperand = false;
  } else {
    calcDisplay = calcDisplay === '0' ? String(d) : calcDisplay + String(d);
  }
  calcUpdateDisplay();
}

function calcDecimal() {
  if (pmAppOcupada('calculator')) return;
  if (calcWaitingForOperand) {
    calcDisplay = '0.';
    calcWaitingForOperand = false;
  } else if (!calcDisplay.includes('.')) {
    calcDisplay += '.';
  }
  calcUpdateDisplay();
}

function calcOperator(op) {
  if (pmAppOcupada('calculator')) return;
  const value = parseFloat(calcDisplay);
  
  if (calcCurrentOp && !calcWaitingForOperand) {
    const result = calculate(calcPrevValue, value, calcCurrentOp);
    calcDisplay = String(result);
    calcUpdateDisplay();
    calcPrevValue = result;
  } else {
    calcPrevValue = value;
  }
  
  calcCurrentOp = op;
  calcWaitingForOperand = true;
}

function calculate(a, b, op) {
  switch(op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 'Error';
    default: return b;
  }
}

function calcEquals() {
  if (pmAppOcupada('calculator') || !calcCurrentOp || calcWaitingForOperand) return;
  const a=calcPrevValue, b=parseFloat(calcDisplay), op=calcCurrentOp;
  pmTrabajoBreve('calculator', () => {
    calcDisplay=String(calculate(a,b,op));
    calcCurrentOp=null; calcPrevValue=null; calcWaitingForOperand=false;
    calcUpdateDisplay();
  });
}

function calcClear() {
  if (pmAppOcupada('calculator')) return;
  calcReset();
}

function calcReset() {
  calcDisplay = '0';
  calcCurrentOp = null;
  calcPrevValue = null;
  calcWaitingForOperand = false;
  calcUpdateDisplay();
}

function calcToggleSign() {
  if (pmAppOcupada('calculator')) return;
  calcDisplay = String(parseFloat(calcDisplay) * -1);
  calcUpdateDisplay();
}

function calcPercent() {
  if (pmAppOcupada('calculator')) return;
  calcDisplay = String(parseFloat(calcDisplay) / 100);
  calcUpdateDisplay();
}

// Terminal
const TERMINAL_COMMANDS = {
  help: () => `Comandos disponibles:
  help      - Mostrar esta ayuda
  date      - Fecha y hora actual
  whoami    - Usuario actual
  uname     - Información del sistema
  ps        - Procesos activos
  clear     - Limpiar terminal
  neofetch  - Info del sistema
  echo      - Mostrar texto
  history   - Historial de comandos`,
  
  date: () => new Date().toLocaleString('es-ES'),
  
  whoami: () => 'user',
  
  uname: () => 'MiniOS 1.0.0 Web',
  
  ps: () => {
    if (typeof procesos === 'undefined') return 'No hay información de procesos disponible.';
    let output = 'PID\tNOMBRE\t\tESTADO\n';
    procesos.forEach(p => {
      output += `#${p.pid}\t${p.nombre.padEnd(15)}\t${p.estado}\n`;
    });
    return output || 'No hay procesos activos.';
  },
  
  clear: 'clear',
  
  neofetch: () => `
  ╔══════════════════════════════════╗
  ║   ███╗   ███╗██╗███╗   ██╗██╗  ║
  ║   ████╗ ████║██║████╗  ██║██║  ║
  ║   ██╔████╔██║██║██╔██╗ ██║██║  ║
  ║   ██║╚██╔╝██║██║██║╚██╗██║██║  ║
  ║   ██║ ╚═╝ ██║██║██║ ╚████║██║  ║
  ║   ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ║
  ║   Mini OS v1.0.0 - Educativo   ║
  ╚══════════════════════════════════╝`,
  
  history: () => 'No disponible en esta sesión.'
};

let terminalHistory = [];

function terminalExec(cmd) {
  if (!cmd.trim() || pmAppOcupada('terminal-app')) return;
  const input=document.getElementById('terminal-input');
  if (pmTrabajoBreve('terminal-app',()=>terminalCompletar(cmd)) && input) input.disabled=true;
}
function terminalCompletar(cmd) {
  const terminal = document.getElementById('terminal-output');
  const input = document.getElementById('terminal-input');
  
  // Agregar al historial
  terminalHistory.push(cmd);
  
  // Mostrar comando ejecutado
  const executedLine = document.createElement('div');
  executedLine.className = 'terminal-line';
  executedLine.innerHTML = `<span class="terminal-prompt">user@mini-os:~$</span> <span>${escapeHtml(cmd)}</span>`;
  terminal.appendChild(executedLine);
  
  // Procesar comando
  const parts = cmd.trim().split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  if (command === 'clear') {
    terminal.innerHTML = '';
  } else if (command === 'echo') {
    const output = document.createElement('div');
    output.className = 'terminal-output';
    output.textContent = args.join(' ');
    terminal.appendChild(output);
  } else if (TERMINAL_COMMANDS[command]) {
    const result = TERMINAL_COMMANDS[command];
    if (result === 'clear') {
      terminal.innerHTML = '';
    } else {
      const output = document.createElement('div');
      output.className = 'terminal-output ' + (command === 'neofetch' ? 'terminal-success' : '');
      output.textContent = typeof result === 'function' ? result() : result;
      terminal.appendChild(output);
    }
  } else if (command !== '') {
    const output = document.createElement('div');
    output.className = 'terminal-output terminal-error';
    output.textContent = `bash: ${command}: comando no encontrado`;
    terminal.appendChild(output);
  }
  
  // Crear nueva línea de input
  const newLine = document.createElement('div');
  newLine.className = 'terminal-line';
  newLine.innerHTML = `<span class="terminal-prompt">user@mini-os:~$</span> <input type="text" class="terminal-input" id="terminal-input" autofocus onkeydown="if(event.key==='Enter') terminalExec(this.value)" />`;
  terminal.appendChild(newLine);
  
  // Remover input anterior
  input.remove();
  const siguiente=document.getElementById('terminal-input');
  if (siguiente) siguiente.focus();
  
  // Hacer scroll
  terminal.scrollTop = terminal.scrollHeight;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Cerrar menú inicio al presionar Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('start-menu').classList.add('hidden');
  }
});
