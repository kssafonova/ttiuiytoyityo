import type { Page } from "../App";

interface FooterProps {
  onNavigate: (p: Page) => void;
  onScrollTop: () => void;
}

export default function Footer({ onNavigate, onScrollTop }: FooterProps) {
  const cols = [
    {
      head: "Продукция",
      items: [
        { label: "Раздвижные системы",    page: "sliding"    as Page },
        { label: "HS-портал",             page: "hs-portal"  as Page },
        { label: "FS-портал",             page: "fs-portal"  as Page },
        { label: "Алюминиевые окна",      page: "aluminum"   as Page },
        { label: "Калькулятор",           page: "calculator" as Page },
      ],
    },
    {
      head: "Компания",
      items: [
        { label: "О компании",   page: "about"      as Page },
        { label: "Производство", page: "production" as Page },
        { label: "Почему мы",    page: "why-us"     as Page },
        { label: "Отзывы",       page: "reviews"    as Page },
      ],
    },
    {
      head: "Медиа",
      items: [
        { label: "Блог",        page: "blog"     as Page },
        { label: "Видеоконтент",page: "video"    as Page },
        { label: "Изображения", page: "gallery"  as Page },
        { label: "3D модели",   page: "models3d" as Page },
        { label: "Проекты",     page: "portfolio" as Page },
      ],
    },
  ];

  return (
    <footer style={{ background: "var(--dark)" }}>
      <div className="container section-pad" style={{ paddingBottom: "clamp(48px,5vw,80px)" }}>
        {/* CTA */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <p className="f-mont text-white leading-[1.15] mb-4" style={{ fontSize: "clamp(22px,3vw,42px)", maxWidth: 520 }}>
              Покажите нам дом и проём. Мы предложим понятное решение.
            </p>
            <p className="f-pop text-white/50 text-[14px]">Без обязательств · Москва и МО</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="tel:88005551234" className="btn-outline !text-white !border-white/30">Позвонить</a>
            <button onClick={() => onNavigate("calculator")} className="btn-primary accent-btn">Рассчитать</button>
          </div>
        </div>

        <div className="h-px bg-white/10 mb-12" />

        {/* Nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => onNavigate("home")} className="flex flex-col gap-1 mb-6">
              <span className="f-mont text-white tracking-[0.12em]" style={{ fontSize: "20px" }}>OKNOVA</span>
              <span className="f-pop text-white/40 uppercase tracking-[0.18em]" style={{ fontSize: "10px" }}>панорамные системы</span>
            </button>
            <p className="f-pop text-[13px] text-white/40 leading-[1.6] mb-6" style={{ maxWidth: 200 }}>
              Проектирование, производство и монтаж панорамных систем в Москве с 2016 года.
            </p>
            <div className="flex flex-col gap-1">
              <a href="tel:88005551234" className="f-pop text-[13px] text-white/60 hover:text-[var(--accent)] transition-colors">8 (800) 555-12-34</a>
              <a href="mailto:hello@oknova.ru" className="f-pop text-[13px] text-white/60 hover:text-[var(--accent)] transition-colors">hello@oknova.ru</a>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.head}>
              <p className="f-popm text-[10px] uppercase tracking-[0.3em] text-white/30 mb-5">{col.head}</p>
              <div className="flex flex-col gap-3">
                {col.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onNavigate(item.page)}
                    className="f-pop text-[13px] text-white/60 text-left hover:text-[var(--accent)] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/10 mt-12 mb-6" />

        <div className="flex items-center justify-between">
          <p className="f-pop text-[12px] text-white/30">© 2026 OKNOVA · Все права защищены</p>
          <button
            onClick={onScrollTop}
            className="size-10 border border-white/20 flex items-center justify-center text-white/50 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            aria-label="Наверх"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
