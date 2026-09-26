/* Vistas e interacciones de las aplicaciones de escritorio. */
const UI = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 3h4v18H4zM11 3h4v18h-4zM18 4l3 16"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 3h13l4 4v14H3V3zM7 3v6h9V3M7 21v-8h10v8"/></svg>'
};
function uiButton(icon, label, action, extra = '') {
  return `<button type="button" class="app-icon-button" aria-label="${label}" title="${label}" onclick="${action}" ${extra}>${icon}</button>`;
}
const wordInitial = `<h1>Estados de los procesos</h1>
<h2>1. Introducción</h2><p>Cuando abrimos una aplicación, el sistema operativo organiza el trabajo necesario para ejecutarla. Cada proceso pasa por distintos estados según los recursos que necesita y la disponibilidad del procesador.</p>
<h2>2. El ciclo de un proceso</h2><p>Los estados permiten conocer qué está haciendo un proceso en un momento determinado:</p>
<ul><li><strong>Nuevo:</strong> el proceso acaba de crearse.</li><li><strong>Listo:</strong> espera su turno para utilizar la CPU.</li><li><strong>Ejecución:</strong> está utilizando la CPU.</li><li><strong>Bloqueado:</strong> espera un evento, como la finalización de una operación de entrada o salida.</li><li><strong>Finalizado:</strong> ha terminado su ejecución.</li><li><strong>Zombi:</strong> proceso terminado cuyo registro permanece temporalmente en la tabla de procesos.</li></ul>
`;
let wordDraft = wordInitial;
let wordSelection = null;
APPS.word.content = `<div class="word-app modern-app">
<div class="word-document-bar"><span>${ICONS.file}<b>Estados de los procesos</b><small>Documento editable</small></span><span class="app-icon-button word-save-decoration" aria-label="Guardar (icono decorativo)">${UI.save}</span></div>
<div class="word-ribbon-label">Inicio <span>Formato del texto</span></div>
<div class="word-toolbar">
<select aria-label="Tipo de letra" onchange="wordFormat('fontName',this.value)"><option>Arial</option><option>Georgia</option><option>Verdana</option></select>
<select aria-label="Tamaño del texto" onchange="wordFormat('fontSize',this.value)"><option value="3">Normal</option><option value="2">Pequeño</option><option value="5">Grande</option><option value="6">Título</option></select>
${[['bold','Negrita',ICONS.bold],['italic','Cursiva',ICONS.italic],['underline','Subrayado',ICONS.underline],['justifyLeft','Alinear a la izquierda',ICONS.align_left],['justifyCenter','Centrar',ICONS.align_center],['justifyRight','Alinear a la derecha',ICONS.align_right],['insertUnorderedList','Viñetas',ICONS.list_ul],['insertOrderedList','Lista numerada',ICONS.list_ol]].map(([cmd,label,icon])=>uiButton(icon,label,`wordFormat('${cmd}')`,'onmousedown="event.preventDefault()"')).join('')}
<input type="color" value="#243247" aria-label="Color del texto" onchange="wordFormat('foreColor',this.value)"></div>
<div class="word-content"><article id="word-document" class="word-page" contenteditable="true" aria-label="Contenido del documento" oninput="wordChanged()" onkeyup="wordRememberSelection()" onmouseup="wordRememberSelection()"></article></div>
<div class="word-status"><span id="word-count"></span><span>A4 · 210 × 297 mm</span></div></div>`;
function wordRememberSelection() {
  const selection = window.getSelection();
  const page = document.getElementById('word-document');
  if (selection.rangeCount && page.contains(selection.anchorNode) && page.contains(selection.focusNode)) wordSelection = selection.getRangeAt(0).cloneRange();
}
function wordFormat(command, value = null) {
  const page = document.getElementById('word-document');
  page.focus();
  if (wordSelection && page.contains(wordSelection.commonAncestorContainer)) {
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(wordSelection);
  }
  document.execCommand(command, false, value);
  wordRememberSelection(); wordChanged();
}
function wordChanged(actividad = true) {
  if (actividad) pmActividadApp('word',true,2000);
  const page = document.getElementById('word-document'); wordDraft = page.innerHTML;
  document.getElementById('word-count').textContent = `${page.innerText.trim().split(/\s+/).filter(Boolean).length} palabras`;
}
let notesData = [
  {title:'Universidad',body:'Organización de la semana\n\n• Revisar el horario de clases.\n• Ordenar los apuntes por materia.\n• Consultar las próximas fechas de entrega.\n• Reservar un momento para repasar.'},
  {title:'Resumen del parcial',body:'Estados de los procesos\n\nNuevo: el proceso acaba de crearse.\nListo: espera su turno para usar la CPU.\nEjecución: está usando la CPU.\nBloqueado: espera un evento o una operación de entrada/salida.\nFinalizado: terminó su ejecución.'}
];
let currentNote = 0;
APPS.notes.content = `<div class="notes-app modern-app"><aside class="notes-sidebar"><div class="notes-heading"><h4>Mis notas</h4>${uiButton(ICONS.plus,'Nueva nota','newNote()')}</div><p class="notes-caption">Un espacio para tus ideas</p><div id="notes-list"></div></aside><section class="notes-editor"><div class="notes-meta">NOTA PERSONAL</div><input id="note-title" aria-label="Título de la nota" placeholder="Sin título" oninput="saveNote()"><textarea id="note-content" aria-label="Contenido de la nota" placeholder="Empieza a escribir…" oninput="saveNote()"></textarea></section></div>`;
function renderNotes() {
  const list = document.getElementById('notes-list'); list.innerHTML='';
  notesData.forEach((note,i)=>{ const button=document.createElement('button'); button.className='note-item'+(i===currentNote?' active':''); button.setAttribute('aria-pressed',i===currentNote); button.onclick=()=>loadNote(i); const title=document.createElement('b'); title.textContent=note.title||'Sin título'; const preview=document.createElement('small'); preview.textContent=note.body.split('\n').find(Boolean)||'Nota vacía'; button.append(title,preview); list.appendChild(button); });
}
function loadNote(index) {
  if (!notesData[index]) return; currentNote=index;
  document.getElementById('note-title').value=notesData[index].title;
  document.getElementById('note-content').value=notesData[index].body;
  renderNotes();
}
function saveNote() {
  pmActividadApp('notes',true,2000);
  notesData[currentNote]={title:document.getElementById('note-title').value,body:document.getElementById('note-content').value};
  renderNotes();
}
function newNote() { pmActividadApp('notes',true,2000); notesData.push({title:'Nueva nota',body:''}); loadNote(notesData.length-1); document.getElementById('note-title').focus(); }

// Navegación educativa completamente local. Las direcciones .example son ficticias.
APPS.firefox.content = `<div class="firefox-app modern-app"><div class="firefox-tab-strip"><span>${ICONS.firefox}<span id="firefox-tab-title">Nueva pestaña</span></span></div><div class="firefox-toolbar"><div class="firefox-nav-btns">${uiButton('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg>','Volver','firefoxBack()','id="firefox-back"')}${uiButton(UI.home,'Inicio','firefoxHome()')}${uiButton(ICONS.reload,'Recargar','firefoxRender()')}</div><form class="firefox-address" onsubmit="event.preventDefault();firefoxNavigate(this.elements.address.value)"><input name="address" id="firefox-address" class="firefox-url-bar" aria-label="Buscar o introducir dirección" placeholder="Buscar o introducir dirección"></form><span class="app-icon-button firefox-star" aria-label="Favoritos">${ICONS.star}</span></div><div class="firefox-content"><div class="firefox-page" id="firefox-page"></div><section id="firefox-offline" class="firefox-offline" role="status" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5A16 16 0 0 1 21 8M3 8a16 16 0 0 1 2-1.3M12 10a10 10 0 0 1 6 2M6 12a10 10 0 0 1 2-1M9 16a5 5 0 0 1 6 0M3 3l18 18"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg><h1>Sin conexión a Internet</h1><p>Verifica tu conexión a internet e inténtalo de nuevo.</p><code>ERR_INTERNET_DISCONNECTED</code></section></div></div>`;
let firefoxHistory = [{type:'home'}];
const firefoxTemas = [
  {keys:['software','programa','aplicacion'],intro:'El software es el conjunto de programas e instrucciones que permite realizar tareas en una computadora.',example:'Un editor de texto sirve para escribir documentos; un navegador permite consultar información y una calculadora realiza operaciones.',practice:'Compara un programa de sistema con una aplicación de uso diario. Describe qué tarea cumple cada uno.'},
  {keys:['sistema operativo','linux','windows','proceso'],intro:'Un sistema operativo administra la memoria, el procesador y los dispositivos, y ofrece servicios a las aplicaciones.',example:'Un proceso está listo cuando espera la CPU, en ejecución cuando la utiliza y bloqueado cuando espera un evento.',practice:'Abre una aplicación en Mini OS y observa sus estados. Bloquéala, reanúdala y cierra su ventana para comparar las transiciones.'},
  {keys:['programacion','javascript','python','codigo'],intro:'Programar consiste en expresar instrucciones para resolver un problema. Las variables guardan datos y las funciones organizan operaciones.',example:'Un buscador local puede recibir texto, seleccionar datos y dibujar resultados sin comunicarse con un servidor.',practice:'Describe los pasos para sumar dos números: recibir los valores, calcular el resultado y mostrarlo.'},
  {keys:['login','cuenta','sesion','contraseña'],intro:'El inicio de sesión permite que una aplicación identifique a quien intenta acceder a una cuenta.',example:'Una pantalla de acceso suele pedir un identificador y un método de autenticación. Esta página de ejemplo no solicita ni guarda credenciales.',practice:'Distingue entre identificarse, autenticarse y tener permiso para realizar una acción.'},
  {keys:['musica','youtube','spotify','video'],intro:'El contenido multimedia combina elementos como sonido, imagen y vídeo para comunicar ideas o entretener.',example:'Una biblioteca organiza contenido por nombre, autor o categoría. Los controles permiten seleccionar un elemento y recorrer la colección.',practice:'Diseña una lista de contenidos con título, autor y duración. Aquí la navegación es de muestra y no reproduce contenido externo.'},
  {keys:['ciencia','espacio','planeta'],intro:'La ciencia estudia fenómenos mediante observaciones, preguntas y explicaciones que se contrastan con evidencia.',example:'Para estudiar un fenómeno se pueden registrar datos, comparar resultados y revisar si apoyan una explicación.',practice:'Elige una pregunta que puedas investigar y distingue los datos observados de tus conclusiones.'}
];
function firefoxEscape(value) {
  return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function firefoxSiteIcon(index) {
  const symbols = [
    '<path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M6 11v6c4 3 8 3 12 0v-6M21 9v7"/>',
    '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/>',
    '<rect x="6" y="3" width="14" height="18" rx="2"/><path d="M4 7h4M4 12h4M4 17h4M11 8h5M11 12h5M11 16h3"/>',
    '<path d="M12 5v16M3 4c3-1 6-1 9 1 3-2 6-2 9-1v15c-3-1-6-1-9 2-3-3-6-3-9-2V4Z"/>'
    ,'<path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 8h8M8 12h5"/>'
  ];
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${symbols[index] || symbols[3]}</svg>`;
}
function firefoxDatos(query) {
  const normal=query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const topic=firefoxTemas.find(t=>t.keys.some(k=>normal.includes(k))) || {
    intro:`Este recorrido de ejemplo organiza el tema «${query}» en una introducción, ejemplos y actividades.`,
    example:`Para explorar «${query}», comienza por su significado, identifica sus ideas principales y compáralas con ejemplos de la vida cotidiana.`,
    practice:`Escribe tres preguntas sobre «${query}» y prepara un resumen con los conceptos que te gustaría investigar.`
  };
  const slug=encodeURIComponent(normal.trim().replace(/\s+/g,'-'));
  return [
    {template:'wiki',site:'Aula Abierta',host:'aula.example',title:query+': conceptos y ejemplos',description:topic.intro},
    {template:'blog',site:'Perspectiva',host:'perspectiva.example',title:'Una mirada a '+query+': del concepto a la práctica',description:topic.example},
    {template:'shop',site:'Estudio / Objetos',host:'estudio.example',title:'Cuaderno de aprendizaje: '+query,description:'Cuaderno temático con conceptos, actividades y espacio para tus ideas. Descubre esta edición de estudio.'},
    {template:'docs',site:'Guía práctica',host:'guias.example',title:query+' — guía de primeros pasos',description:topic.practice},
    {template:'forum',site:'Punto de encuentro',host:'comunidad.example',title:'¿Cómo empezar a comprender '+query+'?',description:'Una pregunta de la comunidad, ejemplos y respuestas para comenzar a aprender.'}
  ].map((r,i)=>({...r,url:'https://'+r.host+'/'+slug,topic,index:i}));
}
function firefoxHome() {
  firefoxHistory=[{type:'home'}];
  pmFirefoxActividad(false);
  firefoxRender();
}
function firefoxNavigate(value) {
  const query=String(value).trim().slice(0,180);
  if (!query || !pmProcesoAplicacion('firefox')) return;
  firefoxHistory.push({type:'results',query});
  pmFirefoxActividad(true);
  firefoxRender();
}
function firefoxOpen(index) {
  const current=firefoxHistory[firefoxHistory.length-1];
  if (!current.query || !pmProcesoAplicacion('firefox')) return;
  if (!Number.isInteger(index) || index<0 || index>=firefoxDatos(current.query).length) return;
  firefoxHistory.push({type:'article',query:current.query,index});
  pmFirefoxActividad(true);
  firefoxRender();
}
function firefoxBack() {
  if(firefoxHistory.length>1) firefoxHistory.pop();
  pmFirefoxActividad(firefoxHistory[firefoxHistory.length-1].type!=='home');
  firefoxRender();
}
function firefoxSearchForm(query='') {
  return `<form class="firefox-search" onsubmit="event.preventDefault();firefoxNavigate(this.elements.search.value)">${UI.search}<input name="search" aria-label="Buscar" placeholder="Buscar" value="${firefoxEscape(query)}"><button aria-label="Buscar">${ICONS.forward}</button></form>`;
}
function firefoxRender() {
  const page=document.getElementById('firefox-page');
  if(!page) return;
  const state=firefoxHistory[firefoxHistory.length-1];
  const query=firefoxEscape(state.query||'');
  const results=state.query?firefoxDatos(state.query):[];
  const result=results[state.index];
  document.getElementById('firefox-address').value=state.type==='home'?'':state.type==='article'?result.url:state.query;
  document.getElementById('firefox-tab-title').textContent=state.type==='home'?'Nueva pestaña':state.type==='article'?result.site:state.query;
  document.getElementById('firefox-back').disabled=firefoxHistory.length<2;
  page.className='firefox-page'+(state.type==='home'?'':' firefox-browsing');
  if(state.type==='home') {
    page.innerHTML=`<div class="firefox-brand">${ICONS.firefox}<h1>Firefox</h1></div>${firefoxSearchForm()}<div class="firefox-shortcuts">${[['wikipedia','Wikipedia'],['google','Google'],['youtube','YouTube'],['github','GitHub']].map(([icon,name])=>`<a href="#" onclick="event.preventDefault();firefoxNavigate('${name}')"><span><img src="assets/${icon}.${icon==='youtube'?'svg':'ico'}" alt=""></span>${name}</a>`).join('')}</div>`;
  } else if(state.type==='results') {
    page.innerHTML=`<header class="firefox-results-header"><b class="firefox-search-logo">${ICONS.firefox} Buscar</b>${firefoxSearchForm(state.query)}</header><nav class="firefox-results-tabs" aria-label="Tipo de resultados"><span>Todos</span></nav><section class="firefox-result-list" aria-label="Resultados para ${query}">${results.map(r=>`<article class="firefox-result"><a href="#" onclick="event.preventDefault();firefoxOpen(${r.index})"><div class="firefox-result-site"><span class="firefox-site-icon firefox-site-icon-${r.index}" aria-hidden="true">${firefoxSiteIcon(r.index)}</span><span>${r.site}<small>${firefoxEscape(r.url)}</small></span></div><h2>${firefoxEscape(r.title)}</h2></a><p>${firefoxEscape(r.description)}</p></article>`).join('')}</section>`;
  } else {
    page.innerHTML=firefoxPage(result,results,state.query);
  }
  if(page.parentElement) page.parentElement.scrollTop=0;
  firefoxConexionVista();
}
const musicCollections = [
  {name:'Playlist 1',description:'Tu selección de música.',color:'focus',tracks:[['Canción 1','Artista 1','3:24'],['Canción 2','Artista 2','2:58'],['Canción 3','Artista 3','4:12']]},
  {name:'Playlist 2',description:'Más música para acompañar tu día.',color:'energy',tracks:[['Canción 1','Artista 1','3:10'],['Canción 2','Artista 2','3:42'],['Canción 3','Artista 3','2:56']]}
];
let musicCollection=0, musicTrack=0, spotifyPlaying=false;
APPS.spotify.content=`<div class="spotify-app modern-app"><aside class="spotify-sidebar"><div class="spotify-brand">${ICONS.spotify}<b>Spotify</b></div><h4>${UI.book} Tu biblioteca</h4><div id="spotify-library"></div><small class="spotify-demo-label">Biblioteca de muestra<br>Controles de demostración · sin audio</small></aside><main class="spotify-main" id="spotify-main"></main><footer class="spotify-player"><div class="spotify-now"><span class="mini-cover">${ICONS.music}</span><div><b id="spotify-title"></b><small id="spotify-status"></small></div></div><div class="spotify-controls">${uiButton(ICONS.skip_back,'Canción anterior','spotifySkip(-1)')}<button id="spotify-play-btn" class="app-icon-button spotify-play" aria-label="Reproducir vista previa" onclick="spotifyToggle()">${ICONS.play}</button>${uiButton(ICONS.skip_fwd,'Siguiente canción','spotifySkip(1)')}</div><span class="spotify-player-caption">Vista previa · sin audio</span></footer></div>`;
function spotifyCollection(index) {musicCollection=index;musicTrack=0;spotifyPlaying=false;pmActividadApp('spotify',false);spotifyRender();}
function spotifyRender() {
  document.getElementById('spotify-library').innerHTML=musicCollections.map((c,i)=>`<button class="library-item ${i===musicCollection?'selected':''}" onclick="spotifyCollection(${i})"><span class="mini-cover ${c.color}">${ICONS.music}</span><span>${c.name}<small>Playlist · ${c.tracks.length} canciones</small></span></button>`).join('');
  const c=musicCollections[musicCollection];
  document.getElementById('spotify-main').innerHTML=`<div class="spotify-hero ${c.color}"><div class="playlist-cover">${ICONS.music}</div><div><small>PLAYLIST</small><h1>${c.name}</h1><p>${c.description}</p><small>Tu biblioteca · ${c.tracks.length} canciones</small></div></div><div class="spotify-track-heading"><span>#</span><span>Título / artista</span><span>Duración</span></div>${c.tracks.map(([title,artist,duration],i)=>`<button class="spotify-track ${i===musicTrack?'selected':''}" onclick="spotifyPlay(${i})"><span class="track-num">${i+1}</span><span class="track-info"><span class="track-title">${title}</span><span class="track-artist">${artist}</span></span><span class="track-duration">${duration}</span></button>`).join('')}`;
  spotifyUpdatePlayer();
}
function spotifyUpdatePlayer() {
  const track=musicCollections[musicCollection].tracks[musicTrack];document.getElementById('spotify-title').textContent=track[0];document.getElementById('spotify-status').textContent=track[1]+(spotifyPlaying?' · Vista previa activa':' · En pausa');
  const button=document.getElementById('spotify-play-btn');button.innerHTML=spotifyPlaying?ICONS.pause:ICONS.play;button.setAttribute('aria-label',spotifyPlaying?'Pausar vista previa':'Reproducir vista previa');
}
function spotifyPlay(index) {musicTrack=index;spotifyPlaying=true;pmActividadApp('spotify',true);spotifyRender();}
function spotifyToggle() {spotifyPlaying=!spotifyPlaying;pmActividadApp('spotify',spotifyPlaying);spotifyUpdatePlayer();}
function spotifySkip(delta) {musicTrack=(musicTrack+delta+musicCollections[musicCollection].tracks.length)%musicCollections[musicCollection].tracks.length;spotifyRender();}
function inicializarAplicacion(appId) {
  if(appId==='calculator')calcReset();
  if(appId==='word'){wordSelection=null;document.getElementById('word-document').innerHTML=wordDraft;wordChanged(false);}
  if(appId==='notes')loadNote(currentNote);
  if(appId==='firefox')firefoxHome();
  if(appId==='spotify'){spotifyPlaying=false;spotifyRender();}
}
