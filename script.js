let pokemonData = [];
let objetosData = [];
let habilidadesData = [];
let currentTab = 'home';

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

closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

function renderCurrentTab() {
  if (currentTab === 'home') renderHome();
  else if (currentTab === 'pokemon') renderResults(pokemonData);
  else if (currentTab === 'objetos') renderObjects(objetosData);
  else if (currentTab === 'habilidades') renderHabilidades(habilidadesData);
  else renderCreditsAndChangelog();
}

function filterCurrentTab(term) {
  if (!term) return renderCurrentTab();
  
  if (currentTab === 'pokemon') {
    const filtered = pokemonData.filter(p => Object.values(p).join(' ').toLowerCase().includes(term));
    renderResults(filtered);
  } else if (currentTab === 'objetos') {
    const filtered = objetosData.filter(o => Object.values(o).join(' ').toLowerCase().includes(term));
    renderObjects(filtered);
  } else if (currentTab === 'habilidades') {
    const filtered = habilidadesData.filter(h => (hab.nombre(h) + ' ' + hab.desc(h)).toLowerCase().includes(term));
    renderHabilidades(filtered);
  }
}

function renderResults(pokemons) {
  resultsDiv.innerHTML = '';
  if (pokemons.length === 0) {
    resultsDiv.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#aaa;">No se encontraron Pokémon</p>';
    return;
  }
  pokemons.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card pokemon-card';
    const type1 = pk.tipo1(p), type2 = pk.tipo2(p);
    const color1 = typeColors[type1] || '#666';
    const color2 = typeColors[type2] || color1;
    const totalStats = [pk.ps(p), pk.atq(p), pk.def(p), pk.aes(p), pk.des(p), pk.vel(p)]
      .reduce((sum, v) => sum + (parseInt(v) || 0), 0);

    card.innerHTML = `
      <div class="card-blob" style="background: radial-gradient(circle, ${color1}22 0%, transparent 70%);"></div>
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
    resultsDiv.appendChild(card);
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
            " onclick="modal.style.display='none'; setTimeout(()=>{ const found = pokemonData.find(x=>x.Mayus==='${p.Mayus}'); if(found) showPokemonDetail(found); }, 200);"
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
  modal.style.display = 'block';
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
      icon: `<img src="https://raw.githubusercontent.com/FenixAcademyTeam/QuetzalSprites/main/PokemonSprites/PIKACHU.png" style="width:104px;height:104px;image-rendering:pixelated;">`,
      title: 'Pokémon',
      desc: 'Explora la Pokédex completa con stats, tipos, habilidades y más',
      blob: 'rgba(0,200,83,0.14)',
      btn: 'Ver Pokédex',
      accent: '#00c853',
      count: pokemonData.length
    },
    {
      tab: 'objetos',
      icon: `<img src="https://raw.githubusercontent.com/FenixAcademyTeam/QuetzalSprites/main/Objetos/POKE_BALL.png" style="width:104px;height:104px;image-rendering:pixelated;">`,
      title: 'Objetos',
      desc: 'Busca items, consulta precios y descubre qué Pokémon los portan',
      blob: 'rgba(255,215,0,0.1)',
      btn: 'Ver Items',
      accent: '#FFD700',
      count: objetosData.length
    },
    {
      tab: 'habilidades',
      icon: `<span style="font-size:1.8rem;">🧬</span>`,
      title: 'Habilidades',
      desc: 'Consulta efectos y qué Pokémon poseen cada habilidad',
      blob: 'rgba(100,100,255,0.1)',
      btn: 'Ver Habilidades',
      accent: '#9c88ff',
      count: habilidadesData.length
    },
    {
      tab: 'creditos',
      icon: `<span style="font-size:1.8rem;">📋</span>`,
      title: 'Créditos',
      desc: 'Equipo detrás del proyecto e historial de cambios',
      blob: 'rgba(255,255,255,0.04)',
      btn: 'Ver Créditos',
      accent: '#aaa',
      count: null
    }
  ];

  resultsDiv.innerHTML = `
    <div style="grid-column:1/-1;">
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
        max-width: 700px;
        margin: 8px auto 0;
      ">
        ${sections.map(s => `
          <div onclick="goToTab('${s.tab}')" style="
            position: relative;
            overflow: hidden;
            border-radius: 22px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            padding: 26px 22px;
            cursor: pointer;
            transition: all 0.35s cubic-bezier(0.25,1,0.5,1);
          "
          onmouseover="this.style.transform='translateY(-6px)';this.style.borderColor='${s.accent}44';this.style.boxShadow='0 16px 40px rgba(0,0,0,0.35)'"
          onmouseout="this.style.transform='';this.style.borderColor='rgba(255,255,255,0.08)';this.style.boxShadow=''">
            <div style="position:absolute;bottom:-24px;right:-24px;width:100px;height:100px;background:radial-gradient(circle,${s.blob},transparent 70%);pointer-events:none;"></div>
            ${s.count !== null ? `<span style="position:absolute;top:16px;right:16px;font-size:0.65rem;color:#444;font-weight:600;letter-spacing:1px;">${s.count}</span>` : ''}
            <div style="margin-bottom:12px;">${s.icon}</div>
            <h3 style="color:#fff;font-size:1.05rem;font-weight:600;margin-bottom:6px;">${s.title}</h3>
            <p style="color:#555;font-size:0.78rem;line-height:1.55;margin-bottom:16px;">${s.desc}</p>
            <div style="
              display:inline-flex;align-items:center;gap:6px;
              background:${s.accent}18;
              border:1px solid ${s.accent}33;
              border-radius:20px;padding:5px 14px;
            ">
              <span style="font-size:0.72rem;color:${s.accent};font-weight:600;">${s.btn} →</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
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
    <div style="padding:20px 60px 18px 24px;background:linear-gradient(135deg,${bannerColor}33,${bannerColor}15);border-bottom:2px solid ${bannerColor}55;display:flex;align-items:center;gap:14px;flex-wrap:wrap;min-height:78px;">
      <img src="${pk.mini(p)}" style="width:38px;height:38px;image-rendering:pixelated;flex-shrink:0;">
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

    <div style="display:grid;grid-template-columns:200px 1fr;gap:24px;">

      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:16px;text-align:center;">
          <p style="font-size:0.7em;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Normal</p>
          <img src="${pk.sprite(p)}" alt="${pk.nombre(p)}" style="width:150px;height:150px;image-rendering:pixelated;">
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:22px;">

        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(0,200,83,0.2);border-radius:18px;padding:20px;">
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
  modal.style.display = 'block';
}

  let statsHtml = '';
  stats.forEach(stat => {
    const value = parseInt(stat.value) || 0;
    const percent = Math.min(100, (value / 255) * 100);
    statsHtml += `
      <div>
        <div style="display:flex; justify-content:space-between; font-size: 0.9em;">
          <span style="color: #aaa;">${stat.name}</span>
          <strong style="color: #fff;">${value}</strong>
        </div>
        <div class="stats-bar">
          <div class="stats-fill" style="width:${percent}%; --stat-color: ${stat.color};"></div>
        </div>
      </div>
    `;
  });

  // Buscar sprites de los objetos que porta el Pokémon
  const obj1 = pk.obj1(p) ? objetosData.find(o => ob.nombre(o) && ob.nombre(o).toLowerCase() === pk.obj1(p).toLowerCase()) : null;
  const obj2 = pk.obj2(p) ? objetosData.find(o => ob.nombre(o) && ob.nombre(o).toLowerCase() === pk.obj2(p).toLowerCase()) : null;

  const renderItemSprite = (nombre, objData) => {
    if (!nombre) return '';
    const safe = nombre.replace(/'/g, "\\'");
    const spriteHtml = objData ? `<img src="${ob.sprite(objData)}" alt="${nombre}" style="width:24px;height:24px;image-rendering:pixelated;vertical-align:middle;margin-right:4px;">` : '';
    return `<span style="cursor:pointer;border-bottom:1px dashed rgba(255,255,255,0.3);display:inline-flex;align-items:center;gap:2px;transition:opacity 0.2s;" onclick="openObjeto('${safe}')">${spriteHtml}${nombre}</span>`;
  };

  const html = `
    <!-- BANNER SUPERIOR con nombre y número -->
    <div style="
      padding: 20px 60px 18px 24px;
      background: linear-gradient(135deg, ${bannerColor}33, ${bannerColor}15);
      border-bottom: 2px solid ${bannerColor}55;
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      min-height: 78px;
    ">
      <img src="${pk.mini(p)}" alt="${pk.nombre(p)}" style="width:38px;height:38px;image-rendering:pixelated;flex-shrink:0;">
      <div style="flex-shrink:0;">
        <span style="font-size:0.75em;color:${bannerColor};font-weight:600;letter-spacing:2px;text-transform:uppercase;display:block;">#${pk.num(p)}</span>
        <h2 style="font-size:1.6rem;font-weight:700;line-height:1.1;color:#fff;white-space:nowrap;">${pk.nombre(p)}</h2>
      </div>
      <div style="margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
        <span class="type" style="background:${typeColors[pk.tipo1(p)]||'#666'}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size:0.85em; white-space:nowrap;">
          <img src="${pk.tipo1img(p)}" width="15" height="15" style="vertical-align:middle;"> ${pk.tipo1(p)}
        </span>
        ${pk.tipo2(p) ? `<span class="type" style="background:${typeColors[pk.tipo2(p)]||'#666'}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size:0.85em; white-space:nowrap;">
          <img src="${pk.tipo2img(p)}" width="15" height="15" style="vertical-align:middle;"> ${pk.tipo2(p)}
        </span>` : ''}
      </div>
    </div>

    <!-- CUERPO -->
    <div class="modal-inner">

    <!-- Descripción Pokédex -->
    ${pk.desc(p) ? `
    <div style="
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px;
      padding: 14px 18px;
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    ">
      <span style="font-size:1.1rem;flex-shrink:0;margin-top:2px;"></span>
      <p style="color:#b0b8cc;font-size:0.88em;line-height:1.65;font-style:italic;">${pk.desc(p)}</p>
    </div>` : ''}

    <!-- CUERPO PRINCIPAL: izquierda sprite | derecha info -->
    <div style="display:grid; grid-template-columns: 200px 1fr; gap: 24px;">

      <!-- COLUMNA IZQUIERDA: sprite normal -->
      <div style="display:flex; flex-direction:column; gap:16px;">

        <!-- Sprite normal -->
        <div style="
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 16px;
          text-align:center;
        ">
          <p style="font-size:0.7em;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Normal</p>
          <img src="${pk.sprite(p)}" alt="${pk.nombre(p)}" style="width:150px;height:150px;image-rendering:pixelated;">
        </div>

      </div>

      <!-- COLUMNA DERECHA: datos + stats -->
      <div style="display:flex;flex-direction:column;gap:22px;">

        <!-- Datos del Pokémon -->
        <div style="
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(0,200,83,0.2);
          border-radius: 18px;
          padding: 20px;
        ">
          <h3 style="color:var(--green);margin-bottom:14px;font-size:1rem;border-bottom:1px solid rgba(0,200,83,0.15);padding-bottom:8px;">Datos del Pokémon</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.88em;color:#e8ecf7;">
            <p><strong style="color:#aaa;">Categoría</strong><br>${pk.cat(p) || '-'}</p>
            <p><strong style="color:#aaa;">Altura</strong><br>${pk.alt(p) || '-'}</p>
            <p><strong style="color:#aaa;">Peso</strong><br>${pk.peso(p) || '-'}</p>
            <p><strong style="color:#aaa;">Captura</strong><br>${pk.cap(p) || '-'}</p>
            <p><strong style="color:#aaa;">Crecimiento</strong><br>${pk.crec(p) || '-'}</p>
            <p><strong style="color:#aaa;">Grupo Huevo</strong><br>${pk.eclo1(p) || '-'}${pk.eclo2(p) ? \` / ${pk.eclo2(p)}\` : ''}</p>
            <p style="grid-column:1/-1;"><strong style="color:#aaa;">Habilidades</strong><br>
              ${pk.h1(p) ? `<span style="color:#00c853;cursor:pointer;border-bottom:1px dashed rgba(0,200,83,0.4);transition:opacity 0.2s;" onclick="openHabilidad('${pk.h1(p).replace(/'/g,"\\'")}')">` + pk.h1(p) + `</span>` : '-'}
              ${pk.h2(p) ? ` / <span style="cursor:pointer;border-bottom:1px dashed rgba(255,255,255,0.3);transition:opacity 0.2s;" onclick="openHabilidad('${pk.h2(p).replace(/'/g,"\\'")}')">` + pk.h2(p) + `</span>` : ''}
              ${pk.hoculta(p) ? ` / <em style="color:#ff80ab;cursor:pointer;border-bottom:1px dashed rgba(255,128,171,0.4);transition:opacity 0.2s;" onclick="openHabilidad('${pk.hoculta(p).replace(/'/g,"\\'")}')">` + pk.hoculta(p) + ` (Oculta)</em>` : ''}
            </p>
            ${pk.obj1(p) ? `<p style="grid-column:1/-1;"><strong style="color:#aaa;">Objetos</strong><br>
              <span style="display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span style="display:inline-flex;align-items:center;gap:4px;">${renderItemSprite(pk.obj1(p), obj1)}</span>
                ${pk.obj2(p) ? `<span style="color:#555;">/</span><span style="display:inline-flex;align-items:center;gap:4px;">${renderItemSprite(pk.obj2(p), obj2)}</span>` : ''}
              </span>
            </p>` : ''}
          </div>
        </div>

        <!-- Estadísticas Base -->
        <div style="
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 20px;
        ">
          <h3 style="color:var(--green);margin-bottom:14px;font-size:1rem;border-bottom:1px solid rgba(0,200,83,0.15);padding-bottom:8px;">Estadísticas Base</h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${statsHtml}
          </div>
        </div>

      </div>
    </div>

    ${pk.area(p) ? `
    <!-- Área de encuentro -->
    <div style="
      margin-top: 22px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 18px;
      padding: 20px;
    ">
      <h3 style="color:var(--green);margin-bottom:14px;font-size:1rem;border-bottom:1px solid rgba(0,200,83,0.15);padding-bottom:8px;">Área de Encuentro</h3>
      <img src="${pk.area(p)}" alt="Área de encuentro" style="
        width: 100%;
        border-radius: 12px;
        image-rendering: pixelated;
        border: 1px solid rgba(255,255,255,0.06);
      ">
    </div>` : ''}

    </div><!-- end modal-inner -->
  `;

  modalBody.innerHTML = html;
  modal.style.display = 'block';
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
            " onclick="modal.style.display='none'; setTimeout(()=>{ const found = pokemonData.find(x=>x.Mayus==='${p.Mayus}'); if(found) showPokemonDetail(found); }, 200);"
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
  modal.style.display = 'block';
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
