import { useState } from "react";

type Scenario = "terrace" | "veranda" | "aluminum" | "facade";
type System    = "hs" | "fs" | "psk" | "alu";
type Glass     = "double" | "triple" | "triplex";
type Profile   = "white" | "graphite" | "ral" | "anoda";

const scenarios: { id: Scenario; label: string; desc: string }[] = [
  { id: "terrace", label: "Выход на террасу",        desc: "Ежедневное использование, тёплый контур" },
  { id: "veranda", label: "Остекление веранды",       desc: "Сезонное или круглогодичное" },
  { id: "aluminum",label: "Алюминиевые панорамные",   desc: "Минимализм и архитектурное решение" },
  { id: "facade",  label: "Фасад / кровля",           desc: "Структурное или холодное остекление" },
];

const systemsByScenario: Record<Scenario, System[]> = {
  terrace:  ["hs", "fs"],
  veranda:  ["hs", "fs", "psk"],
  aluminum: ["alu"],
  facade:   ["alu", "hs"],
};

const systemInfo: Record<System, { name: string; sub: string; baseMin: number; baseMax: number }> = {
  hs:  { name: "HS-портал",          sub: "Подъёмно-раздвижная",    baseMin: 180_000, baseMax: 230_000 },
  fs:  { name: "FS-портал",          sub: "Поворотно-сдвижная",     baseMin: 160_000, baseMax: 200_000 },
  psk: { name: "PSK-портал",         sub: "Откидно-раздвижная",     baseMin: 120_000, baseMax: 160_000 },
  alu: { name: "Алюминиевая система", sub: "Холодное / тёплое",     baseMin: 90_000,  baseMax: 130_000 },
};

const glassMult: Record<Glass, number>   = { double: 1.0, triple: 1.18, triplex: 1.28 };
const profileMult: Record<Profile, number> = { white: 1.0, graphite: 1.05, ral: 1.12, anoda: 1.15 };

type SectionConfig = {
  id: string;
  system: System;
  width: number;
  height: number;
  glass: Glass;
  profile: Profile;
  hasThreshold: boolean;
  hasAutomation: boolean;
};

function newSection(id: string, system: System): SectionConfig {
  return { id, system, width: 3000, height: 2400, glass: "triple", profile: "graphite", hasThreshold: false, hasAutomation: false };
}

export default function CalculatorPage() {
  const [scenario, setScenario] = useState<Scenario>("terrace");
  const [sections, setSections]  = useState<SectionConfig[]>([newSection("1", "hs")]);

  const addSection = () => {
    const avail = systemsByScenario[scenario];
    setSections((prev) => [...prev, newSection(String(Date.now()), avail[0])]);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSection = <K extends keyof SectionConfig>(id: string, key: K, val: SectionConfig[K]) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, [key]: val } : s));
  };

  const calcSection = (s: SectionConfig) => {
    const info  = systemInfo[s.system];
    const area  = (s.width / 1000) * (s.height / 1000);
    const gm    = glassMult[s.glass];
    const pm    = profileMult[s.profile];
    const extra = (s.hasThreshold ? 25_000 : 0) + (s.hasAutomation ? 85_000 : 0);
    const min   = Math.round(area * info.baseMin * gm * pm / 10000) * 10000 + extra;
    const max   = Math.round(area * info.baseMax * gm * pm / 10000) * 10000 + extra;
    return { min, max, area };
  };

  const totals = sections.map(calcSection);
  const totalMin = totals.reduce((a, t) => a + t.min, 0);
  const totalMax = totals.reduce((a, t) => a + t.max, 0);
  const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

  // Reset sections when scenario changes
  const handleScenario = (s: Scenario) => {
    setScenario(s);
    const avail = systemsByScenario[s];
    setSections([newSection("1", avail[0])]);
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="section-pad bg-[var(--dark)]" style={{ paddingTop: "clamp(80px,10vw,140px)" }}>
        <div className="container">
          <p className="f-popm text-white/40 text-[11px] uppercase tracking-[0.28em] mb-5">Онлайн-калькулятор</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1 className="f-mont text-white leading-[1.05]" style={{ fontSize: "clamp(30px,4.5vw,60px)" }}>
              Рассчитайте стоимость<br />остекления
            </h1>
            <p className="f-pop text-white/50 text-[15px] leading-[1.6]" style={{ maxWidth: 380 }}>
              Выберите сценарий, добавьте конструкции и получите предварительный бюджет.
              Точный расчёт — после выезда инженера.
            </p>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR BODY ───────────────────────────── */}
      <section className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">

            {/* LEFT: Config */}
            <div className="flex flex-col gap-6">

              {/* STEP 1: Scenario */}
              <div className="bg-white border border-[var(--border)] p-6">
                <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-4">
                  <span className="text-[var(--accent)]">01</span> &nbsp; Сценарий использования
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleScenario(s.id)}
                      className="flex flex-col items-start p-4 border text-left transition-all"
                      style={{
                        borderColor: scenario === s.id ? "var(--accent)" : "var(--border)",
                        background:  scenario === s.id ? "var(--accent)/8" : "transparent",
                      }}
                    >
                      <span className={`f-pops text-[14px] mb-1 ${scenario === s.id ? "text-[var(--accent)]" : "text-[var(--dark)]"}`}>{s.label}</span>
                      <span className="f-pop text-[var(--muted)] text-[12px]">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: Sections */}
              <div className="bg-white border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-5">
                  <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em]">
                    <span className="text-[var(--accent)]">02</span> &nbsp; Конструкции
                  </p>
                  <button onClick={addSection} className="btn-outline text-[12px]" style={{ padding: "7px 14px" }}>
                    + Добавить конструкцию
                  </button>
                </div>

                <div className="flex flex-col gap-5">
                  {sections.map((sec, idx) => {
                    const avail = systemsByScenario[scenario];
                    const cost  = calcSection(sec);
                    return (
                      <div key={sec.id} className="border border-[var(--border)]">
                        {/* Section header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--light)]">
                          <span className="f-popm text-[var(--dark)] text-[13px]">Конструкция {idx + 1}</span>
                          <div className="flex items-center gap-3">
                            <span className="f-pop text-[var(--muted)] text-[12px]">{fmt(cost.min)} — {fmt(cost.max)}</span>
                            {sections.length > 1 && (
                              <button onClick={() => removeSection(sec.id)} className="f-pop text-[var(--muted)] hover:text-red-500 text-[20px] leading-none transition-colors">×</button>
                            )}
                          </div>
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* System selector */}
                          <div>
                            <label className="f-popm text-[var(--dark)] text-[12px] uppercase tracking-wider mb-2 block">Система</label>
                            <div className="flex flex-col gap-1.5">
                              {avail.map((sys) => (
                                <button
                                  key={sys}
                                  onClick={() => updateSection(sec.id, "system", sys)}
                                  className="flex items-center gap-2 px-3 py-2.5 border text-left transition-all"
                                  style={{
                                    borderColor: sec.system === sys ? "var(--accent)" : "var(--border)",
                                    background:  sec.system === sys ? "rgba(107,82,240,0.05)" : "transparent",
                                  }}
                                >
                                  <div
                                    className="size-3 border shrink-0 transition-all circle"
                                    style={{
                                      borderColor:    sec.system === sys ? "var(--accent)" : "var(--border)",
                                      background:     sec.system === sys ? "var(--accent)" : "transparent",
                                    }}
                                  />
                                  <div>
                                    <span className="f-popm text-[13px] text-[var(--dark)]">{systemInfo[sys].name}</span>
                                    <span className="f-pop text-[11px] text-[var(--muted)] ml-2">{systemInfo[sys].sub}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Dimensions */}
                          <div className="flex flex-col gap-4">
                            <div>
                              <div className="flex justify-between mb-1.5">
                                <label className="f-popm text-[12px] text-[var(--dark)] uppercase tracking-wider">Ширина</label>
                                <span className="f-montm text-[var(--accent)] text-[14px]">{(sec.width/1000).toFixed(1)} м</span>
                              </div>
                              <input type="range" min={1000} max={6000} step={100} value={sec.width}
                                onChange={(e) => updateSection(sec.id, "width", +e.target.value)}
                                className="w-full h-1 cursor-pointer" style={{ accentColor: "var(--accent)" }} />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1.5">
                                <label className="f-popm text-[12px] text-[var(--dark)] uppercase tracking-wider">Высота</label>
                                <span className="f-montm text-[var(--accent)] text-[14px]">{(sec.height/1000).toFixed(1)} м</span>
                              </div>
                              <input type="range" min={1500} max={3500} step={100} value={sec.height}
                                onChange={(e) => updateSection(sec.id, "height", +e.target.value)}
                                className="w-full h-1 cursor-pointer" style={{ accentColor: "var(--accent)" }} />
                            </div>
                          </div>

                          {/* Glass */}
                          <div>
                            <label className="f-popm text-[var(--dark)] text-[12px] uppercase tracking-wider mb-2 block">Стеклопакет</label>
                            <div className="flex flex-col gap-1.5">
                              {([["double","Двухкамерный","Базовый"], ["triple","Трёхкамерный","Тёплый контур +18%"], ["triplex","Триплекс","Ударостойкий +28%"]] as const).map(([id, l, s]) => (
                                <button key={id} onClick={() => updateSection(sec.id, "glass", id)}
                                  className="flex justify-between items-center px-3 py-2 border text-left transition-all"
                                  style={{ borderColor: sec.glass === id ? "var(--accent)" : "var(--border)", background: sec.glass === id ? "rgba(107,82,240,0.05)" : "transparent" }}>
                                  <span className="f-popm text-[var(--dark)] text-[12px]">{l}</span>
                                  <span className="f-pop text-[var(--muted)] text-[11px]">{s}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Profile color */}
                          <div>
                            <label className="f-popm text-[var(--dark)] text-[12px] uppercase tracking-wider mb-2 block">Цвет профиля</label>
                            <div className="flex flex-col gap-1.5">
                              {([["white","Белый RAL 9016","Стандарт"], ["graphite","Графит RAL 7016","+5%"], ["ral","Любой RAL","+12%"], ["anoda","Анодирование","+15%"]] as const).map(([id, l, s]) => (
                                <button key={id} onClick={() => updateSection(sec.id, "profile", id)}
                                  className="flex justify-between items-center px-3 py-2 border text-left transition-all"
                                  style={{ borderColor: sec.profile === id ? "var(--accent)" : "var(--border)", background: sec.profile === id ? "rgba(107,82,240,0.05)" : "transparent" }}>
                                  <span className="f-popm text-[var(--dark)] text-[12px]">{l}</span>
                                  <span className="f-pop text-[var(--muted)] text-[11px]">{s}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Options */}
                          <div className="md:col-span-2 flex flex-wrap gap-3">
                            <button
                              onClick={() => updateSection(sec.id, "hasThreshold", !sec.hasThreshold)}
                              className="flex items-center gap-2 px-4 py-2.5 border transition-all"
                              style={{ borderColor: sec.hasThreshold ? "var(--accent)" : "var(--border)", background: sec.hasThreshold ? "rgba(107,82,240,0.08)" : "transparent" }}
                            >
                              <span className={`f-popm text-[13px] ${sec.hasThreshold ? "text-[var(--accent)]" : "text-[var(--dark)]"}`}>Порог в уровень пола</span>
                              <span className="f-pop text-[var(--muted)] text-[11px]">+25 000 ₽</span>
                            </button>
                            <button
                              onClick={() => updateSection(sec.id, "hasAutomation", !sec.hasAutomation)}
                              className="flex items-center gap-2 px-4 py-2.5 border transition-all"
                              style={{ borderColor: sec.hasAutomation ? "var(--accent)" : "var(--border)", background: sec.hasAutomation ? "rgba(107,82,240,0.08)" : "transparent" }}
                            >
                              <span className={`f-popm text-[13px] ${sec.hasAutomation ? "text-[var(--accent)]" : "text-[var(--dark)]"}`}>Автоматика</span>
                              <span className="f-pop text-[var(--muted)] text-[11px]">+85 000 ₽</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: Summary */}
            <div className="sticky top-[80px]">
              <div className="bg-white border border-[var(--border)]">
                <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--dark)]">
                  <p className="f-popm text-white/40 text-[11px] uppercase tracking-[0.28em] mb-3">Итог по проекту</p>
                  <p className="f-montm text-white text-[32px] leading-none">от {fmt(totalMin)}</p>
                  <p className="f-pop text-white/50 text-[14px] mt-1">до {fmt(totalMax)}</p>
                </div>

                <div className="p-6 border-b border-[var(--border)]">
                  {sections.map((s, i) => {
                    const c = calcSection(s);
                    return (
                      <div key={s.id} className="flex justify-between items-start py-2.5 border-b border-[var(--border)] last:border-b-0">
                        <div>
                          <p className="f-popm text-[var(--dark)] text-[13px]">
                            Конструкция {i+1} — {systemInfo[s.system].name}
                          </p>
                          <p className="f-pop text-[var(--muted)] text-[11px]">
                            {(s.width/1000).toFixed(1)} × {(s.height/1000).toFixed(1)} м · {c.area.toFixed(2)} м²
                          </p>
                        </div>
                        <p className="f-popm text-[var(--dark)] text-[13px] shrink-0 ml-3">{fmt(c.min)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 flex flex-col gap-3">
                  <div className="bg-[var(--light)] p-4 border border-[var(--border)]">
                    <p className="f-pop text-[var(--muted)] text-[12px] leading-[1.5]">
                      Расчёт ориентировочный. Финальная цена — после выезда инженера и согласования спецификации.
                    </p>
                  </div>
                  <button className="btn-primary accent-btn w-full">Обсудить с инженером</button>
                  <a href="tel:88005551234" className="btn-outline w-full text-center" style={{ display: "flex", justifyContent: "center" }}>
                    8 (800) 555-12-34
                  </a>
                  <p className="f-pop text-[var(--muted)] text-[11px] text-center">Бесплатный звонок · Ответим за 2 часа</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
