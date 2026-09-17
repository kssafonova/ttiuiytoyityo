import { useState } from "react";

type ModelId = "hs-portal" | "fs-portal" | "hst-fold" | "alu-facade";

const models: { id: ModelId; name: string; desc: string; badge: string; img: string }[] = [
  { id: "hs-portal",  name: "HS-портал",         badge: "Популярный", desc: "Раздвижная система HS: профиль 160 мм, пороговая рама, фурнитурная цепочка Roto.", img: "./assets/hs_portal_preview.svg" },
  { id: "fs-portal",  name: "FS-портал",         badge: "Минимализм", desc: "Поворотно-параллельная система FS: видимый профиль 45 мм, Uf = 1.2 Вт/м²К.",         img: "./assets/panoramic_window_preview.svg" },
  { id: "hst-fold",   name: "HST Складная",      badge: "Открытый дом", desc: "Складная гармошка HST: открывается на 95%, секции 1 200 мм, до 7 секций в ряд.",  img: "./assets/balcony_block_preview.svg" },
  { id: "alu-facade", name: "Алюминиевый фасад", badge: "Коммерция", desc: "Структурная система SL65: стойка-ригель, стекло до 60 мм, высота без ограничений.",   img: "./assets/hs_portal_preview.svg" },
];

const hotspots: Record<ModelId, { label: string; x: number; y: number; info: string }[]> = {
  "hs-portal": [
    { label: "Профиль", x: 30, y: 40, info: "ПВХ 160 мм, 5 камер. Uf = 1.3 Вт/м²К." },
    { label: "Фурнитура", x: 65, y: 55, info: "Roto NT Lift-Slide. Усилие открывания 10 Н." },
    { label: "Стеклопакет", x: 48, y: 30, info: "4/16Ar/4 или 4/16Ar/4/16Ar/4. Low-E покрытие." },
  ],
  "fs-portal": [
    { label: "Профиль", x: 25, y: 35, info: "Видимая ширина 45 мм. Скрытые петли." },
    { label: "Уплотнители", x: 70, y: 50, info: "3-контурное уплотнение EPDM." },
  ],
  "hst-fold": [
    { label: "Секция", x: 40, y: 30, info: "Ширина секции до 1 200 мм, высота до 2 600 мм." },
    { label: "Нижний порог", x: 50, y: 80, info: "Анодированный алюминий. Порог 12 мм." },
  ],
  "alu-facade": [
    { label: "Стойка", x: 20, y: 50, info: "65×150 мм, алюминий 6060 T5." },
    { label: "Ригель", x: 55, y: 40, info: "65×60 мм. Термически разделённый профиль." },
  ],
};

export default function Models3DPage() {
  const [active, setActive] = useState<ModelId>("hs-portal");
  const [tip, setTip] = useState<number | null>(null);
  const model = models.find((m) => m.id === active)!;
  const spots = hotspots[active];

  return (
    <>
      <section className="section-pad bg-white" style={{ paddingTop: "clamp(80px,10vw,140px)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">3D-модели</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <h1 className="f-mont text-[var(--dark)] leading-[1.05]" style={{ fontSize: "clamp(28px,4vw,56px)" }}>
              Интерактивный<br />просмотр систем
            </h1>
            <p className="f-pop text-[var(--muted)] text-[14px] leading-[1.7]" style={{ maxWidth: 360 }}>
              Изучите конструкцию каждой системы в деталях — кликайте по горячим точкам для описания узлов.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0 border border-[var(--border)]">
            {/* Model selector */}
            <div className="border-r border-[var(--border)]">
              {models.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setActive(m.id); setTip(null); }}
                  className="w-full p-5 border-b border-[var(--border)] text-left transition-colors"
                  style={{ background: active === m.id ? "var(--accent)" : "transparent" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="f-pops text-[14px]" style={{ color: active === m.id ? "white" : "var(--dark)" }}>{m.name}</p>
                    <span
                      className="f-pop text-[10px] uppercase tracking-widest px-1.5 py-0.5 shrink-0"
                      style={{ background: active === m.id ? "rgba(255,255,255,0.2)" : "var(--light)", color: active === m.id ? "white" : "var(--muted)" }}
                    >
                      {m.badge}
                    </span>
                  </div>
                  <p className="f-pop text-[11px] leading-[1.5] mt-1" style={{ color: active === m.id ? "rgba(255,255,255,0.7)" : "var(--muted)" }}>
                    {m.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* 3D viewer area */}
            <div className="relative bg-[var(--light)] flex items-center justify-center" style={{ minHeight: 420 }}>
              <img
                src={model.img}
                alt={model.name}
                className="max-h-[380px] max-w-full object-contain"
                style={{ padding: 24 }}
              />

              {/* Hotspots */}
              {spots.map((s, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  <button
                    onClick={() => setTip(tip === i ? null : i)}
                    className="circle size-7 bg-[var(--accent)] text-white f-popm text-[11px] flex items-center justify-center border-2 border-white shadow-lg hover:scale-110 transition-transform"
                  >
                    {i + 1}
                  </button>
                  {tip === i && (
                    <div
                      className="absolute z-10 bg-white border border-[var(--border)] p-3 shadow-lg"
                      style={{ minWidth: 180, top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" }}
                    >
                      <p className="f-pops text-[var(--dark)] text-[12px] mb-1">{s.label}</p>
                      <p className="f-pop text-[var(--muted)] text-[11px] leading-[1.5]">{s.info}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                {spots.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setTip(tip === i ? null : i)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left"
                  >
                    <span className="circle size-5 bg-[var(--accent)] text-white f-popm text-[10px] flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="f-pop text-[var(--dark)] text-[11px] bg-white/90 px-1">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Download button */}
              <div className="absolute top-4 right-4">
                <button className="btn-outline text-[12px] px-3 py-1.5 border border-[var(--border)] bg-white">
                  ↓ Скачать DWG
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-6">Архив чертежей</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-[var(--border)]">
            {[
              { name: "HS-портал — монтажный узел",  ext: "DWG",  size: "1.2 МБ" },
              { name: "FS-портал — разрез",           ext: "DWG",  size: "980 КБ" },
              { name: "HST складная — план монтажа",  ext: "PDF",  size: "3.4 МБ" },
              { name: "Алюминиевый фасад SL65",       ext: "STEP", size: "8.1 МБ" },
            ].map((f) => (
              <div key={f.name} className="border-b border-r border-[var(--border)] p-5 flex flex-col gap-3 hover:bg-white transition-colors cursor-pointer group">
                <div className="size-10 bg-[var(--accent)]/10 flex items-center justify-center">
                  <span className="f-montm text-[var(--accent)] text-[10px] uppercase">{f.ext}</span>
                </div>
                <div>
                  <p className="f-pops text-[var(--dark)] text-[13px] leading-[1.3] group-hover:text-[var(--accent)] transition-colors">{f.name}</p>
                  <p className="f-pop text-[var(--muted)] text-[11px] mt-0.5">{f.size}</p>
                </div>
                <span className="f-pop text-[var(--accent)] text-[12px] mt-auto">↓ Скачать</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
