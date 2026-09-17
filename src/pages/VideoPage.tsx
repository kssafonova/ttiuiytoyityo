import { useState } from "react";

const videos = [
  { id: "v1", cat: "Монтаж", title: "Монтаж HS-портала 5 метров — от замера до регулировки", dur: "14:32", views: "12 тыс.", thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=480&h=270&fit=crop&auto=format" },
  { id: "v2", cat: "Обзор", title: "FS-портал: узкий профиль 45 мм — полный разбор системы", dur: "8:10", views: "8.4 тыс.", thumb: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=480&h=270&fit=crop&auto=format" },
  { id: "v3", cat: "Производство", title: "Экскурсия по заводу OKNOVA — как производится HS-портал", dur: "11:45", views: "21 тыс.", thumb: "https://images.unsplash.com/photo-1565793979399-5d8997c33c55?w=480&h=270&fit=crop&auto=format" },
  { id: "v4", cat: "Объект", title: "Дом на Новорижском: HS 6м + алюминиевая кровля — итоговый результат", dur: "6:20", views: "15 тыс.", thumb: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=480&h=270&fit=crop&auto=format" },
  { id: "v5", cat: "Сравнение", title: "Раздвижные vs складные системы — что лучше для летней кухни?", dur: "9:55", views: "6.1 тыс.", thumb: "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=480&h=270&fit=crop&auto=format" },
  { id: "v6", cat: "Инструкции", title: "Как правильно ухаживать за раздвижной системой и фурнитурой Roto", dur: "4:38", views: "3.9 тыс.", thumb: "https://images.unsplash.com/photo-1609942072337-c3370e820005?w=480&h=270&fit=crop&auto=format" },
];

const cats = ["Все", "Монтаж", "Обзор", "Производство", "Объект", "Сравнение", "Инструкции"];

export default function VideoPage() {
  const [cat, setCat] = useState("Все");
  const [active, setActive] = useState<string | null>(null);
  const shown = cat === "Все" ? videos : videos.filter((v) => v.cat === cat);
  const activeVid = active ? videos.find((v) => v.id === active) : null;

  return (
    <>
      <section className="section-pad bg-white" style={{ paddingTop: "clamp(80px,10vw,140px)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Видеоконтент</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <h1 className="f-mont text-[var(--dark)] leading-[1.05]" style={{ fontSize: "clamp(28px,4vw,56px)" }}>
              Видео об OKNOVA
            </h1>
            <p className="f-pop text-[var(--muted)] text-[14px] leading-[1.7]" style={{ maxWidth: 360 }}>
              Монтажи, обзоры систем, производство и готовые объекты — 30+ видео в нашем канале.
            </p>
          </div>

          {/* Cat filter */}
          <div className="flex flex-wrap gap-0 border border-[var(--border)] mb-10 w-fit">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="f-pop text-[12px] px-4 py-2 border-r border-[var(--border)] last:border-r-0 transition-colors"
                style={{ background: cat === c ? "var(--accent)" : "transparent", color: cat === c ? "white" : "var(--dark)" }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Active video modal */}
          {activeVid && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6" onClick={() => setActive(null)}>
              <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
                  <img src={activeVid.thumb} alt={activeVid.title} className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="f-mont text-white text-[14px] px-4 py-2 border border-white/40">Видео ▶</span>
                  </div>
                </div>
                <div className="bg-white p-5">
                  <p className="f-pops text-[var(--dark)] text-[15px] mb-1">{activeVid.title}</p>
                  <div className="flex gap-4">
                    <span className="f-pop text-[var(--muted)] text-[12px]">{activeVid.dur}</span>
                    <span className="f-pop text-[var(--muted)] text-[12px]">{activeVid.views} просмотров</span>
                    <span className="f-pop text-[var(--accent)] text-[11px] uppercase tracking-widest">{activeVid.cat}</span>
                  </div>
                </div>
                <button onClick={() => setActive(null)} className="mt-3 f-pop text-white/60 text-[13px] hover:text-white">✕ Закрыть</button>
              </div>
            </div>
          )}

          {/* Videos grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[var(--border)]">
            {shown.map((v) => (
              <div
                key={v.id}
                onClick={() => setActive(v.id)}
                className="border-b border-r border-[var(--border)] cursor-pointer group"
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <img src={v.thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="size-12 border-2 border-white flex items-center justify-center">
                      <span className="text-white text-[16px] ml-0.5">▶</span>
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white f-pop text-[11px] px-2 py-0.5">{v.dur}</span>
                  <span className="absolute top-3 left-3 bg-[var(--accent)] text-white f-pop text-[10px] uppercase tracking-widest px-2 py-0.5">{v.cat}</span>
                </div>
                <div className="p-4">
                  <p className="f-pops text-[var(--dark)] text-[13px] leading-[1.4] mb-1 group-hover:text-[var(--accent)] transition-colors">{v.title}</p>
                  <p className="f-pop text-[var(--muted)] text-[11px]">{v.views} просмотров</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[var(--dark)]">
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="f-mont text-white mb-2" style={{ fontSize: "clamp(20px,2.5vw,34px)" }}>Подпишитесь на YouTube-канал</h2>
            <p className="f-pop text-white/50 text-[14px]">Новые видео каждую неделю: монтажи, объекты, советы</p>
          </div>
          <a href="#" className="btn-outline !text-white !border-white/40 shrink-0">YouTube → OKNOVA</a>
        </div>
      </section>
    </>
  );
}
