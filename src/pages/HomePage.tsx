import { useEffect, useRef, useState } from "react";

type Page = "home" | "hs-portal" | "portfolio";

interface HomePageProps { onNavigate: (p: Page) => void; }

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

const products = [
  {
    id: "hs-portal" as Page,
    tag: "Раздвижные системы",
    title: "HS-порталы",
    desc: "Подъёмно-раздвижные системы для больших проёмов. Лёгкое открывание, тёплый контур, низкий порог.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&h=480&fit=crop&auto=format",
    specs: ["от 2 до 6 м шириной", "Тройной стеклопакет", "Низкий порог"],
  },
  {
    id: null,
    tag: "Складные системы",
    title: "Гармошка / HST",
    desc: "Когда нужно полностью убрать стену между домом и террасой. Максимальный проём без колонн.",
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=700&h=480&fit=crop&auto=format",
    specs: ["Складывается полностью", "Любая конфигурация", "Скрытые петли"],
  },
  {
    id: null,
    tag: "Панорамное остекление",
    title: "Холодное и тёплое",
    desc: "Остекление веранды, кровли, фасада. Работаем со сложной геометрией и нестандартными узлами.",
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&h=480&fit=crop&auto=format",
    specs: ["Фасады и кровли", "Нестандартная геометрия", "Структурное остекление"],
  },
];

const advantages = [
  { n: "01", title: "Собственное производство",  desc: "Производим профиль и заготовки в Подмосковье — контролируем качество на каждом этапе." },
  { n: "02", title: "Конструкторское бюро",       desc: "Каждый объект — отдельный проект. Считаем нагрузки, проектируем узел, согласуем с заказчиком." },
  { n: "03", title: "Монтаж и регулировка",       desc: "Монтажная бригада — в штате, не подрядчики. Отвечаем за результат и бесплатно регулируем в гарантийный период." },
  { n: "04", title: "10 лет гарантии",            desc: "На всю систему — профиль, стеклопакет, фурнитуру и монтажные узлы." },
];

const recentProjects = [
  { title: "Гостиная → терраса, Рублёвка",     area: "4.8 × 2.6 м", system: "HS-портал", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=560&h=380&fit=crop&auto=format" },
  { title: "Загородный дом, Новорижское ш.",    area: "6.0 × 2.4 м", system: "HS-портал", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=560&h=380&fit=crop&auto=format" },
  { title: "Терраса с кровлей, Клин",           area: "5.2 × 2.8 м", system: "HST-складная", img: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=560&h=380&fit=crop&auto=format" },
];

const heroProducts = [
  { key: "hs",  name: "HS-портал",      sub: "Максимум света и пространства", img: "./assets/hs_portal_preview.svg" },
  { key: "pan", name: "Панорамное окно", sub: "Вид без границ",                img: "./assets/panoramic_window_preview.svg" },
  { key: "hst", name: "Гармошка / HST",  sub: "Стена исчезает полностью",      img: "./assets/balcony_block_preview.svg" },
];

const projectCards = [
  { title: "Современный дом", loc: "Московская область", area: "148 м²" },
  { title: "Загородный особняк", loc: "Рублёво-Успенское", area: "224 м²" },
  { title: "Вилла у озера", loc: "Клинский район", area: "96 м²" },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [activeProduct, setActiveProduct] = useState(0);
  const [projectIdx, setProjectIdx] = useState(0);
  const { ref: prodRef, v: prodV } = useVisible();
  const { ref: advRef,  v: advV  } = useVisible();
  const { ref: projRef, v: projV } = useVisible();

  const project = projectCards[projectIdx];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white" style={{ minHeight: "100svh" }}>
        <div className="relative grid grid-cols-1 lg:grid-cols-[45fr_55fr]" style={{ minHeight: "100svh" }}>

          {/* LEFT TEXT COLUMN */}
          <div className="relative z-10 flex flex-col justify-center pt-28 lg:pt-0 pb-8 lg:pb-36 px-[clamp(20px,5vw,120px)]">
            <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-6 anim-up">
              Архитектурное остекление
            </p>
            <h1
              className="f-mont text-[var(--dark)] leading-[1.05] mb-6 anim-up d1"
              style={{ fontSize: "clamp(36px,5.5vw,72px)" }}
            >
              Соберите<br />
              остекление дома<br />
              под ключ
            </h1>
            <p className="f-pop text-[var(--muted)] leading-[1.7] mb-8 anim-up d2" style={{ fontSize: "clamp(15px,1.5vw,17px)", maxWidth: 420 }}>
              Подберём и рассчитаем окна, раздвижные системы и панорамное остекление
              на немецких профильных системах. Один проект — единый стиль.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10 anim-up d3">
              <button
                onClick={() => document.getElementById("calc")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary accent-btn gap-2"
              >
                Начать с проекта
                <span style={{ fontSize: "16px" }}>→</span>
              </button>
              <p className="f-pop text-[var(--muted)] text-[13px]">
                Бесплатная инженерная<br />консультация
              </p>
            </div>

            {/* Product selector */}
            <div className="flex flex-col gap-2 anim-up d4 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:px-[clamp(20px,5vw,120px)] lg:pb-10">
              <div className="hidden lg:flex items-center gap-px overflow-hidden rounded-[20px] border border-[var(--border)] bg-white/80 backdrop-blur-sm">
                {heroProducts.map((p, i) => (
                  <button
                    key={p.key}
                    onClick={() => setActiveProduct(i)}
                    className="flex items-center gap-3 px-5 py-4 flex-1 text-left transition-all hover:bg-[var(--light)]"
                    style={{ background: activeProduct === i ? "var(--light)" : "transparent" }}
                  >
                    <div
                      className="size-3 rounded-full shrink-0 transition-all"
                      style={{ background: activeProduct === i ? "var(--accent)" : "var(--border)" }}
                    />
                    <img src={p.img} alt={p.name} className="size-12 object-contain shrink-0" style={{ imageRendering: "auto" }} />
                    <div>
                      <p className={`f-popm text-[13px] ${activeProduct === i ? "text-[var(--dark)]" : "text-[var(--muted)]"}`}>{p.name}</p>
                      <p className="f-pop text-[11px] text-[var(--muted)]">{p.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
              {/* Mobile product chips */}
              <div className="flex gap-2 lg:hidden flex-wrap">
                {heroProducts.map((p, i) => (
                  <button
                    key={p.key}
                    onClick={() => setActiveProduct(i)}
                    className="f-pop text-[12px] px-3 py-1.5 rounded-full border transition-all"
                    style={{
                      background: activeProduct === i ? "var(--accent)" : "transparent",
                      color: activeProduct === i ? "#fff" : "var(--muted)",
                      borderColor: activeProduct === i ? "var(--accent)" : "var(--border)",
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PHOTO COLUMN */}
          <div className="relative min-h-[60vw] lg:min-h-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=900&fit=crop&auto=format"
              alt="Современный дом с панорамным остеклением"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtle left fade */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(255,255,255,.2) 0%, transparent 25%)" }} />

            {/* Script text top-right */}
            <div className="absolute top-10 right-8 text-right hidden lg:block">
              <p className="text-white/70 leading-[1.5]" style={{ fontFamily: "Georgia, serif", fontSize: "14px", fontStyle: "italic" }}>
                Больше, чем окна.<br />Больше жизни
              </p>
              <div className="w-16 h-px bg-white/40 ml-auto mt-2" />
            </div>

            {/* Numbered circles */}
            {[
              { n: "1", top: "38%", left: "38%" },
              { n: "2", top: "62%", left: "55%" },
              { n: "3", top: "58%", left: "80%" },
            ].map((c) => (
              <button
                key={c.n}
                className="absolute flex items-center justify-center size-8 rounded-full f-popm text-[12px] transition-all hover:scale-110"
                style={{
                  top: c.top, left: c.left,
                  background: "var(--accent)",
                  color: "#fff",
                  boxShadow: "0 0 0 4px rgba(107,82,240,.3)",
                }}
              >
                {c.n}
              </button>
            ))}

            {/* Floating project card */}
            <div className="absolute bottom-8 right-6 bg-white rounded-[16px] p-4 shadow-xl" style={{ minWidth: 220 }}>
              <p className="f-pops text-[var(--dark)] text-[14px] mb-0.5">{project.title}</p>
              <p className="f-pop text-[var(--muted)] text-[12px] mb-0.5">{project.loc}</p>
              <p className="f-pop text-[var(--muted)] text-[12px]">Площадь остекления {project.area}</p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setProjectIdx((i) => (i - 1 + projectCards.length) % projectCards.length)}
                  className="size-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--dark)] text-[13px] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >←</button>
                <button
                  onClick={() => setProjectIdx((i) => (i + 1) % projectCards.length)}
                  className="size-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--dark)] text-[13px] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >→</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────── */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="container">
          <div className="flex flex-wrap divide-x divide-[var(--border)]">
            {[
              { val: "до 6 м", label: "ширина проёма" },
              { val: "до 3 м", label: "высота проёма" },
              { val: "до 400 кг", label: "вес створки" },
              { val: "200+ объектов", label: "реализовано" },
              { val: "10 лет", label: "гарантия" },
            ].map((s) => (
              <div key={s.label} className="flex-1 flex flex-col items-center py-5 px-4 min-w-[140px]">
                <p className="f-montm text-[var(--dark)] text-[clamp(18px,2vw,24px)] leading-none mb-1">{s.val}</p>
                <p className="f-pop text-[var(--muted)] text-[12px] text-center">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODUCTS ─────────────────────────────────── */}
      <section ref={prodRef as React.RefObject<HTMLElement>} className="section-pad bg-white">
        <div className="container">
          <div className={`mb-10 ${prodV ? "anim-up" : "opacity-0"}`}>
            <div className="tag-pill mb-5">
              <span className="pill-inner">Системы</span>
              <span className="pill-sub">OKNOVA</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="f-mont text-[var(--dark)] leading-[1.1]" style={{ fontSize: "clamp(26px,3.5vw,48px)" }}>
                Три типа систем под любую задачу
              </h2>
              <button onClick={() => onNavigate("hs-portal")} className="btn-outline shrink-0" style={{ fontSize: "14px" }}>
                HS-порталы →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <div
                key={p.title}
                className={`bg-[var(--light)] rounded-[24px] overflow-hidden card-hover ${prodV ? "anim-scale" : "opacity-0"} ${p.id ? "cursor-pointer" : ""}`}
                style={{ animationDelay: `${.1 + i * .12}s` }}
                onClick={() => p.id && onNavigate(p.id)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--card)]">
                  <img alt={p.title} src={p.img} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <span className="absolute top-4 left-4 f-pop text-[11px] text-white bg-[var(--dark)]/80 px-3 py-1 rounded-full backdrop-blur-sm">
                    {p.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="f-pops text-[var(--dark)] mb-2" style={{ fontSize: "clamp(18px,1.8vw,22px)" }}>{p.title}</h3>
                  <p className="f-pop text-[var(--muted)] text-[14px] leading-[1.6] mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.specs.map((s) => (
                      <span key={s} className="f-pop text-[11px] text-[var(--accent)] border border-[var(--accent)]/25 px-2.5 py-1 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ───────────────────────────────── */}
      <section ref={advRef as React.RefObject<HTMLElement>} className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container">
          <div className={`mb-10 ${advV ? "anim-up" : "opacity-0"}`}>
            <div className="tag-pill mb-5">
              <span className="pill-inner">О компании</span>
              <span className="pill-sub">OKNOVA</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="f-mont text-[var(--dark)] leading-[1.1] max-w-[520px]" style={{ fontSize: "clamp(26px,3.5vw,48px)" }}>
                Конструкторское бюро, а не магазин профилей
              </h2>
              <p className="f-pop text-[var(--muted)] text-[15px] leading-[1.6] max-w-[340px]">
                Мы инженеры, а не продавцы. Ваш объект — отдельный проект, а не позиция в прайсе.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)] overflow-hidden rounded-[24px]">
            {advantages.map((a, i) => (
              <div
                key={a.n}
                className={`bg-white p-8 md:p-10 ${advV ? "anim-up" : "opacity-0"}`}
                style={{ animationDelay: `${.1 + i * .1}s` }}
              >
                <span className="f-popm text-[var(--accent)] text-[12px] uppercase tracking-[0.14em] block mb-4">{a.n}</span>
                <h3 className="f-pops text-[var(--dark)] mb-3" style={{ fontSize: "clamp(16px,1.6vw,20px)" }}>{a.title}</h3>
                <p className="f-pop text-[var(--muted)] text-[14px] leading-[1.7]">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT PROJECTS ──────────────────────────── */}
      <section ref={projRef as React.RefObject<HTMLElement>} className="section-pad bg-white">
        <div className="container">
          <div className={`flex items-end justify-between mb-10 gap-4 ${projV ? "anim-up" : "opacity-0"}`}>
            <div>
              <div className="tag-pill mb-5">
                <span className="pill-inner">Проекты</span>
                <span className="pill-sub">OKNOVA</span>
              </div>
              <h2 className="f-mont text-[var(--dark)] leading-[1.1]" style={{ fontSize: "clamp(24px,3vw,44px)" }}>
                Последние реализации
              </h2>
            </div>
            <button
              onClick={() => onNavigate("portfolio")}
              className="btn-outline shrink-0"
              style={{ fontSize: "14px" }}
            >
              Все объекты →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentProjects.map((p, i) => (
              <div
                key={p.title}
                className={`group cursor-pointer ${projV ? "anim-scale" : "opacity-0"}`}
                style={{ animationDelay: `${.1 + i * .12}s` }}
                onClick={() => onNavigate("portfolio")}
              >
                <div className="rounded-[20px] overflow-hidden aspect-[4/3] bg-[var(--card)] mb-4">
                  <img alt={p.title} src={p.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="f-pops text-[var(--dark)] text-[15px] mb-1">{p.title}</p>
                    <p className="f-pop text-[var(--muted)] text-[13px]">{p.system} · {p.area}</p>
                  </div>
                  <span className="text-[var(--accent)] group-hover:translate-x-1 transition-transform text-[18px] mt-0.5">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
