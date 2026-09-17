import { useState } from "react";

const reviews = [
  { name: "Александр М.", loc: "Рублёвка", date: "Март 2025", stars: 5, system: "HS-портал 5м", text: "Устанавливали HS-портал 5 метров в гостиную. Работа безупречная, срок выдержали, инженер был на связи весь процесс. Открывается одним пальцем — ребёнок в восторге." },
  { name: "Ирина К.",    loc: "Новорижское", date: "Февраль 2025", stars: 5, system: "HS 4.2м + FS 3м", text: "Сделали HS-портал и FS-окно в спальню. Очень тихо, зимой не дует, конденсата нет. Уже второй объект с OKNOVA — стабильно отличный результат." },
  { name: "Дмитрий Л.",  loc: "Истра", date: "Январь 2025", stars: 5, system: "Складная HST 6м", text: "Хотел открыть весь дом к лесу. Сделали складную систему на 6 метров — проём открывается на 95%. Монтировали 2 дня, всё убрали за собой. Отдельная благодарность Андрею — замечательный специалист." },
  { name: "Мария В.",    loc: "Барвиха", date: "Декабрь 2024", stars: 5, system: "HS 3.6м", text: "Выбирала долго — смотрела 5 компаний. OKNOVA понравились тем, что сразу дали инженерный чертёж, объяснили каждый узел. Результат превзошёл ожидания." },
  { name: "Сергей Н.",   loc: "Сколково", date: "Ноябрь 2024", stars: 4, system: "FS-портал 4м", text: "Отличная система, узкий профиль именно то, что нужно для современного дома. Небольшая задержка в производстве, но предупредили заранее. В итоге всё сделали хорошо." },
  { name: "Ольга Т.",    loc: "Клин", date: "Октябрь 2024", stars: 5, system: "Алюминиевая кровля", text: "Стеклянная кровля над верандой — мечта. Не верила, что можно сделать без протечек. OKNOVA справились, уже пережили зиму — всё идеально." },
];

const stats = [
  { val: "4.9★", label: "средняя оценка" },
  { val: "200+", label: "реализованных проектов" },
  { val: "98%", label: "клиентов рекомендуют нас" },
  { val: "0", label: "гарантийных отказов" },
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState<number | null>(null);
  const shown = filter ? reviews.filter((r) => r.stars === filter) : reviews;

  return (
    <>
      <section className="section-pad bg-white" style={{ paddingTop: "clamp(80px,10vw,140px)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Отзывы клиентов</p>
          <h1 className="f-mont text-[var(--dark)] leading-[1.05] mb-12" style={{ fontSize: "clamp(28px,4vw,56px)" }}>
            Что говорят наши клиенты
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 border border-[var(--border)] mb-12">
            {stats.map((s) => (
              <div key={s.label} className="p-6 border-r border-[var(--border)] last:border-r-0 text-center">
                <p className="f-montm text-[var(--accent)] mb-1" style={{ fontSize: "clamp(24px,3vw,40px)" }}>{s.val}</p>
                <p className="f-pop text-[var(--muted)] text-[12px]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-8">
            <button onClick={() => setFilter(null)} className="f-pop text-[13px] px-4 py-2 border transition-all"
              style={{ borderColor: !filter ? "var(--accent)" : "var(--border)", background: !filter ? "var(--accent)" : "transparent", color: !filter ? "white" : "var(--dark)" }}>
              Все отзывы
            </button>
            {[5, 4].map((n) => (
              <button key={n} onClick={() => setFilter(n)} className="f-pop text-[13px] px-4 py-2 border transition-all"
                style={{ borderColor: filter === n ? "var(--accent)" : "var(--border)", background: filter === n ? "var(--accent)" : "transparent", color: filter === n ? "white" : "var(--dark)" }}>
                {"★".repeat(n)} {n}
              </button>
            ))}
          </div>

          {/* Reviews grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[var(--border)]">
            {shown.map((r) => (
              <div key={r.name + r.date} className="border-b border-r border-[var(--border)] p-6 hover:bg-[var(--light)] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="f-pops text-[var(--dark)] text-[15px]">{r.name}</p>
                    <p className="f-pop text-[var(--muted)] text-[12px]">{r.loc} · {r.date}</p>
                  </div>
                  <span className="text-[var(--accent)] text-[13px]">{"★".repeat(r.stars)}</span>
                </div>
                <p className="f-pop text-[var(--dark)] text-[13px] leading-[1.7] mb-3">"{r.text}"</p>
                <span className="f-pop text-[11px] text-[var(--muted)] border border-[var(--border)] px-2 py-0.5">{r.system}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[var(--dark)]">
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="f-mont text-white mb-2" style={{ fontSize: "clamp(22px,3vw,38px)" }}>Станьте следующим довольным клиентом</h2>
            <p className="f-pop text-white/50 text-[14px]">Бесплатный выезд инженера по Москве и МО</p>
          </div>
          <a href="tel:88005551234" className="btn-primary accent-btn shrink-0">Рассчитать проект</a>
        </div>
      </section>
    </>
  );
}
