# OKNOVA

React/Vite-прототип сайта OKNOVA: окна, HS/FS-порталы, панорамное остекление, проекты и калькулятор.

## Локальный запуск

```bash
npm install
npm run fonts
npm run dev
```

## Проверка и сборка

```bash
npm run typecheck
npm run build
```

Перед production-сборкой скрипт `scripts/download-fonts.mjs` скачивает Manrope v20 в `src/assets/fonts`, после чего Vite включает шрифты в собранный bundle. Основной Cyrillic Extended URL сохранён из исходного запроса; дополнительно скачиваются Cyrillic и Latin subsets для корректного русского интерфейса и латиницы.

## GitHub Pages

Workflow `.github/workflows/pages.yml` собирает проект и публикует каталог `dist` в GitHub Pages при каждом push в `main`.

Навигация страниц работает через hash-маршруты (`#/hs-portal`, `#/calculator` и т. п.), поэтому ссылки корректно открываются напрямую на GitHub Pages без серверных rewrite-правил.
