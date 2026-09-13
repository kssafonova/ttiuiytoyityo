# LUMI configurator

Responsive rules-driven prototype for window, balcony, entrance and sliding-system configuration.

## v3 UX redesign

The customer flow is intentionally reduced from many technical screens to four decisions:

1. **Конструкция** — type, section layout and opening of each active section.
2. **Материал и стекло** — PVC/aluminium, warm/cold mode when relevant, IGU construction and optional comfort intent.
3. **Подходящее решение** — compatible REHAU / ALUMARK systems are ranked automatically; technical details are secondary.
4. **Комплектация** — only relevant extras are shown.

Dimensions stay visible next to the live preview instead of becoming a separate wizard step. Contextual help explains profile chambers vs IGU chambers, opening types, materials and comfort packages without forcing technical copy into the main flow.

### Design principles

- editorial, minimal UI instead of a legacy calculator aesthetic;
- one strong live preview and one active decision area;
- progressive disclosure: engineering details live in tooltips / expandable blocks;
- incompatible choices are hidden, not disabled in long lists;
- responsive card carousels and a fixed action bar on small screens;
- no fabricated engineering limits or fake price calculations.

## Architecture

- `data.js` — domain catalog, schemes and product capabilities
- `core-v2.js` — state machine and compatibility / recommendation engine
- `ui-v3.js` — four-step UX, adaptive rendering, help and live preview
- `styles-v3.css` — v3 visual system and responsive layout
- `assets/sprite.svg` — local SVG illustration library
- `tests/rules.test.cjs` — compatibility regression tests
- `docs/architecture.md` — architecture and rule decisions

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Tests

```bash
npm test
npm run check
```

## Engineering limitation

Exact width/height limits, statics, sash weight, hardware constraints and final glass formulas remain an engineering validation step until manufacturer / processor production constraints are supplied. The configurator deliberately does not invent these limits.
