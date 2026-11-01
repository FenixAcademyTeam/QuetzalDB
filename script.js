let pokemonData = [];
let objetosData = [];
let habilidadesData = [];
let currentTab = 'home';
const pokemonFilters = { region: '', type: '', order: 'number' };
let abilityLetter = '';

// Datos de Créditos y Changelog (Fácil de editar aquí mismo)
const infoExtra = {
  creditos: [
    { rol: "Creador de Pokémon Quetzal", nombre: "TenmaRH", link: "https://pastebin.com/ncvkGPQJ" },
    { rol: "Equipo de la Database", nombre: "Fenix Academy Team", link: "#" }
  ],
  changelog: [
    { version: "v2.0", fecha: "12 de Agosto, 2026", cambios: ["Nueva portada con accesos directos a los catálogos y estado de desarrollo del proyecto.", "Filtros para la Pokédex por región, tipo y orden de consulta.", "Mejoras de accesibilidad y navegación: foco visible, cierre de fichas con Escape y diseño adaptable.", "Fichas de Pokémon y documentación del repositorio actualizadas para una consulta más clara."] },
    { version: "v1.9", fecha: "29 de Julio, 2026", cambios: ["Los archivos de datos adoptaron nombres de campos descriptivos.", "Se actualizaron las referencias internas para mantener la compatibilidad y facilitar el mantenimiento."] },
    { version: "v1.8", fecha: "20 de Julio, 2026", cambios: ["Se añadieron áreas de encuentro a las fichas que ya cuentan con ese dato.", "El mapa de encuentro se muestra automáticamente solo cuando está documentado."] },
    { version: "v1.7", fecha: "19 de Julio, 2026", cambios: ["Se creó la página de inicio y se renovaron las tarjetas de Pokémon, objetos y habilidades.", "Las tarjetas de Pokémon muestran número, tipos y total de estadísticas al pasar el cursor.", "Se añadió una textura sutil al fondo para dar mayor profundidad visual."] },
    { version: "v1.6", fecha: "16 de Junio, 2026", cambios: ["Se añadieron descripciones estilo Pokédex a las fichas de Pokémon.", "El archivo de datos de Pokémon se actualizó con el nuevo campo de descripción."] },
    { version: "v1.5", fecha: "16 de Junio, 2026", cambios: ["Se rediseñaron el encabezado, la navegación y el buscador principal.", "Los contadores de Pokémon, objetos y habilidades se actualizan con los datos cargados."] },
    { version: "v1.4", fecha: "12 de Junio, 2026", cambios: ["Los objetos de las fichas de Pokémon ahora abren su propio detalle.", "Cada objeto muestra los Pokémon que pueden portarlo y su rareza cuando está registrada."] },
    { version: "v1.3", fecha: "11 de Junio, 2026", cambios: ["Se añadió el catálogo de habilidades con buscador.", "Cada habilidad muestra los Pokémon que la poseen y su tipo de habilidad."] },
    { version: "v1.2", fecha: "11 de Junio, 2026", cambios: ["Se renovó el diseño de las fichas de detalle de Pokémon y objetos.", "Se mejoró la visualización de objetos portados y los encabezados por tipo."] },
    { version: "v1.1", fecha: "10 de Junio, 2026", cambios: ["Se añadieron créditos e historial de cambios.", "Se reorganizó la información de captura y crecimiento en la ficha de Pokémon."] },
    { version: "v1.0", fecha: "09 de Junio, 2026", cambios: ["Lanzamiento inicial de la base de datos.", "Buscador disponible para Pokémon y objetos."] }
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
  area2:    p => p.AREA2 || null,
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

    // Contadores del sidebar
    document.getElementById('sideCountPokemon').textContent = pokemonData.length;
    document.getElementById('sideCountObjetos').textContent = objetosData.length;
    document.getElementById('sideCountHabilidades').textContent = habilidadesData.length;

    buildRegionList();
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
const sidebar = document.getElementById('sidebar');
const sidebarRegions = document.getElementById('sidebarRegions');
const resultCountEl = document.getElementById('resultCount');
const sidebarOverlay = document.getElementById('sidebarOverlay');
let lastFocusedElement = null;

function setNavVisibility(tab) {
  // La tienda de objetos oculta el sidebar y usa su propio fondo
  document.body.classList.toggle('shop-mode', tab === 'objetos');
  // La Pokédex también oculta el sidebar y usa su propia carcasa
  document.body.classList.toggle('dex-mode', tab === 'pokemon');
  // El códice de habilidades también va sin sidebar y con fondo propio
  document.body.classList.toggle('ability-mode', tab === 'habilidades');
  if (tab !== 'habilidades') abilityLetter = '';
  const hideSearch = (tab === 'home' || tab === 'creditos');
  searchInput.style.display = hideSearch ? 'none' : 'block';
  searchInput.parentElement.style.display = hideSearch ? 'none' : 'block';
  if (resultCountEl) resultCountEl.style.display = hideSearch ? 'none' : 'block';
  // Regiones solo visibles en Pokémon
  if (sidebarRegions) {
    sidebarRegions.classList.toggle('visible', tab === 'pokemon');
  }
  // Active side-nav
  document.querySelectorAll('.side-nav').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
}

function closeSidebarMobile() {
  sidebar?.classList.remove('open');
  sidebarOverlay?.classList.remove('visible');
  if (sidebarOverlay) sidebarOverlay.hidden = true;
  document.body.style.overflow = '';
}

function openSidebarMobile() {
  sidebar?.classList.add('open');
  sidebarOverlay?.classList.add('visible');
  if (sidebarOverlay) sidebarOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

loadData();

document.querySelectorAll('.side-nav').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentTab = btn.dataset.tab;
    searchInput.value = '';
    setNavVisibility(currentTab);
    renderCurrentTab();
    closeSidebarMobile();
  });
});

document.getElementById('shopBack')?.addEventListener('click', () => {
  document.querySelector('.side-nav[data-tab="home"]')?.click();
});

document.getElementById('mobileMenuBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  openSidebarMobile();
});
document.getElementById('sidebarToggle')?.addEventListener('click', (e) => {
  e.stopPropagation();
  closeSidebarMobile();
});
// Solo cerrar si el clic es realmente en el overlay, no en el sidebar
sidebarOverlay?.addEventListener('click', (e) => {
  if (e.target === sidebarOverlay) closeSidebarMobile();
});
// Impedir que clics dentro del sidebar cierren el menú
sidebar?.addEventListener('click', (e) => {
  e.stopPropagation();
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

const CATEGORIAS_OBJETOS = [
  { nombre: 'Objetos', inicio: 1, fin: 128, color: '#90A4AE' },
  { nombre: 'Medicinas', inicio: 129, fin: 172, color: '#EF5350' },
  { nombre: 'Poké Balls', inicio: 173, fin: 199, color: '#E53935' },
  { nombre: 'Bayas', inicio: 200, fin: 267, color: '#AB47BC' },
  { nombre: 'Entrenamiento', inicio: 268, fin: 328, color: '#42A5F5' },
  { nombre: 'Evolución y formas', inicio: 329, fin: 429, color: '#7E57C2' },
  { nombre: 'Batalla', inicio: 430, fin: 545, color: '#FF7043' },
  { nombre: 'Megapiedras', inicio: 546, fin: 639, color: '#EC407A' },
  { nombre: 'Cristales Z', inicio: 640, fin: 674, color: '#FDD835' },
  { nombre: 'Teralitos', inicio: 675, fin: 694, color: '#26A69A' },
  { nombre: 'Objetos clave', inicio: 695, fin: 770, color: '#FFB300' },
];

function getRegion(numStr) {
  const n = parseInt(numStr);
  if (!n) return REGIONES[REGIONES.length - 1];
  return REGIONES.find(r => r.inicio > 0 && n >= r.inicio && n <= r.fin) || REGIONES[REGIONES.length - 1];
}

function makePokemonCard(p) {
  const card = document.createElement('div');
  card.className = 'card pokemon-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  const type1 = pk.tipo1(p), type2 = pk.tipo2(p);
  const color1 = typeColors[type1] || '#5f8aa0';
  const color2 = typeColors[type2] || color1;
  card.style.setProperty('--card-stripe', color1);
  const total = getPokemonStatTotal(p);
  const pct = Math.min(100, Math.round(total / 720 * 100));
  const num = String(pk.num(p) ?? '').padStart(3, '0');
  card.innerHTML = `
    <span class="card-number">No. ${num}</span>
    <div class="card-stage">
      <span class="card-platform" aria-hidden="true"></span>
      <img src="${pk.sprite(p)}" alt="${pk.nombre(p)}">
    </div>
    <h3>${pk.nombre(p)}</h3>
    <div class="types">
      ${type1 ? `<span class="type-pill" style="--tc:${color1}">${type1}</span>` : ''}
      ${type2 ? `<span class="type-pill" style="--tc:${color2}">${type2}</span>` : ''}
    </div>
    <div class="card-total"><span>Total</span><strong>${total}</strong></div>
    <div class="card-bar" aria-hidden="true"><i style="width:${pct}%"></i></div>
  `;
  card.addEventListener('click', () => showPokemonDetail(p));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showPokemonDetail(p); }
  });
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

  if (resultCountEl) resultCountEl.textContent = pokemons.length + ' resultados';

  const pad = n => String(n).padStart(4, '0');
  const regionCounts = {};
  pokemonData.forEach(p => { const r = getRegion(pk.num(p)).nombre; regionCounts[r] = (regionCounts[r] || 0) + 1; });

  resultsDiv.innerHTML = `
    <section class="pokemon-catalog" aria-label="Pokédex">
      <div class="catalog-toolbar">
        <div class="dex-readout" aria-live="polite">
          <span class="dex-readout-label">Registros</span>
          <span class="dex-readout-num">${pad(pokemons.length)}</span>
          <span class="dex-readout-total">/ ${pad(pokemonData.length)}</span>
        </div>
        <div class="catalog-filters">
          <label>Tipo<select id="filterType"><option value="">Todos los tipos</option>${availableTypes.map(type => `<option value="${type}" ${pokemonFilters.type === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label>
          <label>Ordenar por<select id="filterOrder"><option value="number" ${pokemonFilters.order === 'number' ? 'selected' : ''}>Número</option><option value="name" ${pokemonFilters.order === 'name' ? 'selected' : ''}>Nombre</option><option value="stats" ${pokemonFilters.order === 'stats' ? 'selected' : ''}>Estadísticas base</option></select></label>
          <button type="button" class="filter-reset" id="resetPokemonFilters">Limpiar filtros</button>
        </div>
      </div>
      <div class="dex-regions" role="group" aria-label="Filtrar por región">
        <button type="button" class="dex-region ${!pokemonFilters.region ? 'active' : ''}" data-region="" style="--rc:#36e6ff">Todas <small>${pokemonData.length}</small></button>
        ${REGIONES.filter(r => r.inicio > 0).map(r => `
          <button type="button" class="dex-region ${pokemonFilters.region === r.nombre ? 'active' : ''}" data-region="${r.nombre}" style="--rc:${r.color}">${r.nombre} <small>${regionCounts[r.nombre] || 0}</small></button>
        `).join('')}
      </div>
      <div id="pokemonResults" class="pokemon-results"></div>
    </section>
  `;

  document.getElementById('filterType').addEventListener('change', e => { pokemonFilters.type = e.target.value; renderPokemonCatalog(); });
  document.getElementById('filterOrder').addEventListener('change', e => { pokemonFilters.order = e.target.value; renderPokemonCatalog(); });
  document.querySelectorAll('.dex-region').forEach(btn => {
    btn.addEventListener('click', () => {
      pokemonFilters.region = btn.dataset.region || '';
      buildRegionList();
      renderPokemonCatalog();
    });
  });
  document.getElementById('resetPokemonFilters').addEventListener('click', () => {
    pokemonFilters.region = ''; pokemonFilters.type = ''; pokemonFilters.order = 'number'; searchInput.value = '';
    buildRegionList();
    renderPokemonCatalog();
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
    header.setAttribute('role', 'button');
    header.tabIndex = 0;
    header.innerHTML = `
      <span class="region-stripe" style="--rc:${region.color};"></span>
      <span class="region-name">${region.nombre}</span>
      <span class="region-line" aria-hidden="true"></span>
      <span class="region-count">${items.length} reg.</span>
      <span class="region-chevron" aria-hidden="true">▾</span>
    `;
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
    });
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
  if (resultCountEl) resultCountEl.textContent = objetos.length + ' resultados';

  if (objetos.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'shop-empty';
    empty.textContent = 'No se encontraron objetos con esa búsqueda.';
    resultsDiv.appendChild(empty);
    return;
  }

  // Un precio válido contiene al menos un dígito (evita mostrar "—" o "-" como precio)
  const hasPrice = v => v !== undefined && v !== null && /\d/.test(String(v));

  const appendObjectCard = (o, container) => {
    const card = document.createElement('div');
    card.className = 'shop-item';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    const compra = ob.compra(o), venta = ob.venta(o);
    const desc = ob.desc(o) ? ob.desc(o).substring(0, 72) + '…' : '';
    card.innerHTML = `
      <div class="shop-display">
        <span class="shop-item-num">#${ob.num(o)}</span>
        <img src="${ob.sprite(o)}" alt="">
      </div>
      <div class="shop-plank" aria-hidden="true"></div>
      <div class="shop-label">
        <h3>${ob.nombre(o)}</h3>
        ${desc ? `<p class="shop-desc">${desc}</p>` : ''}
        <div class="shop-price">
          ${hasPrice(compra)
            ? `<span class="shop-price-buy" title="Precio de compra"><i class="shop-coin" aria-hidden="true"></i>${compra}</span>`
            : `<span class="shop-price-buy is-na">No se vende</span>`}
          <span class="shop-price-sell">${hasPrice(venta) ? `Venta<br><b>${venta}</b>` : 'Sin venta'}</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => showObjectDetail(o));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showObjectDetail(o); }
    });
    container.appendChild(card);
  };

  const hasSearch = searchInput.value.trim();
  if (hasSearch) {
    const shelf = document.createElement('div');
    shelf.className = 'object-category-grid';
    shelf.style.gridColumn = '1/-1';
    objetos.forEach(o => appendObjectCard(o, shelf));
    resultsDiv.appendChild(shelf);
    return;
  }

  const orderedObjects = [...objetos].sort((a, b) => (parseInt(ob.num(a)) || 0) - (parseInt(ob.num(b)) || 0));
  const groups = CATEGORIAS_OBJETOS.map(category => ({
    category,
    items: orderedObjects.filter(o => {
      const number = parseInt(ob.num(o));
      return number >= category.inicio && number <= category.fin;
    })
  })).filter(group => group.items.length);

  groups.forEach(({ category, items }) => {
    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'object-category-header';
    header.dataset.open = 'true';
    header.style.gridColumn = '1/-1';
    header.innerHTML = `
      <span class="object-category-marker" style="background:${category.color};"></span>
      <span class="object-category-name">${category.nombre}</span>
      <span class="object-category-range">#${category.inicio}–#${category.fin}</span>
      <span class="object-category-count">${items.length} objetos</span>
      <span class="object-category-chevron" aria-hidden="true">▾</span>
    `;
    const grid = document.createElement('div');
    grid.className = 'object-category-grid';
    grid.style.gridColumn = '1/-1';
    items.forEach(o => appendObjectCard(o, grid));
    header.addEventListener('click', () => {
      const isOpen = header.dataset.open === 'true';
      header.dataset.open = isOpen ? 'false' : 'true';
      header.setAttribute('aria-expanded', String(!isOpen));
      header.querySelector('.object-category-chevron').textContent = isOpen ? '▸' : '▾';
      // Igual que regiones de Pokémon: style.display (hidden se anula por display:grid del CSS)
      grid.style.display = isOpen ? 'none' : 'grid';
      grid.hidden = isOpen;
    });
    header.setAttribute('aria-expanded', 'true');
    resultsDiv.append(header, grid);
  });
}

// ---------- Base de datos de habilidades (módulos) ----------
const ABILITY_COLORS = ['#8b7bff', '#36e6ff', '#3dff8a', '#ff4fa3', '#ffb347', '#c6ff4f', '#4f9dff', '#e056fd'];

// Color estable por habilidad (misma habilidad = mismo color siempre)
function abilityColor(name) {
  let hash = 0;
  for (const ch of String(name)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return ABILITY_COLORS[hash % ABILITY_COLORS.length];
}

// Inicial sin acentos para agrupar (Á → A)
function abilityInitial(name) {
  const c = String(name || '?').trim().charAt(0).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

// Código de módulo estable según la posición en la base de datos (HAB-012)
function abilityCode(h) {
  return 'HAB-' + String(habilidadesData.indexOf(h) + 1).padStart(3, '0');
}

// Cuántos Pokémon tienen cada habilidad (normal, secundaria u oculta)
function getAbilityHolderCounts() {
  const counts = {};
  pokemonData.forEach(p => {
    new Set([pk.h1(p), pk.h2(p), pk.hoculta(p)].filter(Boolean).map(x => x.toLowerCase()))
      .forEach(name => { counts[name] = (counts[name] || 0) + 1; });
  });
  return counts;
}

const CHIP_ICON = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/></svg>';

function renderHabilidades(habilidades) {
  resultsDiv.innerHTML = '';
  if (resultCountEl) resultCountEl.textContent = habilidades.length + ' resultados';

  const counts = getAbilityHolderCounts();
  const maxCount = Math.max(1, ...Object.values(counts));
  const sorted = [...habilidades].sort((a, b) => hab.nombre(a).localeCompare(hab.nombre(b), 'es'));
  const letters = [...new Set(sorted.map(h => abilityInitial(hab.nombre(h))))];
  if (abilityLetter && !letters.includes(abilityLetter)) abilityLetter = '';
  const visible = abilityLetter ? sorted.filter(h => abilityInitial(hab.nombre(h)) === abilityLetter) : sorted;

  const section = document.createElement('section');
  section.className = 'codex';
  section.setAttribute('aria-label', 'Habilidades');
  section.innerHTML = `
    <div class="codex-head">
      <span class="codex-emblem">${CHIP_ICON}</span>
      <div>
        <p class="codex-kicker-top">// Base de datos</p>
        <h2>Habilidades</h2>
      </div>
      <div class="codex-readout" aria-live="polite">
        <span>Módulos</span>
        <strong>${String(habilidades.length).padStart(3, '0')}</strong>
      </div>
    </div>
    <nav class="codex-index" aria-label="Filtrar por inicial">
      <button type="button" class="codex-letter is-all ${!abilityLetter ? 'active' : ''}" data-letter="">Todas</button>
      ${letters.map(l => `<button type="button" class="codex-letter ${abilityLetter === l ? 'active' : ''}" data-letter="${l}">${l}</button>`).join('')}
    </nav>
  `;
  section.querySelectorAll('.codex-letter').forEach(btn => {
    btn.addEventListener('click', () => {
      abilityLetter = btn.dataset.letter;
      renderHabilidades(habilidades);
    });
  });

  if (visible.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'catalog-empty';
    empty.textContent = 'No se encontraron habilidades.';
    section.appendChild(empty);
    resultsDiv.appendChild(section);
    return;
  }

  // Agrupar por inicial
  const groups = {};
  visible.forEach(h => { (groups[abilityInitial(hab.nombre(h))] ||= []).push(h); });

  Object.keys(groups).sort().forEach(letter => {
    const items = groups[letter];
    const head = document.createElement('div');
    head.className = 'codex-group-head';
    head.innerHTML = `
      <span class="codex-group-letter" aria-hidden="true">${letter}</span>
      <span class="codex-group-line" aria-hidden="true"></span>
      <span class="codex-group-count">${String(items.length).padStart(2, '0')} registro${items.length === 1 ? '' : 's'}</span>
    `;
    const grid = document.createElement('div');
    grid.className = 'codex-grid';

    items.forEach(h => {
      const name = hab.nombre(h);
      const n = counts[String(name).toLowerCase()] || 0;
      const card = document.createElement('div');
      card.className = 'codex-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.style.setProperty('--ac', abilityColor(name));
      card.innerHTML = `
        <div class="codex-card-body">
          <span class="codex-scan" aria-hidden="true"></span>
          <div class="codex-card-top">
            <div class="codex-medal" aria-hidden="true"><span>${abilityInitial(name)}</span></div>
            <div class="codex-card-id">
              <h3>${name}</h3>
              <span class="codex-code">${abilityCode(h)}</span>
            </div>
            <i class="codex-led" aria-hidden="true"></i>
          </div>
          <p class="codex-desc">${hab.desc(h) || '-'}</p>
          <div class="codex-foot">
            <div class="codex-foot-row"><span>Pokémon</span><strong>${String(n).padStart(2, '0')}</strong></div>
            <div class="codex-meter" aria-hidden="true"><i style="width:${Math.round(n / maxCount * 100)}%"></i></div>
          </div>
        </div>
      `;
      card.addEventListener('click', () => showHabilidadDetail(h));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showHabilidadDetail(h); }
      });
      grid.appendChild(card);
    });
    section.append(head, grid);
  });

  resultsDiv.appendChild(section);
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

  const roleLabel = {
    normal:     { txt: 'Normal',     color: '#3dff8a' },
    secundaria: { txt: 'Secundaria', color: '#4f9dff' },
    oculta:     { txt: 'Oculta',     color: '#ff4fa3' }
  };
  const roleOrder = { normal: 0, secundaria: 1, oculta: 2 };
  const withRole = poseedores.map(p => ({ p, role: getPokemonRole(p) }))
    .sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
  const roleCount = r => withRole.filter(x => x.role === r).length;
  const total = poseedores.length;

  const holdersHtml = withRole.length === 0
    ? '<p class="codex-empty">Ningún Pokémon registrado con esta habilidad.</p>'
    : `<div class="codex-holders">
        ${withRole.map(({ p, role }) => `
          <div class="codex-holder" style="--rc:${roleLabel[role].color}" tabindex="0" role="button"
            onclick="closeModal(); setTimeout(()=>{ const found = pokemonData.find(x=>x.Mayus==='${p.Mayus}'); if(found) showPokemonDetail(found); }, 200);"
            onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">
            <div class="codex-holder-sprite"><img src="${pk.sprite(p)}" alt=""></div>
            <span class="codex-holder-name">${pk.nombre(p)}</span>
            <span class="codex-chip">${roleLabel[role].txt}</span>
          </div>`).join('')}
      </div>`;

  const color = abilityColor(hab.nombre(h));
  const html = `
    <div class="codex-sheet" style="--ac:${color};">
      <div class="codex-hero">
        <div class="codex-medal is-big" aria-hidden="true"><span>${abilityInitial(hab.nombre(h))}</span></div>
        <div>
          <p class="codex-kicker">Módulo de habilidad · ${abilityCode(h)}</p>
          <h2>${hab.nombre(h)}</h2>
        </div>
      </div>

      <div class="codex-body">
        <section class="codex-desc-panel">
          <h3 class="codex-panel-title">Descripción</h3>
          <p>${hab.desc(h) || 'Sin descripción.'}</p>
        </section>

        <div class="codex-roles">
          ${['normal', 'secundaria', 'oculta'].map(r => `
            <div class="codex-role" style="--rc:${roleLabel[r].color}">
              <div class="codex-role-row"><span>${roleLabel[r].txt}</span><strong>${String(roleCount(r)).padStart(2, '0')}</strong></div>
              <div class="codex-meter" aria-hidden="true"><i style="width:${total ? Math.round(roleCount(r) / total * 100) : 0}%"></i></div>
            </div>`).join('')}
        </div>

        <div class="codex-sign">
          <span>Pokémon con esta habilidad</span>
          <b>${String(total).padStart(2, '0')}</b>
        </div>
        ${holdersHtml}
      </div>
    </div>
  `;

  modalBody.innerHTML = html;
  openModal();
}

function goToTab(tabName) {
  currentTab = tabName;
  setNavVisibility(tabName);
  searchInput.value = '';
  renderCurrentTab();
  closeSidebarMobile();
}

function buildRegionList() {
  const list = document.getElementById('regionList');
  if (!list) return;
  // Contar por región
  const counts = {};
  REGIONES.forEach(r => { counts[r.nombre] = 0; });
  pokemonData.forEach(p => {
    const r = getRegion(pk.num(p));
    counts[r.nombre] = (counts[r.nombre] || 0) + 1;
  });
  list.innerHTML = `
    <button type="button" class="side-region-item ${!pokemonFilters.region ? 'active' : ''}" data-region="">
      <span class="side-region-bar" style="background:#666"></span>
      Todas
      <span class="side-region-count">${pokemonData.length}</span>
    </button>
    ${REGIONES.filter(r => r.inicio > 0).map(r => `
      <button type="button" class="side-region-item ${pokemonFilters.region === r.nombre ? 'active' : ''}" data-region="${r.nombre}">
        <span class="side-region-bar" style="background:${r.color}"></span>
        ${r.nombre}
        <span class="side-region-count">${counts[r.nombre] || 0}</span>
      </button>
    `).join('')}
  `;
  list.querySelectorAll('.side-region-item').forEach(btn => {
    btn.addEventListener('click', () => {
      pokemonFilters.region = btn.dataset.region || '';
      list.querySelectorAll('.side-region-item').forEach(b => b.classList.toggle('active', b === btn));
      if (currentTab === 'pokemon') renderPokemonCatalog();
      closeSidebarMobile();
    });
  });
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
    {name: "PS",            value: pk.ps(p),  color: "#ff5959"},
    {name: "Ataque",        value: pk.atq(p), color: "#f5ac78"},
    {name: "Defensa",       value: pk.def(p), color: "#fae078"},
    {name: "At. Especial",  value: pk.aes(p), color: "#9db7f5"},
    {name: "Def. Especial", value: pk.des(p), color: "#a7db8d"},
    {name: "Velocidad",     value: pk.vel(p), color: "#fa92b2"}
  ];
  const accent = typeColors[pk.tipo1(p)] || '#36e6ff';
  const total = getPokemonStatTotal(p);
  const jsArg = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  const statsHtml = stats.map(stat => {
    const value = parseInt(stat.value) || 0;
    const percent = Math.min(100, (value / 255) * 100);
    return `
      <div class="dex-stat">
        <span class="dex-stat-name">${stat.name}</span>
        <div class="dex-bar"><i style="width:${percent}%;--sc:${stat.color};"></i></div>
        <strong>${value}</strong>
      </div>`;
  }).join('') + `
      <div class="dex-stat is-total">
        <span class="dex-stat-name">Total</span>
        <div class="dex-bar"><i style="width:${Math.min(100, total / 720 * 100)}%;--sc:#ffd24a;"></i></div>
        <strong>${total}</strong>
      </div>`;

  const obj1name = pk.obj1(p);
  const obj2name = pk.obj2(p);
  const obj1data = obj1name ? objetosData.find(o => ob.nombre(o) && ob.nombre(o).toLowerCase() === obj1name.toLowerCase()) : null;
  const obj2data = obj2name ? objetosData.find(o => ob.nombre(o) && ob.nombre(o).toLowerCase() === obj2name.toLowerCase()) : null;

  const renderItemLink = (nombre, objData) => {
    if (!nombre) return '';
    const sprite = objData ? `<img src="${ob.sprite(objData)}" alt="" class="dex-item-sprite">` : '';
    return `<button type="button" class="dex-link" onclick="openObjeto('${jsArg(nombre)}')">${sprite}${nombre}</button>`;
  };
  const abilityLink = (nombre, extra = '', cls = '') =>
    `<button type="button" class="dex-link ${cls}" onclick="openHabilidad('${jsArg(nombre)}')">${nombre}${extra}</button>`;

  const tipo1 = pk.tipo1(p), tipo2 = pk.tipo2(p);
  const typeTag = (tipo, img) => tipo
    ? `<span class="dex-type" style="--tc:${typeColors[tipo] || '#5f8aa0'}">${img ? `<img src="${img}" width="16" height="16" alt="">` : ''}${tipo}</span>`
    : '';
  const num = String(pk.num(p) ?? '').padStart(3, '0');

  const habilidades = [
    pk.h1(p) ? abilityLink(pk.h1(p)) : '',
    pk.h2(p) ? abilityLink(pk.h2(p)) : '',
    pk.hoculta(p) ? abilityLink(pk.hoculta(p), ' <small>(Oculta)</small>', 'is-hidden') : ''
  ].filter(Boolean).join('');

  const html = `
    <div class="dex-sheet" style="--dex-accent:${accent};">
      <div class="dex-top">
        <div class="dex-lights" aria-hidden="true"><i class="dex-lens"></i><i class="led r"></i><i class="led y"></i><i class="led g"></i></div>
        <span class="dex-top-title">Pokédex</span>
        <span class="dex-top-sub">Registro de datos</span>
      </div>

      <div class="dex-screen">
        <div class="dex-grid">

          <!-- Escáner -->
          <div class="dex-scanner">
            <div class="dex-stage">
              <span class="dex-ring r1" aria-hidden="true"></span>
              <span class="dex-ring r2" aria-hidden="true"></span>
              <span class="dex-stage-tag">No. ${num}</span>
              <img src="${pk.sprite(p)}" alt="${pk.nombre(p)}" class="dex-sprite">
            </div>
            <div class="dex-id">
              <h2>${pk.nombre(p)}</h2>
              ${pk.cat(p) ? `<p class="dex-cat">${pk.cat(p)}</p>` : ''}
              <div class="dex-types">${typeTag(tipo1, pk.tipo1img(p))}${typeTag(tipo2, pk.tipo2img(p))}</div>
            </div>
            <div class="dex-readouts">
              <div><span>Altura</span><strong>${pk.alt(p) || '-'}</strong></div>
              <div><span>Peso</span><strong>${pk.peso(p) || '-'}</strong></div>
            </div>
          </div>

          <!-- Datos -->
          <div class="dex-data">
            ${pk.desc(p) ? `
            <section class="dex-panel dex-entry">
              <h3 class="dex-panel-title">Entrada</h3>
              <p>${pk.desc(p)}</p>
            </section>` : ''}

            <section class="dex-panel">
              <h3 class="dex-panel-title">Estadísticas base</h3>
              <div class="dex-stats">${statsHtml}</div>
            </section>

            <section class="dex-panel">
              <h3 class="dex-panel-title">Datos</h3>
              <div class="dex-cells">
                <div><span>Captura</span><strong>${pk.cap(p) || '-'}</strong></div>
                <div><span>Crecimiento</span><strong>${pk.crec(p) || '-'}</strong></div>
                <div><span>Grupo huevo</span><strong>${pk.eclo1(p) || '-'}${pk.eclo2(p) ? ` / ${pk.eclo2(p)}` : ''}</strong></div>
                <div class="wide"><span>Habilidades</span><div class="dex-links">${habilidades || '<strong>-</strong>'}</div></div>
                ${obj1name ? `<div class="wide"><span>Objetos</span><div class="dex-links">${renderItemLink(obj1name, obj1data)}${obj2name ? `<em class="dex-sep">/</em>${renderItemLink(obj2name, obj2data)}` : ''}</div></div>` : ''}
              </div>
            </section>
          </div>
        </div>

        ${pk.area(p) ? `
        <section class="dex-panel dex-area">
          <h3 class="dex-panel-title">Área de encuentro</h3>
          <div class="dex-area-grid">
            <img src="${pk.area(p)}" alt="Área de encuentro" onerror="this.style.display='none'">
            ${pk.area2(p) ? `<img src="${pk.area2(p)}" alt="Área de encuentro 2" onerror="this.style.display='none'">` : ''}
          </div>
        </section>` : ''}
      </div>
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

  const getSlotLabel = (p) =>
    (pk.obj2(p) && pk.obj2(p).toLowerCase() === nombreO)
      ? { txt: 'Raro', cls: 'is-rare' }
      : { txt: 'Común', cls: 'is-common' };

  const hasPrice = v => v !== undefined && v !== null && /\d/.test(String(v));
  const compra = ob.compra(o), venta = ob.venta(o);

  const holdersHtml = portadores.length === 0
    ? '<p class="sheet-empty">Ningún Pokémon registrado portando este objeto.</p>'
    : `<div class="sheet-holders">
        ${portadores.map(p => {
          const sl = getSlotLabel(p);
          return `
            <div class="holder" tabindex="0" role="button"
              onclick="closeModal(); setTimeout(()=>{ const found = pokemonData.find(x=>x.Mayus==='${p.Mayus}'); if(found) showPokemonDetail(found); }, 200);"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">
              <div class="holder-display"><img src="${pk.sprite(p)}" alt=""></div>
              <div class="shop-plank" aria-hidden="true"></div>
              <div class="holder-label">
                <span class="holder-name">${pk.nombre(p)}</span>
                <span class="holder-chip ${sl.cls}">${sl.txt}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>`;

  const html = `
    <div class="shop-sheet">
      <div class="sheet-header">
        <span class="sheet-num">#${ob.num(o)}</span>
        <h2>${ob.nombre(o)}</h2>
      </div>

      <div class="sheet-body">
        <div class="sheet-grid">

          <!-- Vitrina con el objeto + precios -->
          <div class="sheet-shelf">
            <div class="sheet-display"><img src="${ob.sprite(o)}" alt="${ob.nombre(o)}"></div>
            <div class="shop-plank" aria-hidden="true"></div>
            <div class="sheet-prices">
              <h3>Precios</h3>
              <p><i class="shop-coin" aria-hidden="true"></i><span class="sheet-price-label">Compra</span>
                 <strong>${hasPrice(compra) ? compra : 'No se vende'}</strong></p>
              <p><i class="shop-coin is-dim" aria-hidden="true"></i><span class="sheet-price-label">Venta</span>
                 <strong>${hasPrice(venta) ? venta : 'Sin venta'}</strong></p>
            </div>
          </div>

          <!-- Descripción -->
          <div class="sheet-note">
            <h3>Descripción</h3>
            <p>${ob.desc(o) || 'Sin descripción'}</p>
          </div>

        </div>

        <!-- Pokémon portadores -->
        <div class="sheet-sign">
          <span>Pokémon que portan este objeto</span>
          <span class="sheet-sign-count">${portadores.length}</span>
        </div>
        ${holdersHtml}
      </div>
    </div>
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
