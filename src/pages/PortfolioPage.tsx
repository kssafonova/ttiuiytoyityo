import { useEffect, useRef, useState } from "react";

const projects = [
  { id: 1,  title: "Гостиная → терраса, Рублёвка",            system: "HS-портал",          area: "4.8 × 2.6 м",  year: "2025", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=640&h=440&fit=crop&auto=format", cat: "hs" },
  { id: 2,  title: "Загородный дом, Новорижское шоссе",        system: "HS-портал",          area: "6.0 × 2.4 м",  year: "2025", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=640&h=440&fit=crop&auto=format", cat: "hs" },
  { id: 3,  title: "Терраса с кровлей, Клин",                  system: "HST-складная",       area: "5.2 × 2.8 м",  year: "2024", img: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=640&h=440&fit=crop&auto=format", cat: "hst" },
  { id: 4,  title: "Дом в скандинавском стиле, Сколково",      system: "HS-портал",          area: "3.6 × 2.7 м",  year: "2024", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=640&h=440&fit=crop&auto=format", cat: "hs" },
  { id: 5,  title: "Панорамный фасад, Жуковка",                system: "Структурное",        area: "8.0 × 3.2 м",  year: "2024", img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=640&h=440&fit=crop&auto=format", cat: "structural" },
  { id: 6,  title: "Дом с террасой, Барвиха",                  system: "HS-портал 3-секц.",  area: "5.6 × 2.5 м",  year: "2024", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=440&fit=crop&auto=format", cat: "hs" },
  { id: 7,  title: "Зимний сад, Истра",                        system: "Кровля + фасад",     area: "7.0 × 4.5 м",  year: "2023", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&h=440&fit=crop&auto=format", cat: "structural" },
  { id: 8,  title: "Кухня → сад, Одинцово",                   system: "HS-портал",          area: "3.2 × 2.4 м",  year: "2023", img: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=640&h=440&fit=crop&auto=format", cat: "hs" },
  { id: 9,  title: "Угловое остекление, Красногорск",          system: "HST угловая",        area: "6.4 × 2.8 м",  year: "2023", img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=640&h=440&fit=crop&auto=format", cat: "hst" },
  { id: 10, title: "Гараж-студия, Рублёвка",                   system: "Складная гармошка",  area: "8.0 × 3.5 м",  year: "2023", img: "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=640&h=440&fit=crop&auto=format", cat: "hst" },
  { id: 11, title: "Коттедж в лесу, Сергиев Посад",            system: "HS-портал",          area: "4.0 × 2.6 м",  year: "2022", img: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=640&h=440&fit=crop&auto=format", cat: "hs" },
  { id: 12, title: "Веранда с подогревом пола, Звенигород",    system: "HS-портал тёплый",   area: "5.0 × 2.7 м",  year: "2022", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=640&h=380&fit=crop&auto=format&crop=bottom", cat: "hs" },
];

const categories = [
  { id: "all",        label: "Все объекты" },
  { id: "hs",         label: "HS-порталы" },
  { id: "hst",        label: "Складные системы" },
  { id: "structural", label: "Структурное остекление" },
];

export default function PortfolioPage() {
  const [cat, setCat]     = useState("all");
  const [modal, setModal] = useState<typeof projects[0] | null>(null);
  const [visible, setV]   = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => { setTimeout(() => setV(true), 100); }, []);

  // close modal on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const filtered = cat === "all" ? projects : projects.filter((p) => p.cat === cat);

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "clamp(340px,45vw,540px)", background: "var(--dark)" }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&h=700&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: .35 }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,28,24,.9) 0%, rgba(26,28,24,.2) 70%, transparent 100%)" }} />
        </div>
        <div className="relative container pb-16 md:pb-20 pt-[120px]">
          <div className="tag-pill dark-tag mb-5">
            <span className="pill-inner">Проекты</span>
            <span className="pill-sub">OKNOVA</span>
          </div>
          <h1
            className={`f-mont text-white leading-[1.0] mb-4 ${visible ? "anim-up" : "opacity-0"}`}
            style={{ fontSize: "clamp(32px,5.5vw,72px)" }}
          >
            Реализованные объекты
          </h1>
          <p className={`f-pop text-white/55 text-[clamp(14px,1.5vw,17px)] max-w-[480px] leading-[1.6] ${visible ? "anim-up d2" : "opacity-0"}`}>
            Более 200 проектов в Москве и МО с 2016 года. Показываем реальные объекты, а не рендеры.
          </p>
          {/* Quick stats */}
          <div className={`flex flex-wrap gap-8 mt-8 pt-8 border-t border-white/10 ${visible ? "anim-up d3" : "opacity-0"}`}>
            {[
              { v: "200+", l: "объектов" },
              { v: "7 лет", l: "опыта" },
              { v: "МиМО",  l: "Москва и область" },
            ].map((s) => (
              <div key={s.l}>
                <p className="f-montm text-white text-[24px] leading-none">{s.v}</p>
                <p className="f-pop text-white/40 text-[12px] mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container">
          {/* Filter */}
          <div className={`flex flex-wrap gap-2 mb-10 ${visible ? "anim-up" : "opacity-0"}`}>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`f-pop text-[14px] px-5 py-2.5 rounded-full border transition-all ${cat === c.id
                  ? "bg-[var(--dark)] text-white border-[var(--dark)]"
                  : "bg-white text-[var(--dark)] border-[var(--border)] hover:border-[var(--dark)]"}`}
              >
                {c.label}
                {c.id !== "all" && (
                  <span className="ml-2 f-pop text-[12px] opacity-50">
                    {projects.filter((p) => p.cat === c.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="f-pop text-[var(--muted)] text-[13px] mb-6">
            Показано {filtered.length} объектов
          </p>

          {/* Masonry-style grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className={`break-inside-avoid cursor-pointer group ${visible ? "anim-scale" : "opacity-0"}`}
                style={{ animationDelay: `${.05 + i * .06}s` }}
                onClick={() => setModal(p)}
              >
                <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="overflow-hidden" style={{ aspectRatio: i % 3 === 1 ? "1/1.1" : "4/3" }}>
                    <img
                      alt={p.title}
                      src={p.img}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="f-pops text-[var(--dark)] text-[14px] mb-1 leading-[1.3]">{p.title}</p>
                        <p className="f-pop text-[var(--muted)] text-[12px]">{p.system}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="f-pop text-[var(--accent)] text-[13px]">{p.area}</p>
                        <p className="f-pop text-[var(--muted)] text-[11px] mt-0.5">{p.year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-white">
        <div className="container text-center">
          <h2
            className={`f-mont text-[var(--dark)] leading-[1.1] mb-4 mx-auto ${visible ? "anim-up" : "opacity-0"}`}
            style={{ fontSize: "clamp(24px,3vw,44px)", maxWidth: 560 }}
          >
            Хотите свой объект в этом разделе?
          </h2>
          <p className="f-pop text-[var(--muted)] text-[15px] mb-8">Расскажите нам о проёме — предложим решение.</p>
          <button
            onClick={() => document.getElementById("calc")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary accent-btn"
          >
            Рассчитать проект
          </button>
        </div>

        {/* Calculator inline */}
        <div id="calc" className="container mt-20">
          <PortfolioCalc />
        </div>
      </section>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(26,28,24,.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-[28px] overflow-hidden max-w-[860px] w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/8] overflow-hidden bg-[var(--card)]">
              <img alt={modal.title} src={modal.img} className="w-full h-full object-cover" />
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 size-9 rounded-full bg-white/90 flex items-center justify-center text-[var(--dark)] hover:bg-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-7 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="f-mont text-[var(--dark)]" style={{ fontSize: "clamp(20px,2.5vw,30px)" }}>{modal.title}</h3>
                <span className="f-popm text-[var(--accent)] text-[13px] shrink-0 bg-[var(--light)] px-3 py-1.5 rounded-full">{modal.year}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { l: "Система",  v: modal.system },
                  { l: "Проём",    v: modal.area },
                  { l: "Гарантия", v: "10 лет" },
                ].map((item) => (
                  <div key={item.l} className="bg-[var(--light)] rounded-[12px] p-4">
                    <p className="f-pop text-[var(--muted)] text-[11px] uppercase tracking-[0.1em] mb-1">{item.l}</p>
                    <p className="f-pops text-[var(--dark)] text-[15px]">{item.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* mini calc used in portfolio */
function PortfolioCalc() {
  const [width, setWidth] = useState(4000);
  const [height, setHeight] = useState(2700);
  const area = (width / 1000) * (height / 1000);
  const priceMin = Math.round(area * 180_000 / 10000) * 10000;
  const priceMax = Math.round(area * 230_000 / 10000) * 10000;
  const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

  return (
    <div className="max-w-[820px] mx-auto bg-[var(--light)] rounded-[28px] p-8 md:p-10 border border-[var(--border)]">
      <h3 className="f-mont text-[var(--dark)] mb-2" style={{ fontSize: "clamp(20px,2.5vw,32px)" }}>
        Предварительный расчёт
      </h3>
      <p className="f-pop text-[var(--muted)] text-[14px] mb-8">Передвигайте ползунки — стоимость обновляется мгновенно.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between mb-2">
            <label className="f-popm text-[var(--dark)] text-[14px]">Ширина</label>
            <span className="f-montm text-[var(--accent)]">{(width/1000).toFixed(1)} м</span>
          </div>
          <input type="range" min={1500} max={8000} step={100} value={width} onChange={(e) => setWidth(+e.target.value)}
            className="w-full h-1.5 rounded-full" style={{ accentColor: "var(--accent)" }} />
          <div className="mb-6" />
          <div className="flex justify-between mb-2">
            <label className="f-popm text-[var(--dark)] text-[14px]">Высота</label>
            <span className="f-montm text-[var(--accent)]">{(height/1000).toFixed(1)} м</span>
          </div>
          <input type="range" min={1800} max={3500} step={100} value={height} onChange={(e) => setHeight(+e.target.value)}
            className="w-full h-1.5 rounded-full" style={{ accentColor: "var(--accent)" }} />
        </div>
        <div className="flex flex-col justify-center bg-white rounded-[20px] p-6">
          <p className="f-pop text-[var(--muted)] text-[11px] uppercase tracking-[0.12em] mb-2">Ориентир</p>
          <p className="f-montm text-[var(--dark)] leading-none mb-1" style={{ fontSize: "clamp(22px,2.5vw,32px)" }}>от {fmt(priceMin)}</p>
          <p className="f-pop text-[var(--muted)] text-[14px] mb-4">до {fmt(priceMax)}</p>
          <a href="tel:88005551234" className="btn-primary accent-btn self-start" style={{ fontSize: "14px" }}>
            Обсудить проект
          </a>
        </div>
      </div>
    </div>
  );
}
