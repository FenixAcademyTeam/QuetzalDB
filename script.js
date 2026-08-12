let pokemonData = [];
let objetosData = [];
let habilidadesData = [];
let currentTab = 'home';
const pokemonFilters = { region: '', type: '', order: 'number' };

// Datos de Créditos y Changelog (Fácil de editar aquí mismo)
const infoExtra = {
  creditos: [
    { rol: "Creador de Pokémon Quetzal", nombre: "TenmaRH", link: "https://pastebin.com/ncvkGPQJ" },
    { rol: "Equipo de la Database", nombre: "Chayansito", link: "#" },
    { rol: "Equipo de la Database", nombre: "Nelly & Danny", link: "#" }
  ],
  changelog: [
    { version: "v1.9", fecha: "29 de Julio, 2026", cambios: ["Los JSONs ahora usan nombres descriptivos en lugar de field2/field3 (Pokemon, Habilidad, No, IMG, etc.).", "Se actualizaron todas las referencias internas del script para usar los nuevos nombres.", "Mayor facilidad para identificar y corregir errores en los archivos de datos."] },
    { version: "v1.8", fecha: "20 de Julio, 2026", cambios: ["Se agregó sección de Área de Encuentro en la ficha del Pokémon.", "El mapa del área aparece automáticamente para los Pokémon que lo tengan definido.", "Los Pokémon sin área asignada no muestran la sección."] },
    { version: "v1.7", fecha: "19 de Julio, 2026", cambios: ["Nueva Main Page con tarjetas de acceso a cada sección.", "Rediseño de tarjetas Pokémon: número en esquina, nombre en blanco, tipos como píldoras de color.", "Blob de color del tipo principal en esquina inferior de cada tarjeta.", "Total de estadísticas base visible al hacer hover sobre la tarjeta de Pokémon.", "Tarjetas de Objetos y Habilidades actualizadas con el mismo lenguaje visual.", "Fondo con textura de puntos sutil para dar profundidad a la página."] },
    { version: "v1.6", fecha: "16 de Junio, 2026", cambios: ["Se agregó descripción estilo Pokédex en la ficha de cada Pokémon.", "Se actualizó el JSON de Pokémon con el nuevo campo de descripción.", "Se ajustaron todos los campos internos para mantener compatibilidad."] },
    { version: "v1.5", fecha: "16 de Junio, 2026", cambios: ["Rediseño del hero: logo cuadrado, etiqueta de sección y píldora de estadísticas en tiempo real.", "Rediseño de las tabs: selector segmentado unificado con transición suave.", "Buscador centrado con ícono integrado y ancho máximo más compacto."] },
    { version: "v1.4", fecha: "12 de Junio, 2026", cambios: ["Los objetos en la vista detallada del Pokémon son clicables.", "El modal de Objetos muestra qué Pokémon portan el objeto (con indicador Común/Raro).", "Cada Pokémon portador es clicable para ir a su vista detallada."] },
    { version: "v1.3", fecha: "11 de Junio, 2026", cambios: ["Se agregó la pestaña de Habilidades con buscador.", "Las habilidades muestran qué Pokémon las poseen y de qué tipo (normal, secundaria, oculta).", "Las habilidades en la vista detallada del Pokémon son clicables para ver su información."] },
    { version: "v1.2", fecha: "11 de Junio, 2026", cambios: ["Se rediseñó el modal de detalle con header dinámico por tipo.", "Se eliminó el slot Shiny del modal de Pokémon.", "Se añaden sprites de objetos en la sección de objetos portados.", "Se corrigió el header del modal para que no quede cortado por el borde.", "Se aplicó el mismo diseño de header al modal de Objetos."] },
    { version: "v1.1", fecha: "10 de Junio, 2026", cambios: ["Se agregó la pestaña de créditos.", "Se rediseñó el modal de detalles.", "Se separó el ratio de captura del crecimiento para mejor lectura."] },
    { version: "v1.0", fecha: "09 de Junio, 2026", cambios: ["Lanzamiento inicial de la base de datos.", "Buscador funcional de Pokémon y Objetos."] }
  ]
};

const typeColors = {
  "Planta": "#4CAF50", "Fuego": "#FF5722", "Agua": "#2196F3", "Electrico": "#FFEB3B",
  "Hielo": "#81D4FA", "Lucha": "#D32F2F", "Veneno": "#9C27B0", "Tierra": "#E67E22",
  "Volador": "#81D4FA", "Psiquico": "#E91E63", "Bicho": "#8BC34A", "Roca": "#A1887F",
  "Fantasma": "#9575CD", "Dragon": "#5C6BC0", "Siniestro": "#8D6E63", "Acero": "#78909C",
  "Hada": "#FF80AB", "Normal": "#9E9E9E"
};

const BASE = 'https://raw.githubusercontent.com/FenixAcademyTeam/QuetzalSprites/main/';

// Helpers para abstraer los nuevos nombres de campos
const pk = {
  nombre:   p => p.Pokemon,
  mayus:    p => p.Mayus,
  num:      p => p.No,
  sprite:   p => BASE + 'PokemonSprites/' + p.Mayus + '.png',
  mini:     p => p.MINI,
  tipo1:    p => p.Type1 || '',
  tipo2:    p => p.Type2 || '',
  tipo1img: p => p.Type1 ? BASE + 'Tipos/' + p.Type1 + '.png' : '',
  tipo2img: p => p.IMG || '',          // IMG = imagen del tipo 2
  desc:     p => p.Descripcion || '',
  ps:       p => p.PS,
  atq:      p => p.ATQ,
  def:      p => p.DEF,
  aes:      p => p.AES,
  des:      p => p.DES,
  vel:      p => p.VEL,
  cat:      p => p.PKM,
  alt:      p => p.ALT,
  peso:     p => p.PESO,
  cap:      p => p['%CAP'],
  crec:     p => p.CREC,
  obj1:     p => p.OBJ,
  obj2:     p => p['OBJ 2'],
  h1:       p => p.H1,
  h2:       p => p.H2,
  hoculta:  p => p.H && p.H.O ? p.H.O : null,
  eclo1:    p => p.ECLO,
  eclo2:    p => p.ECLO2,
  area:     p => p.AREA || null,
};

const ob = {
  num:    o => o.No,
  nombre: o => o.Name,
  mayus:  o => o.Mayus,
  sprite: o => o.IMG,
  desc:   o => o.Descripcion,
  venta:  o => o.VENTA,
  compra: o => o.COMPRA,
};

const hab = {
  nombre: h => h.Habilidad,
  desc:   h => h.Descripcion,
};


async function loadData() {
  try {
    const [pokemonRes, objetosRes, habilidadesRes] = await Promise.all([
      fetch('Pokemon.json'),
      fetch('Objetos.json'),
      fetch('Habilidades.json')
    ]);
    
    const pokemonJson = await pokemonRes.json();
    const objetosJson = await objetosRes.json();
    const habilidadesJson = await habilidadesRes.json();
    
    pokemonData = pokemonJson;
    objetosData = objetosJson;
    habilidadesData = habilidadesJson;

    // Actualizar contadores del hero
    document.getElementById('statPokemon').textContent = pokemonData.length;
    document.getElementById('statObjetos').textContent = objetosData.length;
    document.getElementById('statHabilidades').textContent = habilidadesData.length;

    // Empezar en home
    setNavVisibility('home');
    renderHome();
  } catch (e) {
    console.error("Error cargando archivos:", e);
    resultsDiv.innerHTML = '<p style="color:red; text-align:center;">Error al cargar los datos. Verifica los archivos JSON.</p>';
  }
}

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');
const tabsContainer = document.querySelector('.tabs');
let lastFocusedElement = null;

function setNavVisibility(tab) {
  const isHome = tab === 'home';
  tabsContainer.style.display = isHome ? 'none' : 'flex';
  searchInput.style.display = (isHome || tab === 'creditos') ? 'none' : 'block';
}

loadData();

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;
    searchInput.value = '';
    setNavVisibility(currentTab);
    renderCurrentTab();
  });
});

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase().trim();
  filterCurrentTab(term);
});

function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocusedElement?.focus();
}

function openModal() {
  lastFocusedElement = document.activeElement;
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const modalTitle = modalBody.querySelector('h2');
  if (modalTitle) modalTitle.id = 'modalTitle';
  closeBtn.focus();
}

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
});

function renderCurrentTab() {
  if (currentTab === 'home') renderHome();
  else if (currentTab === 'pokemon') renderPokemonCatalog();
  else if (currentTab === 'objetos') renderObjects(objetosData);
  else if (currentTab === 'habilidades') renderHabilidades(habilidadesData);
  else renderCreditsAndChangelog();
}

function filterCurrentTab(term) {
  if (!term) return renderCurrentTab();
  
  if (currentTab === 'pokemon') {
    renderPokemonCatalog();
  } else if (currentTab === 'objetos') {
    const filtered = objetosData.filter(o => Object.values(o).join(' ').toLowerCase().includes(term));
    renderObjects(filtered);
  } else if (currentTab === 'habilidades') {
    const filtered = habilidadesData.filter(h => (hab.nombre(h) + ' ' + hab.desc(h)).toLowerCase().includes(term));
    renderHabilidades(filtered);
  }
}

const REGIONES = [
  { nombre: 'Kanto',   inicio: 1,   fin: 151,  color: '#E53935' },
  { nombre: 'Johto',   inicio: 152, fin: 251,  color: '#FB8C00' },
  { nombre: 'Hoenn',   inicio: 252, fin: 386,  color: '#43A047' },
  { nombre: 'Sinnoh',  inicio: 387, fin: 493,  color: '#1E88E5' },
  { nombre: 'Unova',   inicio: 494, fin: 649,  color: '#757575' },
  { nombre: 'Kalos',   inicio: 650, fin: 721,  color: '#E91E63' },
  { nombre: 'Alola',   inicio: 722, fin: 809,  color: '#FF7043' },
  { nombre: 'Galar',   inicio: 810, fin: 905,  color: '#7B1FA2' },
  { nombre: 'Paldea',  inicio: 906, fin: 1025, color: '#00838F' },
  { nombre: 'Especial',inicio: 0,   fin: 0,    color: '#546E7A' },
];

function getRegion(numStr) {
  const n = parseInt(numStr);
  if (!n) return REGIONES[REGIONES.length - 1];
  return REGIONES.find(r => r.inicio > 0 && n >= r.inicio && n <= r.fin) || REGIONES[REGIONES.length - 1];
}

function makePokemonCard(p) {
  const card = document.createElement('div');
  card.className = 'card pokemon-card';
  const type1 = pk.tipo1(p), type2 = pk.tipo2(p);
  const color1 = typeColors[type1] || '#666';
  const color2 = typeColors[type2] || color1;
  card.style.setProperty('--card-stripe', color1);
  const totalStats = [pk.ps(p), pk.atq(p), pk.def(p), pk.aes(p), pk.des(p), pk.vel(p)]
    .reduce((sum, v) => sum + (parseInt(v) || 0), 0);
  card.innerHTML = `
    <div class="card-blob" style="background:radial-gradient(circle,${color1}22 0%,transparent 70%);"></div>
    <span class="card-number">#${pk.num(p)}</span>
    <img src="${pk.sprite(p)}" alt="${pk.nombre(p)}">
    <h3>${pk.nombre(p)}</h3>
    <div class="types">
      ${type1 ? `<span class="type-pill" style="background:${color1}22;border:1px solid ${color1}44;color:${color1};">${type1}</span>` : ''}
      ${type2 ? `<span class="type-pill" style="background:${color2}22;border:1px solid ${color2}44;color:${color2};">${type2}</span>` : ''}
    </div>
    <div class="card-total">Total <strong>${totalStats}</strong></div>
  `;
  card.addEventListener('click', () => showPokemonDetail(p));
  return card;
}

function getPokemonStatTotal(p) {
  return [pk.ps(p), pk.atq(p), pk.def(p), pk.aes(p), pk.des(p), pk.vel(p)]
    .reduce((sum, value) => sum + (parseInt(value) || 0), 0);
}

function renderPokemonCatalog() {
  const query = searchInput.value.toLowerCase().trim();
  const availableTypes = [...new Set(pokemonData.flatMap(p => [pk.tipo1(p), pk.tipo2(p)]).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'es'));
  let pokemons = pokemonData.filter(p => {
    const matchesSearch = !query || Object.values(p).join(' ').toLowerCase().includes(query);
    const matchesRegion = !pokemonFilters.region || getRegion(pk.num(p)).nombre === pokemonFilters.region;
    const matchesType = !pokemonFilters.type || pk.tipo1(p) === pokemonFilters.type || pk.tipo2(p) === pokemonFilters.type;
    return matchesSearch && matchesRegion && matchesType;
  });
  pokemons.sort((a, b) => {
    if (pokemonFilters.order === 'name') return pk.nombre(a).localeCompare(pk.nombre(b), 'es');
    if (pokemonFilters.order === 'stats') return getPokemonStatTotal(b) - getPokemonStatTotal(a);
    return (parseInt(pk.num(a)) || 0) - (parseInt(pk.num(b)) || 0);
  });

  resultsDiv.innerHTML = `
    <section class="pokemon-catalog" aria-label="Filtros de Pokémon">
      <div class="catalog-toolbar">
        <div class="catalog-toolbar-heading"><span>${pokemons.length}</span> Pokémon encontrados</div>
        <div class="catalog-filters">
          <label>Región<select id="filterRegion"><option value="">Todas las regiones</option>${REGIONES.map(r => `<option value="${r.nombre}" ${pokemonFilters.region === r.nombre ? 'selected' : ''}>${r.nombre}</option>`).join('')}</select></label>
          <label>Tipo<select id="filterType"><option value="">Todos los tipos</option>${availableTypes.map(type => `<option value="${type}" ${pokemonFilters.type === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label>
          <label>Ordenar por<select id="filterOrder"><option value="number" ${pokemonFilters.order === 'number' ? 'selected' : ''}>Número</option><option value="name" ${pokemonFilters.order === 'name' ? 'selected' : ''}>Nombre</option><option value="stats" ${pokemonFilters.order === 'stats' ? 'selected' : ''}>Estadísticas base</option></select></label>
          <button type="button" class="filter-reset" id="resetPokemonFilters">Limpiar filtros</button>
        </div>
      </div>
      <div id="pokemonResults" class="pokemon-results"></div>
    </section>
  `;

  document.getElementById('filterRegion').addEventListener('change', e => { pokemonFilters.region = e.target.value; renderPokemonCatalog(); });
  document.getElementById('filterType').addEventListener('change', e => { pokemonFilters.type = e.target.value; renderPokemonCatalog(); });
  document.getElementById('filterOrder').addEventListener('change', e => { pokemonFilters.order = e.target.value; renderPokemonCatalog(); });
  document.getElementById('resetPokemonFilters').addEventListener('click', () => {
    pokemonFilters.region = ''; pokemonFilters.type = ''; pokemonFilters.order = 'number'; searchInput.value = ''; renderPokemonCatalog();
  });
  renderResults(pokemons, document.getElementById('pokemonResults'), Boolean(query || pokemonFilters.region || pokemonFilters.type || pokemonFilters.order !== 'number'));
}

function renderResults(pokemons, container = resultsDiv, showFlat = false) {
  container.innerHTML = '';
  if (pokemons.length === 0) {
    container.innerHTML = '<p class="catalog-empty">No se encontraron Pokémon con estos filtros.</p>';
    return;
  }

  // Si hay búsqueda activa o pocos resultados, mostrar sin agrupar
  const sinAgrupar = showFlat || pokemons.length < 20;
  if (sinAgrupar) {
    const grid = document.createElement('div');
    grid.className = 'results-grid';
    pokemons.forEach(p => grid.appendChild(makePokemonCard(p)));
    container.appendChild(grid);
    return;
  }

  const groupedGrid = document.createElement('div');
  groupedGrid.className = 'results-grid';
  container.appendChild(groupedGrid);

  // Agrupar por región
  const grupos = {};
  pokemons.forEach(p => {
    const r = getRegion(pk.num(p));
    if (!grupos[r.nombre]) grupos[r.nombre] = { region: r, items: [] };
    grupos[r.nombre].items.push(p);
  });

  Object.values(grupos).forEach(({ region, items }) => {
    // Header de región
    const header = document.createElement('div');
    header.className = 'region-header';
    header.style.gridColumn = '1/-1';
    header.dataset.region = region.nombre;
    header.dataset.open = 'true';
    header.innerHTML = `
      <div class="region-stripe" style="background:${region.color};"></div>
      <span class="region-name">${region.nombre}</span>
      <span class="region-count">${items.length} Pokémon</span>
      <span class="region-chevron">▾</span>
    `;
    header.addEventListener('click', () => {
      const isOpen = header.dataset.open === 'true';
      header.dataset.open = isOpen ? 'false' : 'true';
      header.querySelector('.region-chevron').textContent = isOpen ? '▸' : '▾';
      const grid = header.nextElementSibling;
      grid.style.display = isOpen ? 'none' : 'grid';
    });
    groupedGrid.appendChild(header);

    // Sub-grid de tarjetas
    const subgrid = document.createElement('div');
    subgrid.className = 'region-grid';
    subgrid.style.gridColumn = '1/-1';
    items.forEach(p => subgrid.appendChild(makePokemonCard(p)));
    groupedGrid.appendChild(subgrid);
  });
}

function renderObjects(objetos) {
  resultsDiv.innerHTML = '';
  if (objetos.length === 0) {
    resultsDiv.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#aaa;">No se encontraron Objetos</p>';
    return;
  }
  objetos.forEach(o => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-blob" style="background: radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%);"></div>
      <span class="card-number">#${ob.num(o)}</span>
      <img src="${ob.sprite(o)}" alt="${ob.nombre(o)}" style="width:96px;height:96px;margin-top:8px;">
      <h3>${ob.nombre(o)}</h3>
      <p style="font-size:0.78em;color:#666;margin-top:6px;line-height:1.4;">${ob.desc(o) ? ob.desc(o).substring(0, 72) + '…' : ''}</p>
      <div class="card-total" style="opacity:1;transform:none;margin-top:8px;">
        <span style="color:#aaa;font-size:0.72rem;">
          <strong style="color:#FFD700;">${ob.compra(o) || '—'}</strong> compra &nbsp;·&nbsp; <strong style="color:#81D4FA;">${ob.venta(o) || '—'}</strong> venta
        </span>
      </div>
    `;
    card.addEventListener('click', () => showObjectDetail(o));
    resultsDiv.appendChild(card);
  });
}

function renderHabilidades(habilidades) {
  resultsDiv.innerHTML = '';
  if (habilidades.length === 0) {
    resultsDiv.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#aaa;">No se encontraron Habilidades</p>';
    return;
  }
  habilidades.forEach(h => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-blob" style="background: radial-gradient(circle, rgba(100,100,255,0.12) 0%, transparent 70%);"></div>
      <div style="width:54px;height:54px;border-radius:14px;background:rgba(0,200,83,0.08);border:1px solid rgba(0,200,83,0.2);display:flex;align-items:center;justify-content:center;margin:8px auto 12px;font-size:1.4rem;">🧬</div>
      <h3>${hab.nombre(h)}</h3>
      <p style="font-size:0.8em;color:#666;margin-top:8px;line-height:1.5;">${hab.desc(h) || '-'}</p>
    `;
    card.addEventListener('click', () => showHabilidadDetail(h));
    resultsDiv.appendChild(card);
  });
}

function showHabilidadDetail(h) {
  // Pokémon que poseen esta habilidad (normal, secundaria u oculta)
  const nombreH = hab.nombre(h).toLowerCase();
  const poseedores = pokemonData.filter(p => 
    (pk.h1(p) && pk.h1(p).toLowerCase() === nombreH) ||
    (pk.h2(p) && pk.h2(p).toLowerCase() === nombreH) ||
    (pk.hoculta(p) && pk.hoculta(p).toLowerCase() === nombreH)
  );

  const getPokemonRole = (p) => {
    if (pk.hoculta(p) && pk.hoculta(p).toLowerCase() === nombreH) return 'oculta';
    if (pk.h2(p) && pk.h2(p).toLowerCase() === nombreH) return 'secundaria';
    return 'normal';
  };

  const roleLabel = { normal: { txt: 'Normal', color: '#00c853' }, secundaria: { txt: 'Secundaria', color: '#64b5f6' }, oculta: { txt: 'Oculta', color: '#ff80ab' } };

  const pokemonListHtml = poseedores.length === 0
    ? '<p style="color:#aaa;font-size:0.9em;">Ningún Pokémon registrado con esta habilidad.</p>'
    : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px;">
        ${poseedores.map(p => {
          const role = getPokemonRole(p);
          const rl = roleLabel[role];
          return `
            <div style="
              background:rgba(255,255,255,0.04);
              border:1px solid rgba(255,255,255,0.08);
              border-radius:14px;
              padding:12px 8px;
              text-align:center;
              cursor:pointer;
              transition:all 0.25s;
            " onclick="closeModal(); setTimeout(()=>{ const found = pokemonData.find(x=>x.Mayus==='${p.Mayus}'); if(found) showPokemonDetail(found); }, 200);"
              onmouseover="this.style.borderColor='rgba(0,200,83,0.4)'; this.style.transform='translateY(-3px)'"
              onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.transform='translateY(0)'">
              <img src="${pk.sprite(p)}" alt="${pk.nombre(p)}" style="width:54px;height:54px;image-rendering:pixelated;">
              <p style="font-size:0.75em;color:#ddd;margin-top:6px;font-weight:500;">${pk.nombre(p)}</p>
              <span style="font-size:0.65em;color:${rl.color};font-weight:600;">${rl.txt}</span>
            </div>
          `;
        }).join('')}
      </div>`;

  const html = `
    <!-- BANNER -->
    <div style="
      padding: 20px 60px 18px 24px;
      background: linear-gradient(135deg, rgba(0,200,83,0.25), rgba(0,200,83,0.08));
      border-bottom: 2px solid rgba(0,200,83,0.35);
      display: flex;
      align-items: center;
      gap: 16px;
      min-height: 78px;
    ">
      <div style="
        width:48px;height:48px;border-radius:50%;
        background:linear-gradient(135deg,rgba(0,200,83,0.3),rgba(100,221,23,0.15));
        border:2px solid rgba(0,200,83,0.5);
        display:flex;align-items:center;justify-content:center;
        font-size:1.4rem;flex-shrink:0;
      ">🧬</div>
      <h2 style="font-size:1.7rem;font-weight:700;color:#fff;">${hab.nombre(h)}</h2>
    </div>

    <div class="modal-inner">
      <!-- Descripción -->
      <div style="
        background:rgba(0,200,83,0.06);
        border:1px solid rgba(0,200,83,0.2);
        border-radius:16px;
        padding:18px 20px;
        margin-bottom:24px;
      ">
        <p style="color:#e8ecf7;font-size:1rem;line-height:1.7;">${hab.desc(h) || 'Sin descripción.'}</p>
      </div>

      <!-- Pokémon que la poseen -->
      <h3 style="color:var(--green);margin-bottom:14px;font-size:1rem;border-bottom:1px solid rgba(0,200,83,0.15);padding-bottom:8px;">
        Pokémon con esta habilidad
        <span style="font-size:0.8em;color:#aaa;font-weight:400;margin-left:8px;">(${poseedores.length})</span>
      </h3>
      ${pokemonListHtml}
    </div>
  `;

  modalBody.innerHTML = html;
  openModal();
}

function goToTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabName);
  });
  setNavVisibility(tabName);
  searchInput.value = '';
  renderCurrentTab();
}

function renderHome() {
  const sections = [
    {
      tab: 'pokemon',
      icon: `<img src="https://raw.githubusercontent.com/FenixAcademyTeam/QuetzalSprites/main/PokemonSprites/PIKACHU.png" alt="" width="104" height="104">`,
      title: 'Pokémon',
      desc: 'Consulta tipos, estadísticas, habilidades, objetos y áreas registradas.',
      label: 'Pokédex',
      btn: 'Explorar Pokémon',
      accent: '#00c853',
      count: pokemonData.length
    },
    {
      tab: 'objetos',
      icon: `<img src="https://raw.githubusercontent.com/FenixAcademyTeam/QuetzalSprites/main/Objetos/POKE_BALL.png" alt="" width="104" height="104">`,
      title: 'Objetos',
      desc: 'Revisa descripciones, precios y los Pokémon que pueden portarlos.',
      label: 'Inventario',
      btn: 'Explorar objetos',
      accent: '#FFD700',
      count: objetosData.length
    },
    {
      tab: 'habilidades',
      icon: `<span class="home-icon" aria-hidden="true">✦</span>`,
      title: 'Habilidades',
      desc: 'Descubre sus efectos y qué Pokémon tienen cada habilidad disponible.',
      label: 'Habilidades',
      btn: 'Explorar habilidades',
      accent: '#9c88ff',
      count: habilidadesData.length
    }
  ];

  resultsDiv.innerHTML = `
    <section class="home-page" aria-labelledby="homeTitle">
      <div class="home-intro">
        <p class="home-kicker">Guía de consulta</p>
        <h2 id="homeTitle">Todo lo que ya hemos documentado de Pokémon Quetzal.</h2>
        <p>Una base creada por la comunidad para consultar datos del fangame con claridad. Cada entrada se actualiza a medida que la investigación avanza.</p>
      </div>
      <div class="home-section-heading">
        <div><p class="home-kicker">Catálogos</p><h2>Comienza a explorar</h2></div>
        <button class="home-link" type="button" onclick="goToTab('creditos')">Proyecto y cambios <span aria-hidden="true">→</span></button>
      </div>
      <div class="home-cards">
        ${sections.map(s => `
          <article class="home-card" style="--section-accent:${s.accent}">
            <div class="home-card-top"><span class="home-card-label">${s.label}</span><span class="home-card-count">${s.count} registrados</span></div>
            <div class="home-card-icon">${s.icon}</div>
            <h3>${s.title}</h3>
            <p>${s.desc}</p>
            <button type="button" class="home-card-action" onclick="goToTab('${s.tab}')" aria-label="${s.btn}">${s.btn} <span aria-hidden="true">→</span></button>
          </article>
        `).join('')}
      </div>
      <aside class="coverage-note"><span class="coverage-icon" aria-hidden="true">i</span><div><strong>Cobertura en progreso.</strong> Algunos campos aún pueden no estar documentados; preferimos mostrar solo información confirmada en el juego.</div></aside>
    </section>
  `;
}

function renderCreditsAndChangelog() {
  // Ocupa todo el ancho de la grid usando estilos inline sencillos y limpios
  resultsDiv.innerHTML = `
    <div style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 20px;">
      
      <div class="card" style="text-align: left; cursor: default; height: fit-content;">
        <h2 style="color: var(--green); margin-bottom: 20px; border-bottom: 2px solid rgba(0,200,83,0.2); padding-bottom: 8px;">Créditos del Proyecto</h2>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${infoExtra.creditos.map(c => `
            <div>
              <p style="font-size: 0.85em; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">${c.rol}</p>
              <p style="font-size: 1.1em; font-weight: 500; color: #fff;">
                ${c.link !== '#' ? `<a href="${c.link}" target="_blank" style="color: #64dd17; text-decoration: none; border-bottom: 1px dashed;">${c.nombre}</a>` : c.nombre}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card" style="text-align: left; cursor: default;">
        <h2 style="color: var(--green); margin-bottom: 20px; border-bottom: 2px solid rgba(0,200,83,0.2); padding-bottom: 8px;">Historial de Cambios</h2>
        <div style="display: flex; flex-direction: column; gap: 24px;">
          ${infoExtra.changelog.map(ch => `
            <div style="border-left: 3px solid var(--green); padding-left: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                <strong style="font-size: 1.2rem; color: #fff;">${ch.version}</strong>
                <span style="font-size: 0.85em; color: #aaa;">${ch.fecha}</span>
              </div>
              <ul style="padding-left: 18px; color: #ced4da; font-size: 0.95em; display: flex; flex-direction: column; gap: 6px;">
                ${ch.cambios.map(cambio => `<li>${cambio}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

function showPokemonDetail(p) {
  const stats = [
    {name: "PS",          value: pk.ps(p),  color: "#FF5959"},
    {name: "Ataque",      value: pk.atq(p), color: "#F5AC78"},
    {name: "Defensa",     value: pk.def(p), color: "#FAE078"},
    {name: "At. Especial",value: pk.aes(p), color: "#9DB7F5"},
    {name: "Def. Especial",value: pk.des(p),color: "#A7DB8D"},
    {name: "Velocidad",   value: pk.vel(p), color: "#FA92B2"}
  ];

  const bannerColor = typeColors[pk.tipo1(p)] || '#00c853';
  const totalStats = getPokemonStatTotal(p);
  const documentedFields = [pk.desc(p), pk.cat(p), pk.alt(p), pk.peso(p), pk.cap(p), pk.crec(p), pk.eclo1(p), pk.h1(p), pk.area(p)]
    .filter(value => value && value !== '-').length;

  let statsHtml = '';
  stats.forEach(stat => {
    const value = parseInt(stat.value) || 0;
    const percent = Math.min(100, (value / 255) * 100);
    statsHtml += `
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.9em;">
          <span style="color:#aaa;">${stat.name}</span>
          <strong style="color:#fff;">${value}</strong>
        </div>
        <div class="stats-bar">
          <div class="stats-fill" style="width:${percent}%;--stat-color:${stat.color};"></div>
        </div>
      </div>`;
  });

  const obj1name = pk.obj1(p);
  const obj2name = pk.obj2(p);
  const obj1data = obj1name ? objetosData.find(o => ob.nombre(o) && ob.nombre(o).toLowerCase() === obj1name.toLowerCase()) : null;
  const obj2data = obj2name ? objetosData.find(o => ob.nombre(o) && ob.nombre(o).toLowerCase() === obj2name.toLowerCase()) : null;

  const renderItemSprite = (nombre, objData) => {
    if (!nombre) return '';
    const safe = nombre.replace(/'/g, "\\'");
    const spriteHtml = objData ? `<img src="${ob.sprite(objData)}" alt="${nombre}" style="width:24px;height:24px;image-rendering:pixelated;vertical-align:middle;margin-right:4px;">` : '';
    return `<span style="cursor:pointer;border-bottom:1px dashed rgba(255,255,255,0.3);display:inline-flex;align-items:center;gap:2px;" onclick="openObjeto('${safe}')">${spriteHtml}${nombre}</span>`;
  };

  const tipo1 = pk.tipo1(p), tipo2 = pk.tipo2(p);

  const html = `
    <div class="pokemon-detail-banner" style="--pokemon-accent:${bannerColor}">
      <img src="${pk.mini(p)}" alt="" class="pokemon-detail-mini">
      <div style="flex-shrink:0;">
        <span style="font-size:0.75em;color:${bannerColor};font-weight:600;letter-spacing:2px;text-transform:uppercase;display:block;">#${pk.num(p)}</span>
        <h2 style="font-size:1.6rem;font-weight:700;line-height:1.1;color:#fff;white-space:nowrap;">${pk.nombre(p)}</h2>
      </div>
      <div style="margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
        ${tipo1 ? `<span class="type" style="background:${typeColors[tipo1]||'#666'};box-shadow:0 4px 10px rgba(0,0,0,0.3);font-size:0.85em;white-space:nowrap;">
          <img src="${pk.tipo1img(p)}" width="15" height="15" style="vertical-align:middle;"> ${tipo1}
        </span>` : ''}
        ${tipo2 ? `<span class="type" style="background:${typeColors[tipo2]||'#666'};box-shadow:0 4px 10px rgba(0,0,0,0.3);font-size:0.85em;white-space:nowrap;">
          <img src="${pk.tipo2img(p)}" width="15" height="15" style="vertical-align:middle;"> ${tipo2}
        </span>` : ''}
      </div>
    </div>

    <div class="modal-inner">

    ${pk.desc(p) ? `
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px 18px;margin-bottom:20px;display:flex;gap:10px;align-items:flex-start;">
      <span style="font-size:1.1rem;flex-shrink:0;margin-top:2px;">📖</span>
      <p style="color:#b0b8cc;font-size:0.88em;line-height:1.65;font-style:italic;">${pk.desc(p)}</p>
    </div>` : ''}

    <section class="pokemon-summary" aria-label="Resumen de ${pk.nombre(p)}">
      <div><span>Estadísticas base</span><strong>${totalStats}</strong></div>
      <div><span>Datos documentados</span><strong>${documentedFields}/9</strong></div>
      <p>${pk.desc(p) || 'Descripción aún no documentada.'}</p>
    </section>

    <div style="display:grid;grid-template-columns:200px 1fr;gap:24px;">

      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:16px;text-align:center;">
          <p style="font-size:0.7em;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Normal</p>
          <img src="${pk.sprite(p)}" alt="${pk.nombre(p)}" style="width:150px;height:150px;image-rendering:pixelated;">
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:22px;">

        <div class="pokemon-detail-panel" style="--pokemon-accent:${bannerColor}">
          <h3 style="color:var(--green);margin-bottom:14px;font-size:1rem;border-bottom:1px solid rgba(0,200,83,0.15);padding-bottom:8px;">Datos del Pokémon</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.88em;color:#e8ecf7;">
            <p><strong style="color:#aaa;">Categoría</strong><br>${pk.cat(p) || '-'}</p>
            <p><strong style="color:#aaa;">Altura</strong><br>${pk.alt(p) || '-'}</p>
            <p><strong style="color:#aaa;">Peso</strong><br>${pk.peso(p) || '-'}</p>
            <p><strong style="color:#aaa;">Captura</strong><br>${pk.cap(p) || '-'}</p>
            <p><strong style="color:#aaa;">Crecimiento</strong><br>${pk.crec(p) || '-'}</p>
            <p><strong style="color:#aaa;">Grupo Huevo</strong><br>${pk.eclo1(p) || '-'}${pk.eclo2(p) ? ` / ${pk.eclo2(p)}` : ''}</p>
            <p style="grid-column:1/-1;"><strong style="color:#aaa;">Habilidades</strong><br>
              ${pk.h1(p) ? `<span style="color:#00c853;cursor:pointer;border-bottom:1px dashed rgba(0,200,83,0.4);" onclick="openHabilidad('${pk.h1(p).replace(/'/g,"\\'")}')">` + pk.h1(p) + `</span>` : '-'}
              ${pk.h2(p) ? ` / <span style="cursor:pointer;border-bottom:1px dashed rgba(255,255,255,0.3);" onclick="openHabilidad('${pk.h2(p).replace(/'/g,"\\'")}')">` + pk.h2(p) + `</span>` : ''}
              ${pk.hoculta(p) ? ` / <em style="color:#ff80ab;cursor:pointer;border-bottom:1px dashed rgba(255,128,171,0.4);" onclick="openHabilidad('${pk.hoculta(p).replace(/'/g,"\\'")}')">` + pk.hoculta(p) + ` (Oculta)</em>` : ''}
            </p>
            ${obj1name ? `<p style="grid-column:1/-1;"><strong style="color:#aaa;">Objetos</strong><br>
              <span style="display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;">
                ${renderItemSprite(obj1name, obj1data)}
                ${obj2name ? `<span style="color:#555;">/</span>${renderItemSprite(obj2name, obj2data)}` : ''}
              </span>
            </p>` : ''}
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:20px;">
          <h3 style="color:var(--green);margin-bottom:14px;font-size:1rem;border-bottom:1px solid rgba(0,200,83,0.15);padding-bottom:8px;">Estadísticas Base</h3>
          <div style="display:flex;flex-direction:column;gap:12px;">${statsHtml}</div>
        </div>

      </div>
    </div>

    ${pk.area(p) ? `
    <div style="margin-top:22px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:20px;">
      <h3 style="color:var(--green);margin-bottom:14px;font-size:1rem;border-bottom:1px solid rgba(0,200,83,0.15);padding-bottom:8px;">🗺️ Área de Encuentro</h3>
      <img src="${pk.area(p)}" alt="Área de encuentro" style="width:100%;border-radius:12px;image-rendering:pixelated;border:1px solid rgba(255,255,255,0.06);">
    </div>` : ''}

    </div>
  `;

  modalBody.innerHTML = html;
  openModal();
}


function showObjectDetail(o) {
  // Pokémon que portan este objeto (campo 1 o campo 2)
  const nombreO = ob.nombre(o).toLowerCase();
  const portadores = pokemonData.filter(p =>
    (pk.obj1(p) && pk.obj1(p).toLowerCase() === nombreO) ||
    (pk.obj2(p) && pk.obj2(p).toLowerCase() === nombreO)
  );

  const getSlotLabel = (p) => {
    if (pk.obj2(p) && pk.obj2(p).toLowerCase() === nombreO) return { txt: 'Raro', color: '#FFD700' };
    return { txt: 'Común', color: '#81D4FA' };
  };

  const pokemonListHtml = portadores.length === 0
    ? '<p style="color:#aaa;font-size:0.9em;">Ningún Pokémon registrado portando este objeto.</p>'
    : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px;">
        ${portadores.map(p => {
          const sl = getSlotLabel(p);
          return `
            <div style="
              background:rgba(255,255,255,0.04);
              border:1px solid rgba(255,255,255,0.08);
              border-radius:14px;
              padding:12px 8px;
              text-align:center;
              cursor:pointer;
              transition:all 0.25s;
            " onclick="closeModal(); setTimeout(()=>{ const found = pokemonData.find(x=>x.Mayus==='${p.Mayus}'); if(found) showPokemonDetail(found); }, 200);"
              onmouseover="this.style.borderColor='rgba(0,200,83,0.4)'; this.style.transform='translateY(-3px)'"
              onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.transform='translateY(0)'">
              <img src="${pk.sprite(p)}" alt="${pk.nombre(p)}" style="width:54px;height:54px;image-rendering:pixelated;">
              <p style="font-size:0.75em;color:#ddd;margin-top:6px;font-weight:500;">${pk.nombre(p)}</p>
              <span style="font-size:0.65em;color:${sl.color};font-weight:600;">${sl.txt}</span>
            </div>
          `;
        }).join('')}
      </div>`;

  const html = `
    <!-- BANNER SUPERIOR -->
    <div style="
      padding: 20px 60px 18px 24px;
      background: linear-gradient(135deg, rgba(0,200,83,0.2), rgba(0,200,83,0.08));
      border-bottom: 2px solid rgba(0,200,83,0.3);
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      min-height: 78px;
    ">
      <img src="${ob.sprite(o)}" alt="${ob.nombre(o)}" style="width:44px;height:44px;image-rendering:pixelated;flex-shrink:0;">
      <div>
        <span style="font-size:0.75em;color:#00c853;font-weight:600;letter-spacing:2px;text-transform:uppercase;display:block;">#${ob.num(o)}</span>
        <h2 style="font-size:1.6rem;font-weight:700;line-height:1.1;color:#fff;">${ob.nombre(o)}</h2>
      </div>
    </div>

    <div class="modal-inner">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:8px;">

      <!-- Sprite grande + precios -->
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 20px;
          text-align:center;
        ">
          <img src="${ob.sprite(o)}" alt="${ob.nombre(o)}" style="width:120px;height:120px;image-rendering:pixelated;">
        </div>
        <div style="
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 18px;
        ">
          <h3 style="color:var(--green);margin-bottom:12px;font-size:0.95rem;border-bottom:1px solid rgba(0,200,83,0.15);padding-bottom:6px;">Precios</h3>
          <p style="font-size:0.95em;color:#e8ecf7;margin-bottom:8px;"><strong style="color:#aaa;">Compra:</strong> ${ob.compra(o) || '-'}</p>
          <p style="font-size:0.95em;color:#e8ecf7;"><strong style="color:#aaa;">Venta:</strong> ${ob.venta(o) || '-'}</p>
        </div>
      </div>

      <!-- Descripción -->
      <div style="
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(0,200,83,0.2);
        border-radius: 18px;
        padding: 20px;
      ">
        <h3 style="color:var(--green);margin-bottom:12px;font-size:0.95rem;border-bottom:1px solid rgba(0,200,83,0.15);padding-bottom:6px;">Descripción</h3>
        <p style="color:#e8ecf7;line-height:1.7;font-size:0.92em;">${ob.desc(o) || 'Sin descripción'}</p>
      </div>

    </div>

    <!-- Pokémon portadores -->
    <div style="margin-top:24px;">
      <h3 style="color:var(--green);margin-bottom:14px;font-size:1rem;border-bottom:1px solid rgba(0,200,83,0.15);padding-bottom:8px;">
        Pokémon que portan este objeto
        <span style="font-size:0.8em;color:#aaa;font-weight:400;margin-left:8px;">(${portadores.length})</span>
      </h3>
      ${pokemonListHtml}
    </div>

    </div><!-- end modal-inner -->
  `;
  modalBody.innerHTML = html;
  openModal();
}
// Función global para abrir habilidad desde el modal de Pokémon
function openHabilidad(nombre) {
  const h = habilidadesData.find(x => hab.nombre(x).toLowerCase() === nombre.toLowerCase());
  if (h) showHabilidadDetail(h);
}

// Función global para abrir objeto desde el modal de Pokémon
function openObjeto(nombre) {
  const o = objetosData.find(x => ob.nombre(x) && ob.nombre(x).toLowerCase() === nombre.toLowerCase());
  if (o) showObjectDetail(o);
}
