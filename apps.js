/* ============================================
   MINI OS - Aplicaciones con Iconos SVG
   Contenido de cada app simulada
   ============================================ */

// Iconos SVG reutilizables
const ICONS = {
  spotify: `<svg viewBox="0 0 24 24" fill="#1db954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>`,
  firefox: `<img src="assets/firefox.png" alt="" aria-hidden="true">`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>`,
  
  music: `<svg viewBox="0 0 24 24" fill="none" stroke="#1db954" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="#ff7139" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  
  note: `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  
  calc: `<svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="18" x2="12" y2="18.01"/><line x1="16" y1="18" x2="16" y2="18.01"/></svg>`,
  
  terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,17 10,11 4,5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  
  play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,3 19,12 5,21 5,3"/></svg>`,
  
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  
  play_step: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,3 19,12 5,21 5,3"/><line x1="20" y1="3" x2="20" y2="21"/></svg>`,
  
  block: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>`,
  
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  
  zombie: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 7v5h4"/></svg>`,
  
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  
  bold: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>`,
  
  italic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`,
  
  underline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>`,
  
  strikethrough: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-3 3c0 1.66 1.34 3 3 3"/><path d="M14 12a4 4 0 0 1 4 4H6a4 4 0 0 1 4-4"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`,
  
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>`,
  
  forward: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>`,
  
  reload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
  
  list_ul: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  
  list_ol: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`,
  
  skip_back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="19,20 9,12 19,4 19,20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>`,
  
  skip_fwd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5,4 15,12 5,20 5,4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>`,
  
  align_left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>`,
  
  align_center: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>`,
  
  align_right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>`
};

const APPS = {
  'process-manager': {
    title: 'Administrador de Procesos',
    icon: ICONS.settings,
    width: 950,
    height: 650,
    content: `
      <div class="process-manager">
        <div class="pm-header">
          <div class="pm-title-section">
            <span class="pm-title-icon">${ICONS.settings}</span>
            <span class="pm-title">Administrador de Procesos</span>
          </div>
          <div class="pm-stats">
            <div class="pm-stat"><span class="dot dot-new"></span> Nuevo: <b id="count-new">0</b></div>
            <div class="pm-stat"><span class="dot dot-ready"></span> Listo: <b id="count-ready">0</b></div>
            <div class="pm-stat"><span class="dot dot-running"></span> Ejecución: <b id="count-running">0</b></div>
            <div class="pm-stat"><span class="dot dot-blocked"></span> Bloqueado: <b id="count-blocked">0</b></div>
            <div class="pm-stat"><span class="dot dot-finished"></span> Finalizado: <b id="count-finished">0</b></div>
            <div class="pm-stat"><span class="dot dot-zombie"></span> Zombi: <b id="count-zombie">0</b></div>
          </div>
        </div>
        <div class="pm-tabs" role="tablist" aria-label="Vistas del administrador"><button id="pm-tab-processes" role="tab" aria-controls="pm-processes" aria-selected="true" onclick="pmVista('processes')">Procesos</button><button id="pm-tab-performance" role="tab" aria-controls="pm-performance" aria-selected="false" onclick="pmVista('performance')">Rendimiento</button></div>
        <dialog id="pm-block-dialog" class="pm-block-dialog"><h3>Bloquear proceso</h3><div id="pm-block-options"></div><button type="button" onclick="document.getElementById('pm-block-dialog').close()">Cancelar</button></dialog>
        <div id="pm-processes" role="tabpanel" aria-labelledby="pm-tab-processes">
        <div class="pm-toolbar">
          <button id="pm-new" class="pm-btn pm-btn-primary" title="Máximo 8 procesos activos" onclick="pmCrearProceso()">
            <span class="pm-btn-icon">${ICONS.plus}</span> Nuevo Proceso
          </button>
          <button id="pm-advance" class="pm-btn pm-btn-success" onclick="pmAvanzarEstado()">
            <span class="pm-btn-icon">${ICONS.play_step}</span> Avanzar
          </button>
          <button id="pm-block" class="pm-btn pm-btn-warning" onclick="pmElegirBloqueo()">
            <span class="pm-btn-icon">${ICONS.block}</span> Bloquear
          </button>
          <button id="pm-unblock" class="pm-btn pm-btn-secondary" onclick="pmDesbloquearProceso()">
            <span class="pm-btn-icon">${ICONS.play}</span> Desbloquear
          </button>
          <button id="pm-zombie" class="pm-btn pm-btn-secondary" title="Máximo 8 procesos activos" onclick="pmCrearZombi()">
            <span class="pm-btn-icon pm-zombie-icon" aria-hidden="true">${ICONS.zombie}</span> Crear Zombi
          </button>
          <button id="pm-auto" class="pm-btn pm-btn-secondary" onclick="pmAutomatizar()">
            <span class="pm-btn-icon">${ICONS.refresh}</span> Automatizar
          </button>
          <button class="pm-btn pm-btn-danger" title="Reiniciar procesos; las aplicaciones abiertas conservan su contenido y reciben un proceso nuevo" onclick="pmLimpiar()">
            <span class="pm-btn-icon">${ICONS.trash}</span> Limpiar
          </button>
        </div>
        <div class="pm-body">
          <div class="pm-section">
            <div class="pm-section-title">Diagrama de Estados del Proceso</div>
            <div class="state-diagram">
              <svg viewBox="0 40 820 280" role="img" aria-label="Transiciones: Nuevo a Listo, Listo a Ejecución, Ejecución a Bloqueado o Finalizado, Bloqueado a Listo; flecha discontinua de Finalizado a Zombi para representar el resultado pendiente de recogida por el padre.">
                <defs>
                  <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#475569" /></marker>
                </defs>
                <g fill="none" stroke="#475569" stroke-width="2" marker-end="url(#arrowhead)">
                  <path d="M118 90 H202" />
                  <path d="M278 90 H388" />
                  <path d="M472 90 H702" />
                  <path d="M430 132 V227" />
                  <path d="M392 265 H240 V128" />
                  <path d="M740 128 V227" stroke-dasharray="6 4" />
                </g>
                <g fill="#334155" font-size="12" text-anchor="middle">
                  <text x="160" y="76">admitir</text>
                  <text x="333" y="76">planificar</text>
                  <text x="595" y="76">terminar</text>
                  <text x="478" y="185">bloquear</text>
                  <text x="300" y="290">fin de espera → listo</text>
                </g>
                <circle cx="80" cy="90" r="38" fill="#3b82f6" class="state-circle" data-state="new" />
                <circle cx="240" cy="90" r="38" fill="#10b981" class="state-circle" data-state="ready" />
                <circle cx="430" cy="90" r="42" fill="#f97316" class="state-circle" data-state="running" />
                <circle cx="430" cy="265" r="38" fill="#ef4444" class="state-circle" data-state="blocked" />
                <circle cx="740" cy="90" r="38" fill="#8b5cf6" class="state-circle" data-state="finished" />
                <circle cx="740" cy="265" r="38" fill="#eab308" class="state-circle" data-state="zombie" />
                <g fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">
                  <text x="80" y="94">NUEVO</text>
                  <text x="240" y="94">LISTO</text>
                  <text x="430" y="94">EJECUCIÓN</text>
                  <text x="430" y="269">BLOQUEADO</text>
                  <text x="740" y="94">FINALIZADO</text>
                  <text x="740" y="269" fill="#422006">ZOMBI</text>
                </g>
              </svg>
            </div>
          </div>
          
          <div class="pm-section">
            <div class="pm-section-title">Colas de Procesos por Estado</div>
            <div class="process-queues" id="process-queues"></div>
          </div>
          
          <div class="pm-section">
            <div class="pm-section-title pcb-heading">Registro Detallado de Procesos</div>
            <div class="pcb-scroll" tabindex="0" role="region" aria-label="Registro detallado de procesos">
              <table class="process-table pcb-table">
                <thead>
                  <tr>
                    <th>PID</th>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th title="Dirección de la siguiente instrucción">PC</th>
                    <th>Memoria asignada</th>
                    <th>Estado de E/S</th>
                    <th>CPU acumulada</th>
                    <th>Creado</th>
                    <th>Último cambio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody id="process-table-body"></tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
        <div id="pm-performance" role="tabpanel" aria-labelledby="pm-tab-performance" hidden></div>
        <div class="pm-statusbar"><span id="pm-summary">0 procesos registrados · 0 activos · 0 zombis pendientes</span><span id="pm-mode">Modo manual</span></div>
      </div>
    `
  },
  
  'word': { title: 'Word', icon: ICONS.file, width: 940, height: 650, content: '' },
  'spotify': { title: 'Spotify', icon: ICONS.spotify, width: 920, height: 610, content: '' },
  'firefox': { title: 'Firefox', icon: ICONS.firefox, width: 900, height: 620, content: '' },
  'notes': { title: 'Notas', icon: ICONS.note, width: 800, height: 560, content: '' },

  'calculator': {
    title: 'Calculadora',
    icon: ICONS.calc,
    width: 320,
    height: 460,
    content: `
      <div class="calc-app">
        <div class="calc-display-area"><div class="calc-display-scroll" tabindex="0" role="region" aria-label="Resultado de la calculadora"><span class="calc-display" id="calc-display">0</span></div></div>
        <div class="calc-buttons">
          <button class="calc-btn special" onclick="calcClear()">C</button>
          <button class="calc-btn special" onclick="calcToggleSign()">±</button>
          <button class="calc-btn special" onclick="calcPercent()">%</button>
          <button class="calc-btn operator" onclick="calcOperator('/')">÷</button>
          
          <button class="calc-btn" onclick="calcDigit(7)">7</button>
          <button class="calc-btn" onclick="calcDigit(8)">8</button>
          <button class="calc-btn" onclick="calcDigit(9)">9</button>
          <button class="calc-btn operator" onclick="calcOperator('*')">×</button>
          
          <button class="calc-btn" onclick="calcDigit(4)">4</button>
          <button class="calc-btn" onclick="calcDigit(5)">5</button>
          <button class="calc-btn" onclick="calcDigit(6)">6</button>
          <button class="calc-btn operator" onclick="calcOperator('-')">−</button>
          
          <button class="calc-btn" onclick="calcDigit(1)">1</button>
          <button class="calc-btn" onclick="calcDigit(2)">2</button>
          <button class="calc-btn" onclick="calcDigit(3)">3</button>
          <button class="calc-btn operator" onclick="calcOperator('+')">+</button>
          
          <button class="calc-btn wide" onclick="calcDigit(0)">0</button>
          <button class="calc-btn" onclick="calcDecimal()">.</button>
          <button class="calc-btn operator" onclick="calcEquals()">=</button>
        </div>
      </div>
    `
  },
  
  'terminal-app': {
    title: 'Terminal',
    icon: ICONS.terminal,
    width: 680,
    height: 420,
    content: `
      <div class="terminal-app" id="terminal-output">
        <div class="terminal-output">Mini OS Terminal v1.0.0</div>
        <div class="terminal-output">Escribe 'help' para ver comandos disponibles.</div>
        <div style="margin: 4px 0;"></div>
        <div class="terminal-line">
          <span class="terminal-prompt">user@mini-os:~$</span>
          <input type="text" class="terminal-input" id="terminal-input" autofocus onkeydown="if(event.key==='Enter') terminalExec(this.value)" />
        </div>
      </div>
    `
  }
};
