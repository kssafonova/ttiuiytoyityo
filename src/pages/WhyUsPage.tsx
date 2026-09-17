const reasons = [
  { n: "01", title: "Собственное производство",     desc: "Завод площадью 4 200 м² в Подмосковье. Полный цикл от профиля до готовой системы. Контроль качества на каждом этапе без посредников." },
  { n: "02", title: "Конструкторское бюро в штате", desc: "5 инженеров-конструкторов. Для каждого объекта — отдельный проект, расчёт нагрузок, согласование узлов. Не продаём «из каталога»." },
  { n: "03", title: "Монтажники — штатные",         desc: "Не субподряд. Монтажная бригада в штате — они знают системы изнутри, несут ответственность за результат." },
  { n: "04", title: "10 лет гарантии",               desc: "На профиль, стеклопакет, фурнитуру и монтажные узлы. Бесплатная регулировка в гарантийный период." },
  { n: "05", title: "48 часов на КП",               desc: "Замер + коммерческое предложение за двое суток. Работаем без волокиты — ценим ваше время." },
  { n: "06", title: "Немецкие профильные системы",   desc: "Работаем с Rehau, Salamander, SCHÜCO, KBE. Сертифицированный монтаж с сохранением гарантии производителя." },
];

const compare = [
  { param: "Собственное производство",     oknova: true,  others: false },
  { param: "Инженерный проект для объекта", oknova: true,  others: false },
  { param: "Штатный монтаж",               oknova: true,  others: false },
  { param: "Гарантия 10 лет",              oknova: true,  others: false },
  { param: "КП за 48 часов",              oknova: true,  others: false },
  { param: "Сертификат Rehau/SCHÜCO",     oknova: true,  others: true  },
];

export default function WhyUsPage() {
  return (
    <>
      <section className="section-pad bg-white" style={{ paddingTop: "clamp(80px,10vw,140px)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Преимущества</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <h1 className="f-mont text-[var(--dark)] leading-[1.05]" style={{ fontSize: "clamp(28px,4vw,56px)" }}>
              Почему именно OKNOVA
            </h1>
            <p className="f-pop text-[var(--muted)] text-[15px] leading-[1.7]" style={{ maxWidth: 380 }}>
              Мы не торговая компания с каталогом. Мы инженерная компания, которая проектирует, производит и монтирует.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[var(--border)]">
            {reasons.map((r) => (
              <div key={r.n} className="border-b border-r border-[var(--border)] p-8 hover:bg-[var(--light)] transition-colors group">
                <p className="f-montm text-[var(--accent)] text-[40px] leading-none mb-4 opacity-30 group-hover:opacity-100 transition-opacity">{r.n}</p>
                <h3 className="f-pops text-[var(--dark)] mb-3" style={{ fontSize: "clamp(15px,1.5vw,18px)" }}>{r.title}</h3>
                <p className="f-pop text-[var(--muted)] text-[13px] leading-[1.7]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Сравнение</p>
          <h2 className="f-mont text-[var(--dark)] mb-8" style={{ fontSize: "clamp(22px,3vw,40px)" }}>OKNOVA vs остальные</h2>
          <div className="border border-[var(--border)] bg-white">
            <div className="grid grid-cols-3 border-b border-[var(--border)] bg-[var(--dark)]">
              <div className="p-4"><span className="f-popm text-white/40 text-[11px] uppercase tracking-widest">Параметр</span></div>
              <div className="p-4 text-center"><span className="f-popm text-[var(--accent)] text-[13px]">OKNOVA</span></div>
              <div className="p-4 text-center"><span className="f-pop text-white/40 text-[13px]">Другие компании</span></div>
            </div>
            {compare.map((row, i) => (
              <div key={row.param} className="grid grid-cols-3 border-b border-[var(--border)] last:border-b-0" style={{ background: i % 2 === 0 ? "white" : "var(--light)" }}>
                <div className="p-4 border-r border-[var(--border)]">
                  <span className="f-popm text-[var(--dark)] text-[13px]">{row.param}</span>
                </div>
                <div className="p-4 border-r border-[var(--border)] text-center">
                  <span className={`text-[18px] ${row.oknova ? "text-[var(--accent)]" : "text-red-400"}`}>{row.oknova ? "✓" : "✗"}</span>
                </div>
                <div className="p-4 text-center">
                  <span className={`text-[18px] ${row.others ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>{row.others ? "✓" : "—"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
