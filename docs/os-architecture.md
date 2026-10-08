# Arquitectura del Smartphone OS (`src/lib/os`)

Mini sistema operativo web montado en el hero de `_hello`. Idioma UI: español
(con claves `os.*` en `svelte-i18n`: `en/es/fr`). Identificadores: inglés.

## Montaje (desviación del plan original)

El plan proponía un único `OsHost` con portal sobre `#os-anchor`. Con el
`{#key page.url.pathname}` de `src/routes/+layout.svelte` (que desmonta
`<main>` al navegar), se usa **montaje dividido** con singletons compartidos:

- `src/routes/+layout.svelte` (fuera del `{#key}`): `<OsAudioHost/>`
  (elemento `<audio>` persistente, nunca se desmonta) + `<MiniPlayer/>`.
- `src/routes/+page.svelte` (hero, lazy por `IntersectionObserver`):
  `<Phone/>` con `compact` en móvil (sin marco).

`audio` y `os` son singletons en módulos `.svelte.ts`; el teléfono puede
montarse/desmontarse libremente sin cortar el audio.

## Piezas

| Archivo | Rol |
|---|---|
| `audio/engine.svelte.ts` | `AudioEngine`: `<audio>` + `Analyser→Gain→destino`, playlist, volumen, Media Session, persistencia. `createMediaElementSource` una sola vez. |
| `audio/tracks.ts` | `Track[]`, `THEMES` (acento por tema), `tracksByTheme`. |
| `audio/visualizer.ts` | `drawSpectrum()` pura (testeable): barras, modo idle, `reducedMotion`. |
| `state/os.svelte.ts` | `OsState`: `unlocked`, `activeApp`, `miniplayerDismissed`, `appState[appId]`, `screenEffect` (siempre `null` en MVP), `reduceMotion`. |
| `state/persistence.ts` | `localStorage portfolio-os:v1` con versión y `try/catch`. |
| `apps/registry.ts` + `apps/types.ts` | Registro de apps. |
| `apps/music/*` | `MusicApp`, `Playlist`, `ThemeSelector`, `Spectrum` (canvas+rAF). |
| `components/Phone|LockScreen|HomeScreen|MiniPlayer|OsAudioHost` | UI. |

Pistas MVP: WAV procedurales CC0 en `static/audio/` + carátulas SVG en
`static/audio/covers/` (2 por tema; documentado como placeholder hasta
conseguir licencias externas reales). Ver `scripts/generate-os-audio.py`
(el script vive en `/tmp`, no en el repo).

Fondos `src/lib/assets/`: `creation-hands.webp` (La Creación de Miguel Ángel,
dominio público vía Wikimedia Commons) y `ada-lock.webp` (retrato de Ada
Lovelace adaptado al navy `#011627`), ambos en monocromo dithered Bayer.
El lock suma scanlines y un aura teñida con el acento del tema musical.

## Añadir una app nueva en 5 pasos

1. Crear `src/lib/os/apps/<nombre>/<Nombre>App.svelte`.
2. Registrarla en `src/lib/os/apps/registry.ts` con `enabled: true`
   y `component: () => import('./<nombre>/<Nombre>App.svelte')`.
3. Abrirla con `os.openApp('<id>')`; guardar su estado en
   `os.saveAppState('<id>', estado)` para restaurarlo al volver a `_hello`.
4. Para audio, usar el singleton `audio` (`audio.play()`, `next()`, …).
5. Para efectos de pantalla, usar `os.screenEffect` (`'matrix' | 'retro'`)
   con botón visible de restaurar; en MVP queda `null`.

Sin tocar `Phone.svelte`, `MiniPlayer.svelte` ni `AudioEngine`.
