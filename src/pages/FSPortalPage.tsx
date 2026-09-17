import { useState } from "react";

const faqs = [
  { q: "В чём отличие FS от HS?", a: "FS (Feststellschiebe) — поворотно-сдвижная система. Створка сначала поворачивается вокруг вертикальной оси, освобождая уплотнения, затем скользит. HS поднимает створку. FS имеет более узкий профиль и меньшую максимальную нагрузку." },
  { q: "Подходит ли FS для круглогодичного использования?", a: "Да. Тройной EPDM-контур и тёплый монтажный узел обеспечивают R ≥ 0.75 м²·К/Вт. Для особо холодных регионов рекомендуем HS с тройным стеклопакетом." },
  { q: "Сколько стоит FS-портал?", a: "Базовый комплект от 180 000 ₽ за погонный метр ширины. Точная стоимость — после замера и согласования комплектации. Рассчитайте ориентировочно в нашем калькуляторе." },
  { q: "Можно ли совместить FS с автоматикой?", a: "Да, интегрируем приводы Siegenia, Geze и аналоги. Управление через смартфон или умный дом. Стоимость автоматизации — от 85 000 ₽ на секцию." },
];

export default function FSPortalPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [width,  setWidth]  = useState(3500);
  const [height, setHeight] = useState(2500);

  const area     = (width / 1000) * (height / 1000);
  const priceMin = Math.round(area * 160_000 / 10000) * 10000;
  const priceMax = Math.round(area * 200_000 / 10000) * 10000;
  const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white" style={{ minHeight: "100svh" }}>
        <div className="relative grid grid-cols-1 lg:grid-cols-[44fr_56fr]" style={{ minHeight: "100svh" }}>
          <div className="relative z-10 flex flex-col justify-center pt-28 lg:pt-0 pb-10 px-[clamp(20px,5vw,120px)]">
            <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5 anim-up">
              FS-Порталы · Поворотно-сдвижные системы
            </p>
            <h1
              className="f-mont text-[var(--dark)] leading-[1.05] mb-6 anim-up"
              style={{ fontSize: "clamp(32px,4.8vw,64px)", animationDelay: ".1s" }}
            >
              Больше света.<br />Меньше конструкции.
            </h1>
            <p className="f-pop text-[var(--muted)] leading-[1.7] mb-8 anim-up" style={{ fontSize: "clamp(14px,1.4vw,16px)", maxWidth: 420, animationDelay: ".2s" }}>
              FS-портал открывается в два движения: сначала поворот, затем сдвиг.
              Ультратонкий профиль — до 62 мм — даёт максимум стекла и минимум рамы.
            </p>
            <div className="flex flex-wrap gap-3 anim-up" style={{ animationDelay: ".3s" }}>
              <button
                onClick={() => document.getElementById("fs-calc")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary accent-btn"
              >
                Рассчитать стоимость
              </button>
              <button
                onClick={() => document.getElementById("fs-compare")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-outline"
              >
                Сравнить с HS →
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-8 anim-up" style={{ animationDelay: ".4s" }}>
              {["Узкий профиль 62 мм", "До 5 м шириной", "Тройной стеклопакет", "Москва и МО"].map((t) => (
                <span key={t} className="f-pop text-[11px] text-[var(--muted)] border border-[var(--border)] px-3 py-1.5">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="relative min-h-[50vw] lg:min-h-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=900&fit=crop&auto=format"
              alt="FS-портал"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(255,255,255,.2) 0%, transparent 25%)" }} />
            <div
              className="absolute top-10 right-8 hidden lg:block bg-white/90 p-4"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <p className="f-pop text-[11px] text-[var(--muted)] mb-2 uppercase tracking-widest">Характеристики</p>
              <div className="flex flex-col gap-1">
                {[["Профиль", "62 мм"], ["Стеклопакет", "до 48 мм"], ["Класс тепла", "Uf 1.7"]].map(([l, v]) => (
                  <div key={l} className="flex justify-between gap-6">
                    <span className="f-pop text-[var(--muted)] text-[12px]">{l}</span>
                    <span className="f-popm text-[var(--dark)] text-[12px]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Преимущества</p>
              <h2 className="f-mont text-[var(--dark)] leading-[1.1] mb-8" style={{ fontSize: "clamp(22px,3vw,40px)" }}>
                Почему выбирают FS-портал
              </h2>
              <div className="flex flex-col gap-4">
                {[
                  { n: "01", t: "Ультратонкий профиль",        d: "Видимая ширина рамы от 62 мм — почти вдвое меньше стандартных систем. Максимум остекления." },
                  { n: "02", t: "Поворот без подъёма",           d: "Механизм не требует подъёма тяжёлой створки. Мягкое открывание для систем до 300 кг." },
                  { n: "03", t: "Современная эстетика",          d: "Скрытые уплотнения, минимальный профиль, большой выбор цветов RAL и ANODA." },
                  { n: "04", t: "Совместимость с автоматикой",   d: "Интегрируется с системами умного дома, приводами и датчиками погоды." },
                ].map((b) => (
                  <div key={b.n} className="flex gap-4 p-4 border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors bg-white">
                    <span className="f-popm text-[var(--accent)] text-[11px] shrink-0 mt-0.5 uppercase tracking-widest">{b.n}</span>
                    <div>
                      <p className="f-pops text-[var(--dark)] text-[14px] mb-1">{b.t}</p>
                      <p className="f-pop text-[var(--muted)] text-[13px] leading-[1.5]">{b.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative bg-[var(--card)]" style={{ aspectRatio: "4/5" }}>
              <img
                src="./assets/panoramic_window_preview.svg"
                alt="FS-портал"
                className="absolute inset-0 w-full h-full object-contain p-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARE HS vs FS ──────────────────────────── */}
      <section id="fs-compare" className="section-pad bg-white">
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Сравнение</p>
          <h2 className="f-mont text-[var(--dark)] mb-8" style={{ fontSize: "clamp(22px,2.8vw,38px)" }}>FS vs HS — какой выбрать?</h2>
          <div className="border border-[var(--border)]">
            {[
              { param: "Механизм открывания", fs: "Поворот + сдвиг", hs: "Подъём + сдвиг" },
              { param: "Ширина профиля",       fs: "от 62 мм",       hs: "от 80 мм" },
              { param: "Макс. ширина проёма",  fs: "5 000 мм",       hs: "6 000 мм" },
              { param: "Макс. вес створки",    fs: "300 кг",         hs: "400 кг" },
              { param: "Тепловой барьер",      fs: "Uf 1.7",         hs: "Uf 1.5" },
              { param: "Цена от",              fs: "160 000 ₽/пм",  hs: "180 000 ₽/пм" },
            ].map((row, i) => (
              <div
                key={row.param}
                className="grid grid-cols-3 border-b border-[var(--border)] last:border-b-0"
                style={{ background: i % 2 === 0 ? "white" : "var(--light)" }}
              >
                <div className="p-4 border-r border-[var(--border)]">
                  <span className="f-popm text-[var(--dark)] text-[13px]">{row.param}</span>
                </div>
                <div className="p-4 border-r border-[var(--border)]" style={{ background: "var(--accent)/5" }}>
                  <span className="f-popm text-[var(--accent)] text-[13px]">{row.fs}</span>
                  <span className="f-pop text-[10px] text-[var(--muted)] ml-1">FS</span>
                </div>
                <div className="p-4">
                  <span className="f-pop text-[var(--dark)] text-[13px]">{row.hs}</span>
                  <span className="f-pop text-[10px] text-[var(--muted)] ml-1">HS</span>
                </div>
              </div>
            ))}
          </div>
          <p className="f-pop text-[var(--muted)] text-[13px] mt-4">
            Выбор зависит от размера проёма, требований к теплоизоляции и бюджета. Инженер поможет определиться бесплатно.
          </p>
        </div>
      </section>

      {/* ── MINI CALCULATOR ───────────────────────────── */}
      <section id="fs-calc" className="section-pad bg-[var(--dark)]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="f-popm text-white/40 text-[11px] uppercase tracking-[0.28em] mb-5">Калькулятор</p>
              <h2 className="f-mont text-white mb-4" style={{ fontSize: "clamp(24px,3vw,40px)" }}>
                Ориентировочная стоимость FS
              </h2>
              <p className="f-pop text-white/50 text-[14px] leading-[1.6]">
                Точная цена — после инженерного замера. Используйте расчёт как отправную точку.
              </p>
            </div>
            <div className="bg-white p-7">
              <div className="mb-5">
                <div className="flex justify-between mb-2">
                  <span className="f-popm text-[var(--dark)] text-[14px]">Ширина</span>
                  <span className="f-montm text-[var(--accent)] text-[16px]">{(width/1000).toFixed(1)} м</span>
                </div>
                <input type="range" min={1500} max={5000} step={100} value={width} onChange={(e) => setWidth(+e.target.value)}
                  className="w-full h-1 cursor-pointer" style={{ accentColor: "var(--accent)" }} />
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="f-popm text-[var(--dark)] text-[14px]">Высота</span>
                  <span className="f-montm text-[var(--accent)] text-[16px]">{(height/1000).toFixed(1)} м</span>
                </div>
                <input type="range" min={1800} max={2800} step={100} value={height} onChange={(e) => setHeight(+e.target.value)}
                  className="w-full h-1 cursor-pointer" style={{ accentColor: "var(--accent)" }} />
              </div>
              <div className="bg-[var(--light)] p-5 mb-4">
                <p className="f-pop text-[var(--muted)] text-[11px] uppercase tracking-wider mb-2">Предварительно</p>
                <p className="f-montm text-[var(--dark)] text-[28px]">от {fmt(priceMin)}</p>
                <p className="f-pop text-[var(--muted)] text-[13px]">до {fmt(priceMax)}</p>
              </div>
              <button className="btn-primary accent-btn w-full">Получить точный расчёт</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">FAQ</p>
              <h2 className="f-mont text-[var(--dark)] mb-6" style={{ fontSize: "clamp(22px,3vw,40px)" }}>Вопросы о FS-портале</h2>
              <a href="tel:88005551234" className="btn-primary accent-btn inline-flex">8 (800) 555-12-34</a>
            </div>
            <div>
              {faqs.map((faq, i) => (
                <div key={i} className={`border-b ${i === 0 ? "border-t" : ""} border-[var(--border)]`}>
                  <button className="w-full flex justify-between gap-4 py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className={`f-popm text-[14px] ${openFaq === i ? "text-[var(--accent)]" : "text-[var(--dark)]"}`}>{faq.q}</span>
                    <span className={`text-[20px] text-[var(--muted)] transition-transform duration-200 shrink-0 ${openFaq === i ? "rotate-45 text-[var(--accent)]" : ""}`}>+</span>
                  </button>
                  <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: openFaq === i ? "200px" : "0px" }}>
                    <p className="f-pop text-[var(--muted)] text-[14px] leading-[1.7] pb-5 pr-8">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
