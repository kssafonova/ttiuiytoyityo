# LUMI configurator

Rules-driven responsive prototype for window, balcony, entrance and sliding-system configuration.

## What changed in v2

- compatibility is centralized in a domain rules engine instead of being scattered across UI handlers;
- material, mechanism, warm/cold mode and section roles are validated against system capabilities;
- PSK, lift-slide, entrance groups and balcony blocks have explicit business rules;
- profile chambers and insulating-glass-unit chambers are modeled separately;
- comfort is an optional customer intent, not a fake glass formula selector;
- system recommendation is scoring-based and no longer uses unsupported magic size thresholds;
- explicit user system choice is preserved while it remains compatible;
- relevant extras are derived from the actual configuration;
- live preview respects section proportions and transom / balcony-door layouts better;
- configuration draft is saved to `localStorage`;
- Node regression tests cover the main scenario branches.

## Run locally

Static files can be served by any HTTP server. For example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Tests

No dependencies are required:

```bash
npm test
npm run check
```

## Source structure

- `data.js` — product/domain catalog and capabilities
- `core-v2.js` — state machine + rules engine
- `ui-v2.js` — DOM rendering and interactions
- `styles.css` — base visual system
- `v2.css` — v2 additions
- `assets/sprite.svg` — local SVG asset library
- `tests/rules.test.cjs` — compatibility tests
- `docs/architecture.md` — architecture and rule decisions

## Important limitation

The application deliberately treats exact width/height limits, statics, sash weight, hardware and final glass formulas as engineering validation until manufacturer/processor production constraints are supplied. It does not fabricate those limits.
