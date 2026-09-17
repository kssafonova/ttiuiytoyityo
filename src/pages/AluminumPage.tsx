export default function AluminumPage() {
  const systems = [
    { name: "Теплый алюминий", sub: "Серия WW72", desc: "Трёхкамерный профиль, тройной стеклопакет, Uf = 1.4 Вт/м²К. Для круглогодичного отопления.", specs: ["Uf 1.4 Вт/м²К", "до 3 000 мм высота", "RAL/ANODA"] },
    { name: "Холодное остекление", sub: "Серия CW65", desc: "Структурное остекление фасадов и кровель. Максимальный проём без видимых рам.", specs: ["Структурный фасад", "Неограниченный размер", "Стекло до 60 мм"] },
    { name: "Панорамные окна", sub: "Серия PW86", desc: "Одностворчатые панорамные окна для минималистских интерьеров. Профиль 86 мм, скрытые петли.", specs: ["Профиль 86 мм", "Скрытые петли", "Электропривод опция"] },
  ];
  return (
    <>
      <section className="section-pad bg-white" style={{ paddingTop: "clamp(80px,10vw,140px)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Алюминиевые системы</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <h1 className="f-mont text-[var(--dark)] leading-[1.05]" style={{ fontSize: "clamp(28px,4vw,56px)" }}>
              Алюминиевое панорамное<br />остекление
            </h1>
            <p className="f-pop text-[var(--muted)] text-[15px] leading-[1.7]" style={{ maxWidth: 380 }}>
              Алюминий — лёгкий, прочный, не требует обслуживания. Идеален для больших фасадов и архитектурных решений.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[var(--border)]">
            {systems.map((s) => (
              <div key={s.name} className="border-r border-[var(--border)] last:border-r-0">
                <div className="p-6 border-b border-[var(--border)]">
                  <p className="f-pops text-[var(--dark)] text-[17px] mb-0.5">{s.name}</p>
                  <p className="f-pop text-[var(--accent)] text-[12px]">{s.sub}</p>
                </div>
                <div className="bg-[var(--light)] flex items-center justify-center p-8" style={{ minHeight: 180 }}>
                  <img src="./assets/panoramic_window_preview.svg" alt={s.name} className="max-h-[140px] w-auto object-contain opacity-80" />
                </div>
                <div className="p-6">
                  <p className="f-pop text-[var(--muted)] text-[13px] leading-[1.6] mb-4">{s.desc}</p>
                  <ul className="flex flex-col gap-2">
                    {s.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-2">
                        <span className="text-[var(--accent)] text-[11px]">✓</span>
                        <span className="f-pop text-[var(--dark)] text-[12px]">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Применение</p>
          <h2 className="f-mont text-[var(--dark)] mb-10" style={{ fontSize: "clamp(22px,3vw,40px)" }}>Где применяется</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[var(--border)]">
            {["Частные дома", "Офисные фасады", "Пентхаусы", "Торговые центры"].map((u, i) => (
              <div key={u} className="p-6 border-r border-[var(--border)] last:border-r-0">
                <p className="f-montm text-[var(--accent)] text-[32px] mb-3">{String(i+1).padStart(2,"0")}</p>
                <p className="f-pops text-[var(--dark)] text-[15px]">{u}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[var(--dark)]">
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="f-mont text-white mb-2" style={{ fontSize: "clamp(22px,3vw,38px)" }}>Рассчитайте алюминиевое остекление</h2>
            <p className="f-pop text-white/50 text-[14px]">Проектируем и монтируем фасады от 2 000 м²</p>
          </div>
          <a href="tel:88005551234" className="btn-primary accent-btn shrink-0">8 (800) 555-12-34</a>
        </div>
      </section>
    </>
  );
}
