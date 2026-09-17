export default function ProductionPage() {
  const stages = [
    { n: "01", title: "Раскрой профиля",      desc: "Прецизионная резка алюминиевого и ПВХ-профиля на автоматических пилах с точностью ±0.1 мм." },
    { n: "02", title: "Сварка/сборка рамы",   desc: "Сварочные аппараты URBAN и Sturtz. Угловое соединение профилей без видимых швов." },
    { n: "03", title: "Установка фурнитуры",   desc: "Ручная сборка фурнитурных цепочек Roto, MACO, Siegenia. Проверка усилий открывания." },
    { n: "04", title: "Стеклопакет",           desc: "Производство стеклопакетов in-house. Контроль камер дистанционным рамками Warm Edge." },
    { n: "05", title: "Контроль качества",     desc: "Каждая система проходит контрольную сборку и проверку герметичности на испытательном стенде." },
    { n: "06", title: "Упаковка и отправка",   desc: "Профессиональная упаковка с пенозащитой. Доставка по Москве и МО собственным транспортом." },
  ];

  return (
    <>
      <section className="section-pad bg-white" style={{ paddingTop: "clamp(80px,10vw,140px)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Производство</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <h1 className="f-mont text-[var(--dark)] leading-[1.05]" style={{ fontSize: "clamp(28px,4vw,56px)" }}>
              Собственный завод<br />в Подмосковье
            </h1>
            <div className="flex flex-col gap-2">
              {[["4 200 м²", "площадь"], ["6", "производственных линий"], ["48", "часов — цикл от запуска до упаковки"]].map(([v, l]) => (
                <div key={l} className="flex items-center gap-3">
                  <span className="f-montm text-[var(--accent)] text-[18px] w-20">{v}</span>
                  <span className="f-pop text-[var(--muted)] text-[13px]">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[var(--border)] mb-14">
            <div className="relative bg-[var(--light)]" style={{ aspectRatio: "16/9" }}>
              <img
                src="https://images.unsplash.com/photo-1565793979399-5d8997c33c55?w=800&h=450&fit=crop&auto=format"
                alt="Производство OKNOVA"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <p className="f-pop text-[var(--dark)] text-[15px] leading-[1.8] mb-4">
                Завод был построен в 2018 году и расширен в 2020-м. Сегодня здесь работают
                42 сотрудника: конструкторы, технологи, операторы станков и монтажники.
              </p>
              <p className="f-pop text-[var(--muted)] text-[14px] leading-[1.8]">
                Всё оборудование — европейское: пилы URBAN, сварочные аппараты Sturtz,
                стеклопакетные линии LiSEC. Точность резки — 0.1 мм.
                Это не рекламный текст — это инженерные допуски.
              </p>
            </div>
          </div>

          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-8">Производственный цикл</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[var(--border)]">
            {stages.map((s) => (
              <div key={s.n} className="border-b border-r border-[var(--border)] p-6">
                <p className="f-montm text-[var(--accent)] text-[32px] leading-none mb-4 opacity-40">{s.n}</p>
                <h3 className="f-pops text-[var(--dark)] text-[15px] mb-2">{s.title}</h3>
                <p className="f-pop text-[var(--muted)] text-[13px] leading-[1.6]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-8">Сертификаты</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-l border-[var(--border)]">
            {["Rehau Partner", "SCHÜCO Certified", "ISO 9001:2015", "ГОСТ Р 56928"].map((cert) => (
              <div key={cert} className="border-b border-r border-[var(--border)] p-6 text-center">
                <div className="size-12 bg-[var(--accent)]/10 flex items-center justify-center mb-3 mx-auto">
                  <span className="text-[var(--accent)] text-[18px]">✓</span>
                </div>
                <p className="f-popm text-[var(--dark)] text-[13px]">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
