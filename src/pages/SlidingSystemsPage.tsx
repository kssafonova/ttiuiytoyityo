import { useState } from "react";
import type { Page } from "../App";

interface Props { onNavigate: (p: Page) => void; }

const systems = [
  {
    id: "hs-portal" as Page,
    name: "HS-портал",
    badge: "Рекомендуем",
    sub: "Максимальная панорама и лёгкое управление",
    img: "./assets/hs_portal_preview.svg",
    features: ["Для больших проёмов", "Лёгкое скольжение", "Премиальная теплоизоляция"],
    width: "до 6 м", height: "до 3 м", weight: "до 400 кг",
  },
  {
    id: "fs-portal" as Page,
    name: "FS-портал",
    badge: null,
    sub: "Гармония дизайна и функциональности",
    img: "./assets/panoramic_window_preview.svg",
    features: ["Узкие профили", "Больше света", "Идеален для современных домов"],
    width: "до 5 м", height: "до 2.8 м", weight: "до 300 кг",
  },
  {
    id: null,
    name: "PSK-портал",
    badge: null,
    sub: "Практичное решение для комфортной вентиляции",
    img: "./assets/balcony_block_preview.svg",
    features: ["Откидное открывание", "Экономия пространства", "Надёжная фурнитура"],
    width: "до 4 м", height: "до 2.5 м", weight: "до 200 кг",
  },
];

const compareRows = [
  { param: "Тип открывания",       hs: "Подъёмно-раздвижное", fs: "Поворотно-сдвижное" },
  { param: "Максимальная ширина",  hs: "6 000 мм",            fs: "5 000 мм" },
  { param: "Максимальная высота",  hs: "3 000 мм",            fs: "2 800 мм" },
  { param: "Вес створки",          hs: "до 400 кг",           fs: "до 300 кг" },
  { param: "Теплоизоляция",        hs: "Uf = 1,5 Вт/м²К",    fs: "Uf = 1,7 Вт/м²К" },
  { param: "Стеклопакет",          hs: "до 52 мм",            fs: "до 48 мм" },
  { param: "Тёплый порог",         hs: "от 15 мм",            fs: "от 20 мм" },
  { param: "Монтаж от",            hs: "18 000 ₽/м²",        fs: "16 000 ₽/м²" },
];

const steps = [
  { n: 1, title: "Проёмы",       desc: "Фиксируем размеры и особенности дома" },
  { n: 2, title: "Системы",      desc: "Подбираем оптимальные решения" },
  { n: 3, title: "Комплектация", desc: "Стеклопакеты, фурнитура, цвета, автоматика" },
  { n: 4, title: "Смета",        desc: "Прозрачный расчёт и сроки реализации" },
];

export default function SlidingSystemsPage({ onNavigate }: Props) {
  const [showCompare, setShowCompare] = useState(false);
  const [hoverIdx, setHoverIdx]       = useState<number | null>(null);

  return (
    <>
      {/* ── SYSTEMS GRID (matches reference) ─────────── */}
      <section className="section-pad bg-white" style={{ paddingTop: "clamp(80px,10vw,140px)" }}>
        <div className="container">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
            <div>
              <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-4">Раздвижные системы</p>
              <h1 className="f-mont text-[var(--dark)] leading-[1.05]" style={{ fontSize: "clamp(30px,4vw,56px)" }}>
                Выберите свой формат<br />открытости
              </h1>
            </div>
            <div className="flex flex-col md:items-end gap-4 md:max-w-[380px]">
              <p className="f-pop text-[var(--muted)] text-[14px] leading-[1.7]">
                Три решения. Одна философия — надёжные немецкие профильные системы,
                безупречная геометрия и комфорт на долгие годы.
              </p>
              <button
                onClick={() => setShowCompare(!showCompare)}
                className="btn-outline self-start text-[14px]"
              >
                {showCompare ? "Скрыть сравнение" : "Сравнить системы"}
              </button>
            </div>
          </div>

          {/* 3-column product cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[var(--border)]">
            {systems.map((s, i) => (
              <div
                key={s.name}
                className="flex flex-col border-r border-[var(--border)] last:border-r-0 transition-colors cursor-pointer"
                style={{ background: hoverIdx === i ? "var(--light)" : "white" }}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                onClick={() => s.id && onNavigate(s.id)}
              >
                {/* Card header */}
                <div className="p-6 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="f-pops text-[var(--dark)] text-[18px]">{s.name}</span>
                    {s.badge && (
                      <span
                        className="f-popm text-[11px] text-white px-2.5 py-0.5"
                        style={{ background: "var(--accent)" }}
                      >
                        {s.badge}
                      </span>
                    )}
                  </div>
                  <p className="f-pop text-[var(--muted)] text-[13px] leading-[1.5]">{s.sub}</p>
                </div>

                {/* Product image */}
                <div className="flex items-center justify-center p-6 bg-[var(--light)]" style={{ minHeight: 220 }}>
                  <img
                    src={s.img}
                    alt={s.name}
                    className="max-h-[200px] w-auto object-contain transition-transform duration-300"
                    style={{ transform: hoverIdx === i ? "scale(1.04)" : "scale(1)" }}
                  />
                </div>

                {/* Specs row */}
                <div className="flex divide-x divide-[var(--border)] border-b border-[var(--border)]">
                  {[["ширина", s.width], ["высота", s.height], ["вес", s.weight]].map(([l, v]) => (
                    <div key={l} className="flex-1 px-3 py-2.5 text-center">
                      <p className="f-popm text-[var(--dark)] text-[12px]">{v}</p>
                      <p className="f-pop text-[var(--muted)] text-[10px]">{l}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="p-6 flex-1">
                  <ul className="flex flex-col gap-2 mb-5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="text-[var(--accent)] text-[12px] mt-0.5 shrink-0">✓</span>
                        <span className="f-pop text-[var(--dark)] text-[13px]">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {s.id ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); onNavigate(s.id!); }}
                      className="f-popm text-[var(--accent)] text-[13px] flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Подробнее <span>→</span>
                    </button>
                  ) : (
                    <span className="f-pop text-[var(--muted)] text-[13px]">Скоро →</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────── */}
      {showCompare && (
        <section className="section-pad" style={{ background: "var(--light)" }}>
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="f-mont text-[var(--dark)]" style={{ fontSize: "clamp(20px,2.5vw,32px)" }}>
                HS-портал vs FS-портал
              </h2>
              <div className="flex gap-4">
                <span className="f-popm text-[var(--dark)] text-[13px] border-l-2 border-[var(--accent)] pl-3">HS-портал</span>
                <span className="f-popm text-[var(--muted)] text-[13px] border-l-2 border-[var(--border)] pl-3">FS-портал</span>
              </div>
            </div>
            <div className="border border-[var(--border)] overflow-hidden">
              {compareRows.map((row, i) => (
                <div
                  key={row.param}
                  className="grid grid-cols-3 border-b border-[var(--border)] last:border-b-0"
                  style={{ background: i % 2 === 0 ? "white" : "var(--light)" }}
                >
                  <div className="p-4 border-r border-[var(--border)]">
                    <span className="f-popm text-[var(--dark)] text-[13px]">{row.param}</span>
                  </div>
                  <div className="p-4 border-r border-[var(--border)] bg-[var(--accent)]/5">
                    <span className="f-popm text-[var(--dark)] text-[13px]">{row.hs}</span>
                  </div>
                  <div className="p-4">
                    <span className="f-pop text-[var(--muted)] text-[13px]">{row.fs}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => onNavigate("hs-portal")} className="btn-primary accent-btn">Подробнее о HS →</button>
              <button onClick={() => onNavigate("fs-portal")} className="btn-outline">Подробнее о FS →</button>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section className="section-pad bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Left: text */}
            <div>
              <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-4">Как это работает</p>
              <h2 className="f-mont text-[var(--dark)] leading-[1.05] mb-6" style={{ fontSize: "clamp(26px,3.5vw,48px)" }}>
                Ваш дом —<br />один проект
              </h2>
              <p className="f-pop text-[var(--muted)] text-[15px] leading-[1.7] mb-8">
                Поможем подобрать оптимальное решение,
                рассчитать стоимость и реализовать проект
                от идеи до монтажа.
              </p>
              <button onClick={() => onNavigate("calculator")} className="btn-primary">
                Начать с проекта →
              </button>
            </div>

            {/* Right: steps + house photo */}
            <div className="relative">
              {/* Steps row */}
              <div className="flex items-start gap-0 mb-8 border border-[var(--border)]">
                {steps.map((s, i) => (
                  <div key={s.n} className="flex-1 border-r border-[var(--border)] last:border-r-0 p-4">
                    <div
                      className="circle size-8 flex items-center justify-center f-popm text-[13px] mb-3"
                      style={{
                        background: i === 0 ? "var(--accent)" : "transparent",
                        border: i === 0 ? "none" : "1px solid var(--border)",
                        color: i === 0 ? "white" : "var(--muted)",
                      }}
                    >
                      {s.n}
                    </div>
                    <p className="f-pops text-[var(--dark)] text-[13px] mb-1">{s.title}</p>
                    <p className="f-pop text-[var(--muted)] text-[11px] leading-[1.5]">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* House photo */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&h=506&fit=crop&auto=format"
                  alt="Современный дом"
                  className="w-full h-full object-cover"
                />
                {/* Annotation callout */}
                <div className="absolute bottom-5 right-5 bg-white/90" style={{ padding: "10px 16px" }}>
                  <p className="f-pop text-[var(--dark)] text-[12px] text-center" style={{ fontStyle: "italic" }}>
                    Продуманное остекление —<br />гармоничный дом
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="section-pad bg-[var(--dark)]">
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="f-mont text-white leading-[1.1] mb-2" style={{ fontSize: "clamp(22px,3vw,40px)" }}>
              Не знаете, какая система подойдёт?
            </h2>
            <p className="f-pop text-white/50 text-[15px]">Инженер бесплатно разберёт вашу задачу — звоните или рассчитывайте онлайн.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="tel:88005551234" className="btn-outline !text-white !border-white/30 hover:!bg-white/10">Позвонить</a>
            <button onClick={() => onNavigate("calculator")} className="btn-primary accent-btn">Рассчитать онлайн</button>
          </div>
        </div>
      </section>
    </>
  );
}
