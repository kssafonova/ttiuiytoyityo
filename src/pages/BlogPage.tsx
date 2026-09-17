import { useState } from "react";

const articles = [
  { slug: "hs-vs-fs", cat: "Сравнения", title: "HS-портал vs FS-портал: в чём разница и что выбрать для своего дома", date: "12 сентября 2025", read: "8 мин", desc: "Разбираем ключевые отличия двух систем — по ширине профиля, механике открывания, ценовому диапазону и сценариям применения.", tags: ["HS-портал", "FS-портал", "Выбор системы"] },
  { slug: "panoramic-winter", cat: "Технологии", title: "Можно ли остеклить дом панорамными окнами и при этом не замёрзнуть зимой?", date: "5 сентября 2025", read: "6 мин", desc: "Отвечаем на главный страх покупателей: разбираем теплопотери, Uf-значения и примеры реальных объектов в Подмосковье.", tags: ["Теплоизоляция", "Зима", "Технологии"] },
  { slug: "terrace-glazing", cat: "Проекты", title: "Как остеклить террасу: разбор 5 типовых сценариев с ценами", date: "28 августа 2025", read: "10 мин", desc: "Открытая, закрытая, комбинированная — каждый вариант имеет свою оптимальную систему. Рассказываем с примерами из наших объектов.", tags: ["Терраса", "Проекты", "Цены"] },
  { slug: "aluminum-facade", cat: "Технологии", title: "Алюминиевые фасады: холодные vs тёплые системы. Когда экономить не нужно", date: "19 августа 2025", read: "7 мин", desc: "Структурное остекление, вентилируемые и тёплые фасады — что скрывается за этими терминами и как не ошибиться с выбором.", tags: ["Алюминий", "Фасады"] },
  { slug: "install-guide", cat: "Инструкции", title: "Как правильно принять работу монтажников: чек-лист для заказчика", date: "10 августа 2025", read: "5 мин", desc: "12 пунктов, которые нужно проверить при приёмке остекления — что смотреть, как проверять прижим, откосы и ответственность.", tags: ["Монтаж", "Приёмка", "Инструкции"] },
  { slug: "rehau-schuco", cat: "Материалы", title: "Rehau vs SCHÜCO vs Salamander: честное сравнение профильных систем 2025", date: "2 августа 2025", read: "9 мин", desc: "Не реклама производителей — честный технический разбор по 8 критериям: геометрия камер, Uf, толщина стенок, доступность фурнитуры.", tags: ["Профиль", "Сравнение", "Материалы"] },
];

const cats = ["Все статьи", "Технологии", "Сравнения", "Проекты", "Инструкции", "Материалы"];

export default function BlogPage() {
  const [cat, setCat] = useState("Все статьи");
  const shown = cat === "Все статьи" ? articles : articles.filter((a) => a.cat === cat);

  return (
    <>
      <section className="section-pad bg-white" style={{ paddingTop: "clamp(80px,10vw,140px)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Блог</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <h1 className="f-mont text-[var(--dark)] leading-[1.05]" style={{ fontSize: "clamp(28px,4vw,56px)" }}>
              Статьи про остекление
            </h1>
            <p className="f-pop text-[var(--muted)] text-[14px] leading-[1.7]" style={{ maxWidth: 360 }}>
              Технические разборы, руководства покупателя и честные сравнения — без маркетинга.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-0 border border-[var(--border)] mb-10 w-fit">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="f-pop text-[12px] px-4 py-2 border-r border-[var(--border)] last:border-r-0 transition-colors"
                style={{
                  background: cat === c ? "var(--accent)" : "transparent",
                  color: cat === c ? "white" : "var(--dark)",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Featured article */}
          {cat === "Все статьи" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[var(--border)] mb-0 cursor-pointer hover:bg-[var(--light)] transition-colors group">
              <div className="bg-[var(--light)] relative" style={{ minHeight: 240 }}>
                <img
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=360&fit=crop&auto=format"
                  alt={articles[0].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <span className="absolute top-4 left-4 bg-[var(--accent)] text-white f-popm text-[10px] uppercase tracking-widest px-3 py-1">
                  {articles[0].cat}
                </span>
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex gap-4 mb-4">
                    <span className="f-pop text-[var(--muted)] text-[12px]">{articles[0].date}</span>
                    <span className="f-pop text-[var(--muted)] text-[12px]">{articles[0].read} чтения</span>
                  </div>
                  <h2 className="f-mont text-[var(--dark)] leading-[1.2] mb-4" style={{ fontSize: "clamp(18px,2vw,26px)" }}>
                    {articles[0].title}
                  </h2>
                  <p className="f-pop text-[var(--muted)] text-[14px] leading-[1.7]">{articles[0].desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {articles[0].tags.map((t) => (
                    <span key={t} className="f-pop text-[11px] text-[var(--muted)] border border-[var(--border)] px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Articles grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l ${cat === "Все статьи" ? "border-t-0 border border-[var(--border)]" : "border-t border-[var(--border)]"}`}>
            {(cat === "Все статьи" ? shown.slice(1) : shown).map((a) => (
              <div
                key={a.slug}
                className="border-b border-r border-[var(--border)] p-6 cursor-pointer hover:bg-[var(--light)] transition-colors group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="f-pop text-[10px] text-[var(--accent)] uppercase tracking-widest">{a.cat}</span>
                  <span className="f-pop text-[var(--muted)] text-[11px]">{a.read}</span>
                </div>
                <h3 className="f-pops text-[var(--dark)] text-[15px] leading-[1.4] mb-3 group-hover:text-[var(--accent)] transition-colors">
                  {a.title}
                </h3>
                <p className="f-pop text-[var(--muted)] text-[12px] leading-[1.6] mb-4">{a.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="f-pop text-[var(--muted)] text-[11px]">{a.date}</span>
                  <span className="f-pop text-[var(--accent)] text-[12px]">Читать →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="f-mont text-[var(--dark)] mb-2" style={{ fontSize: "clamp(20px,2.5vw,34px)" }}>Есть вопрос по остеклению?</h2>
            <p className="f-pop text-[var(--muted)] text-[14px]">Задайте — напишем развёрнутый ответ или статью</p>
          </div>
          <a href="mailto:blog@oknova.ru" className="btn-primary accent-btn shrink-0">Задать вопрос</a>
        </div>
      </section>
    </>
  );
}
