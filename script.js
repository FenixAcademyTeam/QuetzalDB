let pokemonData = [];
let objetosData = [];
let habilidadesData = [];
let currentTab = 'pokemon';

// Datos de Créditos y Changelog (Fácil de editar aquí mismo)
const infoExtra = {
  creditos: [
    { rol: "Creador de Pokémon Quetzal", nombre: "TenmaRH", link: "https://pastebin.com/ncvkGPQJ" },
    { rol: "Equipo de la Database", nombre: "Chayansito", link: "#" },
    { rol: "Equipo de la Database", nombre: "Nelly & Danny", link: "#" }
  ],
  changelog: [
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
  "Volador": "#81D4FA", "Psiquico": "#E91E63", "Bicho": "#8BC34A", "Roca": "#795548",
  "Fantasma": "#673AB7", "Dragon": "#3F51B5", "Siniestro": "#212121", "Acero": "#607D8B",
  "Hada": "#FF80AB", "Normal": "#9E9E9E"
};

async function loadData() {
  try {
    const [pokemonRes, objetosRes, habilidadesRes] = await Promise.all([
      fetch('pokemon.json'),
      fetch('Objetos.json'),
      fetch('Habilidades.json')
    ]);
    
    const pokemonJson = await pokemonRes.json();
    const objetosJson = await objetosRes.json();
    const habilidadesJson = await habilidadesRes.json();
    
    pokemonData = pokemonJson.slice(1);
    objetosData = objetosJson.slice(1);
    habilidadesData = habilidadesJson.slice(1);

    // Actualizar contadores del hero
    document.getElementById('statPokemon').textContent = pokemonData.length;
    document.getElementById('statObjetos').textContent = objetosData.length;
    document.getElementById('statHabilidades').textContent = habilidadesData.length;

    renderResults(pokemonData);
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

loadData();

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;
    searchInput.value = '';
    
    // Ocultar barra de búsqueda si estamos en Créditos
    if (currentTab === 'creditos') {
      searchInput.style.display = 'none';
    } else {
      searchInput.style.display = 'block';
    }
    
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
  if (currentTab === 'pokemon') renderResults(pokemonData);
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
    const filtered = habilidadesData.filter(h => Object.values(h).join(' ').toLowerCase().includes(term));
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
    card.className = 'card';
    const type1 = p.field6 || '';
    const type2 = p.field8 || '';
    card.innerHTML = `
      <img src="${p.field5}" alt="${p.field2}">
      <h3>#${p.field4} ${p.field2}</h3>
      <div class="types">
        <span class="type" style="background:${typeColors[type1]||'#666'}">
          <img src="${p.field7}" alt="${type1}">
        </span>
        ${type2 ? `<span class="type" style="background:${typeColors[type2]||'#666'}">
          <img src="${p.field9}" alt="${type2}">
        </span>` : ''}
      </div>
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
      <img src="${o.field5}" alt="${o.field3}" style="width:110px;height:110px;">
      <h3>#${o.field2} ${o.field3}</h3>
      <p style="font-size:0.9em; margin:8px 0 4px 0; color:#ccc;">${o.field6 ? o.field6.substring(0, 80) + '...' : ''}</p>
      <p style="font-size:0.85em;color:#aaa;">
        <strong>Compra:</strong> ${o.field8} | <strong>Venta:</strong> ${o.field7}
      </p>
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
      <div style="
        width: 56px; height: 56px; border-radius: 50%;
        background: linear-gradient(135deg, rgba(0,200,83,0.25), rgba(100,221,23,0.1));
        border: 2px solid rgba(0,200,83,0.4);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 12px; font-size: 1.5rem;
      ">🧬</div>
      <h3 style="font-size:1rem;">${h.field2}</h3>
      <p style="font-size:0.85em;color:#aaa;margin-top:8px;line-height:1.4;">${h.field3 || '-'}</p>
    `;
    card.addEventListener('click', () => showHabilidadDetail(h));
    resultsDiv.appendChild(card);
  });
}

function showHabilidadDetail(h) {
  // Pokémon que poseen esta habilidad (normal, secundaria u oculta)
  const nombreH = h.field2.toLowerCase();
  const poseedores = pokemonData.filter(p => 
    (p.field24 && p.field24.toLowerCase() === nombreH) ||
    (p.field25 && p.field25.toLowerCase() === nombreH) ||
    (p.field26 && p.field26.toLowerCase() === nombreH)
  );

  const getPokemonRole = (p) => {
    if (p.field26 && p.field26.toLowerCase() === nombreH) return 'oculta';
    if (p.field25 && p.field25.toLowerCase() === nombreH) return 'secundaria';
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
            " onclick="modal.style.display='none'; setTimeout(()=>{ const pk = pokemonData.find(x=>x.field3==='${p.field3}'); if(pk) showPokemonDetail(pk); }, 200);"
              onmouseover="this.style.borderColor='rgba(0,200,83,0.4)'; this.style.transform='translateY(-3px)'"
              onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.transform='translateY(0)'">
              <img src="${p.field5}" alt="${p.field2}" style="width:54px;height:54px;image-rendering:pixelated;">
              <p style="font-size:0.75em;color:#ddd;margin-top:6px;font-weight:500;">${p.field2}</p>
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
      <h2 style="font-size:1.7rem;font-weight:700;color:#fff;">${h.field2}</h2>
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
        <p style="color:#e8ecf7;font-size:1rem;line-height:1.7;">${h.field3 || 'Sin descripción.'}</p>
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
    {name: "PS", value: p.field10, color: "#FF5959"},
    {name: "Ataque", value: p.field11, color: "#F5AC78"},
    {name: "Defensa", value: p.field12, color: "#FAE078"},
    {name: "At. Especial", value: p.field13, color: "#9DB7F5"},
    {name: "Def. Especial", value: p.field14, color: "#A7DB8D"},
    {name: "Velocidad", value: p.field15, color: "#FA92B2"}
  ];

  // Color del tipo principal para el banner
  const bannerColor = typeColors[p.field6] || '#00c853';

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
  const obj1 = p.field22 ? objetosData.find(o => o.field3 && o.field3.toLowerCase() === p.field22.toLowerCase()) : null;
  const obj2 = p.field23 ? objetosData.find(o => o.field3 && o.field3.toLowerCase() === p.field23.toLowerCase()) : null;

  const renderItemSprite = (nombre, objData) => {
    if (!nombre) return '';
    const safe = nombre.replace(/'/g, "\\'");
    const spriteHtml = objData ? `<img src="${objData.field5}" alt="${nombre}" style="width:24px;height:24px;image-rendering:pixelated;vertical-align:middle;margin-right:4px;">` : '';
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
      <img src="${p.field16}" alt="${p.field2}" style="width:38px;height:38px;image-rendering:pixelated;flex-shrink:0;">
      <div style="flex-shrink:0;">
        <span style="font-size:0.75em;color:${bannerColor};font-weight:600;letter-spacing:2px;text-transform:uppercase;display:block;">#${p.field4}</span>
        <h2 style="font-size:1.6rem;font-weight:700;line-height:1.1;color:#fff;white-space:nowrap;">${p.field2}</h2>
      </div>
      <div style="margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
        <span class="type" style="background:${typeColors[p.field6]||'#666'}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size:0.85em; white-space:nowrap;">
          <img src="${p.field7}" width="15" height="15" style="vertical-align:middle;"> ${p.field6}
        </span>
        ${p.field8 ? `<span class="type" style="background:${typeColors[p.field8]||'#666'}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size:0.85em; white-space:nowrap;">
          <img src="${p.field9}" width="15" height="15" style="vertical-align:middle;"> ${p.field8}
        </span>` : ''}
      </div>
    </div>

    <!-- CUERPO -->
    <div class="modal-inner">

    <!-- CUERPO PRINCIPAL: izquierda sprite | derecha info -->
    <div style="display:grid; grid-template-columns: 200px 1fr; gap: 24px; margin-top: 8px;">

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
          <img src="${p.field5}" alt="${p.field2}" style="width:150px;height:150px;image-rendering:pixelated;">
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
            <p><strong style="color:#aaa;">Categoría</strong><br>${p.field17 || '-'}</p>
            <p><strong style="color:#aaa;">Altura</strong><br>${p.field18 || '-'}</p>
            <p><strong style="color:#aaa;">Peso</strong><br>${p.field19 || '-'}</p>
            <p><strong style="color:#aaa;">Captura</strong><br>${p.field20 || '-'}</p>
            <p><strong style="color:#aaa;">Crecimiento</strong><br>${p.field21 || '-'}</p>
            <p><strong style="color:#aaa;">Grupo Huevo</strong><br>${p.field27 || '-'}${p.field28 ? ` / ${p.field28}` : ''}</p>
            <p style="grid-column:1/-1;"><strong style="color:#aaa;">Habilidades</strong><br>
              ${p.field24 ? `<span style="color:#00c853;cursor:pointer;border-bottom:1px dashed rgba(0,200,83,0.4);transition:opacity 0.2s;" onclick="openHabilidad('${p.field24.replace(/'/g,"\\'")}')">` + p.field24 + `</span>` : '-'}
              ${p.field25 ? ` / <span style="cursor:pointer;border-bottom:1px dashed rgba(255,255,255,0.3);transition:opacity 0.2s;" onclick="openHabilidad('${p.field25.replace(/'/g,"\\'")}')">` + p.field25 + `</span>` : ''}
              ${p.field26 ? ` / <em style="color:#ff80ab;cursor:pointer;border-bottom:1px dashed rgba(255,128,171,0.4);transition:opacity 0.2s;" onclick="openHabilidad('${p.field26.replace(/'/g,"\\'")}')">` + p.field26 + ` (Oculta)</em>` : ''}
            </p>
            ${p.field22 ? `<p style="grid-column:1/-1;"><strong style="color:#aaa;">Objetos</strong><br>
              <span style="display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span style="display:inline-flex;align-items:center;gap:4px;">${renderItemSprite(p.field22, obj1)}</span>
                ${p.field23 ? `<span style="color:#555;">/</span><span style="display:inline-flex;align-items:center;gap:4px;">${renderItemSprite(p.field23, obj2)}</span>` : ''}
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
    </div><!-- end modal-inner -->
  `;

  modalBody.innerHTML = html;
  modal.style.display = 'block';
}

function showObjectDetail(o) {
  // Pokémon que portan este objeto (campo 1 o campo 2)
  const nombreO = o.field3.toLowerCase();
  const portadores = pokemonData.filter(p =>
    (p.field22 && p.field22.toLowerCase() === nombreO) ||
    (p.field23 && p.field23.toLowerCase() === nombreO)
  );

  const getSlotLabel = (p) => {
    if (p.field23 && p.field23.toLowerCase() === nombreO) return { txt: 'Raro', color: '#FFD700' };
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
            " onclick="modal.style.display='none'; setTimeout(()=>{ const pk = pokemonData.find(x=>x.field3==='${p.field3}'); if(pk) showPokemonDetail(pk); }, 200);"
              onmouseover="this.style.borderColor='rgba(0,200,83,0.4)'; this.style.transform='translateY(-3px)'"
              onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.transform='translateY(0)'">
              <img src="${p.field5}" alt="${p.field2}" style="width:54px;height:54px;image-rendering:pixelated;">
              <p style="font-size:0.75em;color:#ddd;margin-top:6px;font-weight:500;">${p.field2}</p>
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
      <img src="${o.field5}" alt="${o.field3}" style="width:44px;height:44px;image-rendering:pixelated;flex-shrink:0;">
      <div>
        <span style="font-size:0.75em;color:#00c853;font-weight:600;letter-spacing:2px;text-transform:uppercase;display:block;">#${o.field2}</span>
        <h2 style="font-size:1.6rem;font-weight:700;line-height:1.1;color:#fff;">${o.field3}</h2>
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
          <img src="${o.field5}" alt="${o.field3}" style="width:120px;height:120px;image-rendering:pixelated;">
        </div>
        <div style="
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 18px;
        ">
          <h3 style="color:var(--green);margin-bottom:12px;font-size:0.95rem;border-bottom:1px solid rgba(0,200,83,0.15);padding-bottom:6px;">Precios</h3>
          <p style="font-size:0.95em;color:#e8ecf7;margin-bottom:8px;"><strong style="color:#aaa;">Compra:</strong> ${o.field8 || '-'}</p>
          <p style="font-size:0.95em;color:#e8ecf7;"><strong style="color:#aaa;">Venta:</strong> ${o.field7 || '-'}</p>
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
        <p style="color:#e8ecf7;line-height:1.7;font-size:0.92em;">${o.field6 || 'Sin descripción'}</p>
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
  const h = habilidadesData.find(x => x.field2.toLowerCase() === nombre.toLowerCase());
  if (h) showHabilidadDetail(h);
}

// Función global para abrir objeto desde el modal de Pokémon
function openObjeto(nombre) {
  const o = objetosData.find(x => x.field3 && x.field3.toLowerCase() === nombre.toLowerCase());
  if (o) showObjectDetail(o);
}
