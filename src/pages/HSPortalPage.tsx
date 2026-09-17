import { useEffect, useRef, useState } from "react";

function useVisible(threshold = 0.12) {
  const [v, setV] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, v };
}

/* ── CALCULATOR ───────────────────────────────────── */
function Calculator() {
  const [width,  setWidth]  = useState(4000);
  const [height, setHeight] = useState(2700);
  const [usage,  setUsage]  = useState<"daily" | "seasonal">("daily");

  const area    = (width / 1000) * (height / 1000);
  const mult    = usage === "daily" ? 1.18 : 1.0;
  const priceMin = Math.round(area * 180_000 * mult / 10000) * 10000;
  const priceMax = Math.round(area * 230_000 * mult / 10000) * 10000;
  const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

  return (
    <section id="calc" className="section-pad bg-[var(--dark)]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="f-popm text-white/40 text-[11px] uppercase tracking-[0.28em] mb-5">Стоимость</p>
            <h2 className="f-mont text-white leading-[1.1] mb-4" style={{ fontSize: "clamp(26px,3vw,44px)" }}>
              Получите ориентир стоимости за 1 минуту
            </h2>
            <p className="f-pop text-white/50 text-[15px] leading-[1.6] mb-8">
              Точная стоимость зависит от системы, стеклопакета, цвета профиля, фурнитуры и монтажного узла.
              Рассчитываем после замера — бесплатно.
            </p>
            <div className="bg-white/[0.05] border border-white/10 rounded-[20px] p-6">
              <p className="f-pops text-white text-[16px] mb-1">Хотите точный расчёт?</p>
              <p className="f-pop text-white/50 text-[14px] mb-4">Пришлите план или фото — ответим за 2 часа.</p>
              <a href="tel:88005551234" className="btn-primary accent-btn inline-flex">
                8 (800) 555-12-34
              </a>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-7 md:p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="f-popm text-[var(--dark)] text-[14px]">Ширина проёма</label>
                <span className="f-montm text-[var(--accent)] text-[18px]">{(width/1000).toFixed(1)} м</span>
              </div>
              <input type="range" min={1500} max={8000} step={100}
                value={width} onChange={(e) => setWidth(+e.target.value)}
                className="w-full h-1.5 rounded-full cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
              <div className="flex justify-between mt-1">
                <span className="f-pop text-[12px] text-[var(--muted)]">1.5 м</span>
                <span className="f-pop text-[12px] text-[var(--muted)]">8 м</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="f-popm text-[var(--dark)] text-[14px]">Высота проёма</label>
                <span className="f-montm text-[var(--accent)] text-[18px]">{(height/1000).toFixed(1)} м</span>
              </div>
              <input type="range" min={1800} max={3500} step={100}
                value={height} onChange={(e) => setHeight(+e.target.value)}
                className="w-full h-1.5 rounded-full cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
              <div className="flex justify-between mt-1">
                <span className="f-pop text-[12px] text-[var(--muted)]">1.8 м</span>
                <span className="f-pop text-[12px] text-[var(--muted)]">3.5 м</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="f-popm text-[var(--dark)] text-[14px] mb-3">Использование</p>
              <div className="grid grid-cols-2 gap-2">
                {([["daily","Каждый день"], ["seasonal","Сезонно"]] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setUsage(val)}
                    className={`py-3 rounded-[12px] f-pop text-[14px] border transition-all ${usage === val
                      ? "bg-[var(--dark)] text-white border-[var(--dark)]"
                      : "bg-[var(--light)] text-[var(--dark)] border-[var(--border)] hover:border-[var(--dark)]"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[var(--light)] rounded-[16px] p-5 mb-5">
              <p className="f-pop text-[var(--muted)] text-[12px] uppercase tracking-[0.12em] mb-2">Предварительная стоимость</p>
              <p className="f-montm text-[var(--dark)] leading-none" style={{ fontSize: "clamp(22px,3vw,32px)" }}>
                от {fmt(priceMin)}
              </p>
              <p className="f-pop text-[var(--muted)] text-[14px] mt-1">до {fmt(priceMax)}</p>
              <p className="f-pop text-[12px] text-[var(--muted)] mt-3 leading-[1.5]">
                Для проёма {(width/1000).toFixed(1)} × {(height/1000).toFixed(1)} м ·{" "}
                {usage === "daily" ? "тёплый контур" : "сезонное использование"}
              </p>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="btn-primary accent-btn w-full"
            >
              Обсудить проект с инженером
            </button>
            <p className="f-pop text-[12px] text-[var(--muted)] text-center mt-3">Без обязательств · Ответим за 2 часа</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "Будет ли холодно зимой?", a: "Зависит от системы, стеклопакета и монтажного узла. Для круглогодичного использования подбираем тёплый профиль с тройным стеклопакетом и тёплым монтажным пеной. R = 0.8–1.1 м²·К/Вт." },
  { q: "Можно ли сделать порог в уровень пола?", a: "Да, это возможно. Требует специального дренажного узла в основании и правильно организованного отвода воды. Проектируем с нуля на этапе строительства или адаптируем к готовому полу." },
  { q: "Что нужно прислать для расчёта?", a: "Достаточно примерных размеров проёма, плана помещения или фотографии. По желанию — визуализацию или рендер. Звоните или пишите — разберёмся вместе." },
  { q: "Сколько времени занимает монтаж?", a: "Стандартный портал 4–5 м монтируется за 1–2 рабочих дня. Включая уборку и регулировку. Для сложных объектов с несколькими системами — от 3 дней." },
  { q: "Работаете ли вы за МКАД?", a: "Работаем по Москве и Московской области без наценки на выезд. Для объектов в других регионах — договариваемся индивидуально." },
];

/* ── MAIN PAGE ────────────────────────────────────── */
export default function HSPortalPage() {
  const { ref: whatRef,  v: whatV  } = useVisible();
  const { ref: csRef,    v: csV    } = useVisible();
  const { ref: mechRef,  v: mechV  } = useVisible();
  const { ref: openRef,  v: openV  } = useVisible();
  const { ref: procRef,  v: procV  } = useVisible();
  const { ref: faqRef,   v: faqV   } = useVisible();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white" style={{ minHeight: "100svh" }}>
        <div className="relative grid grid-cols-1 lg:grid-cols-[44fr_56fr]" style={{ minHeight: "100svh" }}>

          {/* LEFT */}
          <div className="relative z-10 flex flex-col justify-center pt-28 lg:pt-0 pb-10 px-[clamp(20px,5vw,120px)]">
            <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5 anim-up">
              HS-Порталы · Проектирование и монтаж
            </p>
            <h1
              className="f-mont text-[var(--dark)] leading-[1.05] mb-6 anim-up d1"
              style={{ fontSize: "clamp(32px,4.8vw,64px)", maxWidth: "14ch" }}
            >
              Большой выход на террасу. Без инженерной головоломки.
            </h1>
            <p className="f-pop text-[var(--muted)] leading-[1.7] mb-8 anim-up d2" style={{ fontSize: "clamp(14px,1.4vw,16px)", maxWidth: 420 }}>
              Мы сами разберёмся с профилем, стеклопакетом, нагрузками и монтажными узлами.
              Вам останется выбрать систему и дату монтажа.
            </p>
            <div className="flex flex-wrap gap-3 anim-up d3">
              <button
                onClick={() => document.getElementById("calc")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary accent-btn"
              >
                Получить ориентир стоимости
              </button>
              <button
                onClick={() => document.getElementById("construction")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-outline"
              >
                Как устроен →
              </button>
            </div>

            {/* Spec tags */}
            <div className="flex flex-wrap gap-2 mt-8 anim-up d4">
              {["Для частных домов", "До 6 м шириной", "Порог от 15 мм", "Москва и МО"].map((t) => (
                <span key={t} className="f-pop text-[11px] text-[var(--muted)] border border-[var(--border)] px-3 py-1.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT photo */}
          <div className="relative min-h-[50vw] lg:min-h-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=900&fit=crop&auto=format"
              alt="HS-портал"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(255,255,255,.18) 0%, transparent 20%)" }} />

            {/* Floating spec chip */}
            <div
              className="absolute top-10 right-8 hidden lg:block"
              style={{
                background: "rgba(26,28,24,0.75)",
                backdropFilter: "blur(12px)",
                borderRadius: "14px",
                padding: "12px 16px",
                color: "#fff",
              }}
            >
              <p className="f-pop text-[11px] text-white/50 mb-1">Технические характеристики</p>
              <div className="flex gap-4">
                {[["до 6 м", "ширина"], ["до 3 м", "высота"], ["до 400 кг", "вес"]].map(([v, l]) => (
                  <div key={l}>
                    <p className="f-montm text-white text-[15px] leading-none">{v}</p>
                    <p className="f-pop text-[11px] text-white/50">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: "linear-gradient(to top, rgba(255,255,255,.6) 0%, transparent 100%)" }} />
          </div>
        </div>
      </section>

      {/* ── WHAT IS HS ───────────────────────────────── */}
      <section ref={whatRef as React.RefObject<HTMLElement>} className="section-pad bg-white">
        <div className="container">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${whatV ? "anim-up" : "opacity-0"}`}>
            <div>
              <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Что такое HS</p>
              <h2 className="f-mont text-[var(--dark)] leading-[1.1] mb-6" style={{ fontSize: "clamp(24px,3vw,42px)" }}>
                HS-портал — когда хочется открыть дом к саду, но сохранить тепло и комфорт.
              </h2>
              <p className="f-pop text-[var(--muted)] text-[15px] leading-[1.7] mb-8">
                HS расшифровывается как Hebe-Schiebe — подъёмно-раздвижная система. При повороте ручки
                створка слегка приподнимается над порогом, освобождая уплотнения, и после этого легко
                скользит в сторону. Даже панель весом 400 кг открывается одним пальцем.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { n: "01", t: "Каждый день — лёгкое открывание",           d: "Подъёмный механизм снимает нагрузку с уплотнений. Усилие открывания — меньше 1 кг." },
                  { n: "02", t: "Тёплый контур — круглогодичная эксплуатация", d: "Тройной EPDM-контур и тёплый монтажный узел держат тепло при −25°С снаружи." },
                  { n: "03", t: "Чистый проём — минимум рам, низкий порог",   d: "Профиль шириной от 80 мм. Порог от 15 мм — почти на уровне пола." },
                ].map((b) => (
                  <div key={b.n} className="flex gap-4 p-4 rounded-[16px] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors">
                    <span className="f-popm text-[var(--accent)] text-[12px] shrink-0 mt-0.5">{b.n}</span>
                    <div>
                      <p className="f-pops text-[var(--dark)] text-[15px] mb-1">{b.t}</p>
                      <p className="f-pop text-[var(--muted)] text-[13px] leading-[1.5]">{b.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[28px] overflow-hidden aspect-[3/4] bg-[var(--card)]">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&h=920&fit=crop&auto=format"
                alt="HS-портал"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute bottom-6 left-6 right-6 rounded-[16px] p-4"
                style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0">
                    <span className="text-white text-[14px]">✓</span>
                  </div>
                  <div>
                    <p className="f-pops text-[var(--dark)] text-[14px]">Рекомендация инженера</p>
                    <p className="f-pop text-[var(--muted)] text-[12px]">Для ежедневного выхода чаще всего начинаем с HS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONSTRUCTION IN CROSS-SECTION ─────────────── */}
      <section
        ref={csRef as React.RefObject<HTMLElement>}
        id="construction"
        className="section-pad"
        style={{ background: "var(--light)" }}
      >
        <div className="container">
          <div className={`grid grid-cols-1 lg:grid-cols-[32%_auto] gap-10 lg:gap-16 items-center ${csV ? "anim-up" : "opacity-0"}`}>
            {/* Left text */}
            <div>
              <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Техническое превосходство</p>
              <h2 className="f-mont text-[var(--dark)] leading-[1.1] mb-5" style={{ fontSize: "clamp(24px,2.8vw,40px)" }}>
                Конструкция в разрезе
              </h2>
              <p className="f-pop text-[var(--muted)] text-[14px] leading-[1.7] mb-7">
                Продуманная инженерия обеспечивает тепло, тишину и долговечность даже при экстремальных размерах.
              </p>
              <button
                onClick={() => document.getElementById("calc")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-outline text-[14px]"
              >
                Узнать больше о конструкции
              </button>
            </div>

            {/* Annotated image */}
            <div className="relative flex items-center justify-center gap-4 lg:gap-8">
              {/* Left labels */}
              <div className="hidden md:flex flex-col gap-6 text-right shrink-0" style={{ maxWidth: 160 }}>
                {[
                  { title: "Стеклопакет до 52 мм", desc: "Высокая тепло- и звукоизоляция" },
                  { title: "Контур уплотнения", desc: "Множественные контуры защищают от ветра, влаги и шума" },
                ].map((l) => (
                  <div key={l.title}>
                    <p className="f-popm text-[var(--dark)] text-[12px] leading-tight mb-1">{l.title}</p>
                    <p className="f-pop text-[var(--muted)] text-[11px] leading-[1.4]">{l.desc}</p>
                  </div>
                ))}
              </div>

              {/* Cross-section product image */}
              <div className="rounded-[24px] overflow-hidden bg-white flex-1" style={{ maxWidth: 380 }}>
                <img
                  src="./assets/panoramic_window_preview.svg"
                  alt="Конструкция HS-портала в разрезе"
                  className="w-full object-contain"
                  style={{ maxHeight: 420 }}
                />
              </div>

              {/* Right labels */}
              <div className="hidden md:flex flex-col gap-5 shrink-0" style={{ maxWidth: 160 }}>
                {[
                  { title: "Многокамерный профиль", desc: "Стабильность, жёсткость и энергоэффективность" },
                  { title: "Армирование", desc: "Стальная арматура для больших нагрузок" },
                  { title: "Тёплый порог", desc: "Минимальная высота и максимальная герметичность" },
                ].map((l) => (
                  <div key={l.title}>
                    <p className="f-popm text-[var(--dark)] text-[12px] leading-tight mb-1">{l.title}</p>
                    <p className="f-pop text-[var(--muted)] text-[11px] leading-[1.4]">{l.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile labels */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 md:hidden ${csV ? "anim-up" : "opacity-0"}`} style={{ animationDelay: ".15s" }}>
            {[
              { title: "Стеклопакет до 52 мм", desc: "Высокая тепло- и звукоизоляция" },
              { title: "Контур уплотнения", desc: "Защита от ветра, влаги и шума" },
              { title: "Многокамерный профиль", desc: "Стабильность и жёсткость" },
              { title: "Армирование", desc: "Стальная арматура" },
              { title: "Тёплый порог", desc: "Минимальная высота" },
            ].map((l) => (
              <div key={l.title} className="bg-white rounded-[14px] p-4">
                <p className="f-popm text-[var(--dark)] text-[12px] mb-1">{l.title}</p>
                <p className="f-pop text-[var(--muted)] text-[11px]">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MECHANISM: ONE TURN ──────────────────────── */}
      <section
        ref={mechRef as React.RefObject<HTMLElement>}
        className="relative overflow-hidden section-pad"
        style={{ background: "var(--dark)" }}
      >
        {/* Background photo */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1400&h=700&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: .18 }}
          />
        </div>

        <div className="relative container">
          {/* Top row */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-10">
            <div>
              <p className="f-popm text-white/40 text-[11px] uppercase tracking-[0.28em] mb-0">Инженерия в деталях</p>
            </div>
            <div className="text-right hidden md:block">
              <p className="f-popm text-white/25 text-[10px] uppercase tracking-[0.2em] leading-[1.6]">
                Надёжные механизмы<br />для больших возможностей
              </p>
              <p className="f-popm text-white/40 text-[12px] tracking-[0.2em] mt-1">OKNOVA —</p>
            </div>
          </div>

          <h2
            className={`f-mont text-white leading-[1.05] mb-12 ${mechV ? "anim-up" : "opacity-0"}`}
            style={{ fontSize: "clamp(28px,4vw,56px)", maxWidth: "14ch" }}
          >
            Один поворот —<br />и створка движется легко
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 overflow-hidden rounded-[20px]">
            {[
              { n: "01", title: "Поверните ручку",   desc: "Подъёмный механизм приподнимает створку с уплотнений." },
              { n: "02", title: "Створка скользит",   desc: "Ролики из нержавеющей стали обеспечивают плавный и тихий ход даже при большом весе." },
              { n: "03", title: "Максимальный проём", desc: "Лёгкое и надёжное сдвижение для панорамного открытия пространства." },
            ].map((s, i) => (
              <div
                key={s.n}
                className={`p-7 md:p-8 bg-[var(--dark)] ${mechV ? "anim-up" : "opacity-0"}`}
                style={{ animationDelay: `${i * .12}s` }}
              >
                <p className="f-montm text-white/20 text-[48px] leading-none mb-4">{s.n}</p>
                <p className="f-pops text-white text-[16px] mb-3">{s.title}</p>
                <p className="f-pop text-white/50 text-[14px] leading-[1.6]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT OPENS ──────────────────────────────── */}
      <section
        ref={openRef as React.RefObject<HTMLElement>}
        className="section-pad"
        style={{ background: "#111214" }}
      >
        <div className="container">
          {/* Header row */}
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 ${openV ? "anim-up" : "opacity-0"}`}>
            <div>
              <p className="f-popm text-white/40 text-[11px] uppercase tracking-[0.28em] mb-4">Технология в деталях</p>
              <h2 className="f-mont text-white leading-[1.1]" style={{ fontSize: "clamp(24px,3vw,42px)" }}>
                Как открывается<br />HS-портал
              </h2>
            </div>
            <div className="flex flex-col md:items-end gap-4">
              <p className="f-pop text-white/50 text-[14px] leading-[1.6]" style={{ maxWidth: 300 }}>
                Уникальный подъёмно-сдвижной механизм позволяет легко перемещать даже очень тяжёлые створки.
              </p>
              <button
                onClick={() => document.getElementById("calc")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-outline !text-white !border-white/25 hover:!bg-white/10 text-[14px] shrink-0"
              >
                Узнать больше →
              </button>
            </div>
          </div>

          {/* 3 photo cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${openV ? "anim-scale" : "opacity-0"}`} style={{ animationDelay: ".1s" }}>
            {[
              {
                n: "01",
                title: "Поверните ручку",
                desc: "Механизм поднимает створку с уплотнителей.",
                arrow: "↺",
                img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=340&fit=crop&auto=format",
              },
              {
                n: "02",
                title: "Створка приподнимается",
                desc: "Ролики берут вес створки (до 400 кг).",
                arrow: "↑",
                img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=340&fit=crop&auto=format",
              },
              {
                n: "03",
                title: "Плавно сдвиньте",
                desc: "Створка легко движется в сторону, открывая проём.",
                arrow: "→",
                img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=340&fit=crop&auto=format",
              },
            ].map((c, i) => (
              <div key={c.n} className="group" style={{ animationDelay: `${i * .1}s` }}>
                <div className="relative rounded-[20px] overflow-hidden mb-4" style={{ aspectRatio: "4/3" }}>
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 60%)" }} />
                  {/* Number badge */}
                  <div
                    className="absolute top-4 left-4 size-9 rounded-full flex items-center justify-center f-popm text-[13px]"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.2)", color: "#fff" }}
                  >
                    {c.n}
                  </div>
                  {/* Purple arrow indicator */}
                  <div
                    className="absolute bottom-4 right-4 size-8 rounded-full flex items-center justify-center text-white text-[14px]"
                    style={{ background: "var(--accent)" }}
                  >
                    {c.arrow}
                  </div>
                </div>
                <p className="f-pops text-white text-[15px] mb-1.5">{c.title}</p>
                <p className="f-pop text-white/50 text-[13px] leading-[1.5]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ───────────────────────────────── */}
      <Calculator />

      {/* ── PROCESS ──────────────────────────────────── */}
      <section ref={procRef as React.RefObject<HTMLElement>} className="section-pad bg-white">
        <div className="container">
          <div className={`mb-12 ${procV ? "anim-up" : "opacity-0"}`}>
            <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Процесс</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="f-mont text-[var(--dark)] leading-[1.1] max-w-[520px]" style={{ fontSize: "clamp(24px,3vw,44px)" }}>
                Конструкторское бюро, а не магазин профилей
              </h2>
              <p className="f-pop text-[var(--muted)] text-[15px] leading-[1.6] max-w-[320px]">
                Четыре шага от звонка до готовой системы. В среднем — 6–10 недель.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: "01", title: "Разбираем задачу",      desc: "Первый созвон до 30 минут: выясняем проём, стены, назначение, бюджет. Иногда задача решается проще, чем казалось." },
              { n: "02", title: "Проектируем узел",       desc: "Инженер рассчитывает профиль, стеклопакет и монтажный узел под ваши конкретные условия. Результат — чертёж с разрезом." },
              { n: "03", title: "Производим",             desc: "Изготавливаем систему на собственном производстве в Подмосковье. Сроки — от 4 до 8 недель в зависимости от конфигурации." },
              { n: "04", title: "Монтируем и регулируем", desc: "Монтажники — штатные сотрудники. После установки — полная регулировка, инструктаж и подписание акта. Гарантия 10 лет." },
            ].map((s, i) => (
              <div
                key={s.n}
                className={`relative p-6 md:p-7 rounded-[20px] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors ${procV ? "anim-up" : "opacity-0"}`}
                style={{ animationDelay: `${.1 + i * .1}s` }}
              >
                {i < 3 && (
                  <div className="hidden lg:block absolute top-[54px] h-px w-5 bg-[var(--accent)]/25" style={{ right: "-10px" }} />
                )}
                <span className="f-popm text-[var(--accent)] text-[12px] uppercase tracking-[0.12em] block mb-4">{s.n}</span>
                <h3 className="f-pops text-[var(--dark)] mb-3" style={{ fontSize: "clamp(15px,1.4vw,18px)" }}>{s.title}</h3>
                <p className="f-pop text-[var(--muted)] text-[13px] leading-[1.6]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section ref={faqRef as React.RefObject<HTMLElement>} className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className={faqV ? "anim-up" : "opacity-0"}>
              <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Вопросы</p>
              <h2 className="f-mont text-[var(--dark)] leading-[1.1] mb-6" style={{ fontSize: "clamp(24px,3vw,44px)" }}>
                Частые вопросы о&nbsp;HS-порталах
              </h2>
              <p className="f-pop text-[var(--muted)] text-[15px] leading-[1.7] mb-8">
                Не нашли ответ — позвоните или напишите. Инженер ответит в течение 2 часов.
              </p>
              <a href="tel:88005551234" className="btn-primary accent-btn inline-flex">
                8 (800) 555-12-34
              </a>
            </div>

            <div className={faqV ? "anim-up d2" : "opacity-0"}>
              {faqs.map((faq, i) => (
                <div key={i} className={`border-b ${i === 0 ? "border-t" : ""} border-[var(--border)]`}>
                  <button
                    className="w-full flex items-start justify-between gap-4 py-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span
                      className={`f-popm text-[15px] leading-[1.5] transition-colors ${openFaq === i ? "text-[var(--accent)]" : "text-[var(--dark)]"}`}
                    >
                      {faq.q}
                    </span>
                    <span
                      className={`shrink-0 f-popl text-[22px] text-[var(--muted)] transition-all duration-200 ${openFaq === i ? "rotate-45 text-[var(--accent)]" : ""}`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openFaq === i ? "200px" : "0px" }}
                  >
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
