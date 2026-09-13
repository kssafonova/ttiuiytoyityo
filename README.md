# LUMI configurator

Responsive rules-driven prototype for LUMI window and panoramic-system configuration.

## v6 product model

The configurator is built around four customer scenarios:

1. **Обычное окно** — 1 / 2 / 3 sections, mullion, shtulp, upper transom, per-sash opening presets and manual configuration.
2. **Панорамное окно** — fixed / multi-section glazing, PSK portal or ALUMARK S158 lift-slide portal.
3. **Балконный блок** — window + balcony door arrangements.
4. **Панорамная дверь** — swing aluminium, PVC PSK or ALUMARK S158 lift-slide exit.

The visible UX is reduced to three decision blocks:

1. **Тип конструкции + размеры** — the product scenario is selected first, so dimension labels and subsequent choices are relevant to that product.
2. **Схема / секции + открывание** — geometry is selected before opening mechanisms. Invalid opening types are never offered.
3. **Материал + стеклопакет + комфорт** — previous choices filter material, warm/cold mode, glazing and compatible REHAU / ALUMARK systems.

A persistent **«Ваше решение»** panel stays on the right with live preview and the automatically recommended compatible system. Below it the customer-facing extras are intentionally limited to **Подоконник** and **Москитная сетка**.

## Ordinary-window UX scenarios

The canonical A–H UX specification lives in `data/04_LUMI_window_ux_scenarios.csv`.

Key behavior:

- one sash never exposes a slide mechanism;
- two-section mullion windows use a few common presets plus optional per-section customization;
- shtulp windows distinguish active and passive sashes and constrain their openings independently;
- generic ordinary-window `SLIDE` is visible as an unavailable future branch until a real compatible profile system is confirmed — PSK is not substituted for it;
- three-section windows use popular presets plus manual per-section configuration;
- upper transom is a secondary construction option and does not break the base-window logic;
- a fully fixed construction triggers a serviceability warning and asks for installation context instead of silently accepting or universally blocking FIX;
- oversized-construction recommendations are architected for future producer/hardware limits, but no universal numeric limits are fabricated today.

## Rule architecture

`data/03_LUMI_scenario_rules.csv` is the canonical compatibility matrix for the four product scenarios. Runtime logic mirrors its structural rule fields.

- `data-v3.js` — customer-facing domain model, product scenarios, sections, systems and extras
- `scenario-rules-v2.js` — executable scenario matrix
- `core-v4.js` — state machine, compatibility engine, recommendations and semantic validation
- `ui-v6.js` — three-step adaptive UX and right-side result panel
- `styles-v6.css` — v6 scenario-first UI additions
- `data/00_LUMI_final_flow.csv` — current customer flow
- `data/02_LUMI_systems_matrix.csv` — REHAU / ALUMARK system matrix
- `data/03_LUMI_scenario_rules.csv` — canonical scenario rules
- `data/04_LUMI_window_ux_scenarios.csv` — ordinary-window A–H UX specification
- `tests/product-scenarios-v6.test.cjs` — regression tests for the product model and rule engine

## Engineering boundaries

Exact width/height limits, sash weight limits, statics, hardware constraints, shtulp hardware availability and final glass formulas remain an engineering validation step until manufacturer / processor production constraints are supplied. The configurator deliberately does not invent those values.

Known verified product semantics are kept separate from UX simplification: profile chambers are not IGU chambers, S50 is cold aluminium, and S158 is only a lift-slide portal system.

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Validation

```bash
npm test
npm run check
```

The test suite validates the four top-level product scenarios, ordinary-window A–H behavior, shtulp constraints, transom behavior, fully-fixed warnings, scenario-driven material/system filtering and the absence of fabricated size limits.
