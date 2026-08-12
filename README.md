# Pokémon Quetzal Database

Base de datos comunitaria para consultar información documentada de **Pokémon Quetzal**.

> Estado: proyecto en desarrollo. La información se incorpora conforme se extrae y verifica dentro del fangame; los campos sin datos confirmados se muestran como pendientes de documentar.

## Contenido actual

- Pokémon: tipos, estadísticas base, habilidades, objetos equipados y áreas de encuentro cuando están registradas.
- Objetos: descripción, precios y Pokémon que pueden portarlos.
- Habilidades: descripción y Pokémon que las poseen.
- Buscador y filtros de Pokédex por región, tipo y orden.
- Historial de cambios y créditos dentro del sitio.

## Estructura

```text
├── index.html        # Estructura del sitio
├── style.css         # Diseño y vista adaptable
├── script.js         # Interfaz, búsqueda, filtros y fichas
├── Pokemon.json      # Datos de Pokémon
├── Objetos.json      # Datos de objetos
├── Habilidades.json  # Datos de habilidades
└── Icono.png         # Icono del sitio
```

## Actualizar la base

1. Extrae y verifica la información dentro del juego.
2. Añádela al JSON correspondiente manteniendo los nombres de campos existentes.
3. Comprueba que el sitio carga correctamente desde un servidor local.
4. Registra los cambios relevantes en el changelog de `script.js`.

No se deben completar campos con suposiciones: la prioridad de la base es mantener datos confiables.

## Créditos

- Juego: TenmaRH, creador de Pokémon Quetzal.
- Base de datos: Fénix Academy Team.

Los créditos y el historial completo se encuentran en la sección **Créditos** del sitio.
