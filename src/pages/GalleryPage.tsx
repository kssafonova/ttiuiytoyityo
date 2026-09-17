import { useState } from "react";

const photos = [
  { id: "g1",  cat: "HS-портал",  title: "HS 5м — Рублёвка",          size: "wide",  src: "./assets/hs_portal_preview.svg" },
  { id: "g2",  cat: "HS-портал",  title: "HS — детальный вид профиля", size: "tall",  src: "./assets/panoramic_window_preview.svg" },
  { id: "g3",  cat: "Складные",   title: "HST-система — открытое",     size: "wide",  src: "./assets/balcony_block_preview.svg" },
  { id: "g4",  cat: "Складные",   title: "HST — сбоку открытый проём", size: "norm",  src: "./assets/balcony_block_preview.svg" },
  { id: "g5",  cat: "HS-портал",  title: "HS — сбоку закрытый",        size: "norm",  src: "./assets/hs_portal_preview.svg" },
  { id: "g6",  cat: "Интерьер",   title: "Панорамная гостиная",        size: "wide",  src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=500&fit=crop&auto=format" },
  { id: "g7",  cat: "Фасад",      title: "Алюминиевый фасад — офис",   size: "tall",  src: "https://images.unsplash.com/photo-1565793979399-5d8997c33c55?w=500&h=700&fit=crop&auto=format" },
  { id: "g8",  cat: "Интерьер",   title: "Терраса с HST 6м",           size: "norm",  src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&auto=format" },
  { id: "g9",  cat: "Фасад",      title: "Панорамные окна — пентхаус", size: "wide",  src: "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=800&h=500&fit=crop&auto=format" },
  { id: "g10", cat: "Производство","title": "Линия сборки",            size: "norm",  src: "https://images.unsplash.com/photo-1609942072337-c3370e820005?w=600&h=400&fit=crop&auto=format" },
  { id: "g11", cat: "Интерьер",   title: "Световой двор — FS",         size: "norm",  src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format" },
  { id: "g12", cat: "Производство","title": "Контроль качества стеклопакета", size: "tall", src: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=700&fit=crop&auto=format" },
];

const cats = ["Все", "HS-портал", "Складные", "Интерьер", "Фасад", "Производство"];

export default function GalleryPage() {
  const [cat, setCat] = useState("Все");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const shown = cat === "Все" ? photos : photos.filter((p) => p.cat === cat);
  const lbPhoto = lightbox ? photos.find((p) => p.id === lightbox) : null;

  return (
    <>
      <section className="section-pad bg-white" style={{ paddingTop: "clamp(80px,10vw,140px)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">Галерея</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <h1 className="f-mont text-[var(--dark)] leading-[1.05]" style={{ fontSize: "clamp(28px,4vw,56px)" }}>
              Фотографии<br />наших объектов
            </h1>
            <p className="f-pop text-[var(--muted)] text-[14px] leading-[1.7]" style={{ maxWidth: 360 }}>
              200+ реализованных проектов — от частных домов до коммерческих фасадов.
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-0 border border-[var(--border)] mb-8 w-fit">
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

          {/* Lightbox */}
          {lbPhoto && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
              onClick={() => setLightbox(null)}
            >
              <div className="relative max-w-4xl w-full max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <img src={lbPhoto.src} alt={lbPhoto.title} className="w-full max-h-[80vh] object-contain" />
                <div className="mt-3 flex items-center justify-between">
                  <p className="f-pops text-white text-[14px]">{lbPhoto.title}</p>
                  <span className="f-pop text-[var(--accent)] text-[11px] uppercase tracking-widest">{lbPhoto.cat}</span>
                </div>
                <button onClick={() => setLightbox(null)} className="absolute top-0 right-0 -translate-y-8 f-pop text-white/60 hover:text-white text-[14px]">✕</button>
              </div>
            </div>
          )}

          {/* Masonry-style grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-0 border-t border-l border-[var(--border)]">
            {shown.map((p) => (
              <div
                key={p.id}
                onClick={() => setLightbox(p.id)}
                className="break-inside-avoid border-b border-r border-[var(--border)] overflow-hidden cursor-pointer group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={p.src}
                    alt={p.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ aspectRatio: p.size === "wide" ? "4/3" : p.size === "tall" ? "3/4" : "1/1" }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
                    <div>
                      <p className="f-pops text-white text-[13px]">{p.title}</p>
                      <span className="f-pop text-white/70 text-[11px] uppercase tracking-widest">{p.cat}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
