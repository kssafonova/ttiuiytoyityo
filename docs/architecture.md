# LUMI Configurator — architecture v2

## Domain flow

1. Type of construction
2. Scheme / sections
3. Opening per section
4. Material (+ warm/cold aluminum when applicable)
5. Glass / insulating glass unit
6. Comfort preset (optional)
7. Compatible profile systems (derived result, not a new technical question)
8. Equipment and services

Dimensions are persistent context and are not used as unsupported hard manufacturer limits. Final dimensions, sash weight, statics and exact glass formula remain engineering checks.

## Layers

- `data.js` — immutable domain catalog: construction types, schemes, roles, openings, materials, glazing, comfort intents, systems and capabilities.
- `core-v2.js` — deterministic rules engine. UI never decides compatibility itself. All state changes go through `dispatch()` and `normalizeState()`.
- `ui-v2.js` — rendering and interaction only. Uses event delegation, persists a draft configuration to `localStorage`, and renders a live SVG preview.
- `styles.css` + `v2.css` — visual layer.
- `tests/rules.test.cjs` — regression tests for critical compatibility branches.

## Important modeling decisions

### Profile chambers vs IGU chambers
They are separate concepts. Profile chamber count belongs to the profile system. IGU chamber count belongs to glass filling.

### Comfort is intent, not a physical glass formula
The customer chooses an intent such as `Тише` or `Комфорт круглый год`. Internally each preset maps to semantic properties (`thermal`, `acoustic`, `solar`, `safety`, `clarity`). The exact glass formula is not guessed in the front end.

### Product matching is capability-based
A profile system is compatible only if all of these match:
- material;
- warm/cold mode;
- construction type;
- mechanism (`standard`, `psk`, `lift_slide`, `swing_door`);
- required section roles.

No system is selected by a magic width threshold. Size restrictions must come from manufacturer/processor engineering data before they can become blocking rules.

### Manual product override
The engine recommends a system automatically. If the user explicitly selects another compatible system, that choice is preserved. It is reset only when a later configuration change makes it incompatible.

## Current hard business rules

- PSK => PVC / REHAU-compatible systems only.
- Lift-slide => aluminum + ALUMARK S158 only.
- Standard external entrance group => warm aluminum S60/S70 in the current assortment.
- Cold aluminum => ALUMARK S50.
- Balcony block is treated as warm separation from the heated room.
- Ordinary mosquito net is hidden for portal scenarios.
- Sill is hidden for entrance groups and portals.

## Engineering boundaries

The prototype intentionally does **not** invent:
- maximum width/height per sash;
- allowable aspect ratios;
- wind-load limits;
- hardware weight limits except the published S158 400 kg note;
- exact glass formulas and their final thickness;
- production price formulas.

Those data should be added as a separate manufacturer/processor rules table when available.
