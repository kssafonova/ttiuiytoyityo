import type { Page } from "../App";

interface Props { onNavigate: (p: Page) => void; }

const timeline = [
  { year: "2016", event: "Основание компании. Первые 12 объектов в Подмосковье." },
  { year: "2018", event: "Запуск собственного производства площадью 1 200 м²." },
  { year: "2020", event: "Расширение завода до 4 200 м². Освоение алюминиевых систем." },
  { year: "2022", event: "100-й реализованный объект. Открытие конструкторского бюро." },
  { year: "2024", event: "200+ объектов. Партнёрство с SCHÜCO и Rehau." },
  { year: "2025", event: "Запуск 3D-конфигуратора и онлайн-калькулятора для клиентов." },
];

export default function AboutPage({ onNavigate }: Props) {
  return (
    <>
      <section className="section-pad bg-white" style={{ paddingTop: "clamp(80px,10vw,140px)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-5">О компании</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
            <h1 className="f-mont text-[var(--dark)] leading-[1.05]" style={{ fontSize: "clamp(28px,4vw,56px)" }}>
              OKNOVA с 2016 года.<br />Инженеры, а не продавцы.
            </h1>
            <div>
              <p className="f-pop text-[var(--muted)] text-[15px] leading-[1.7] mb-4">
                Мы начали как небольшое конструкторское бюро, которое устало от компромиссов.
                Хотели делать остекление так, как оно должно быть сделано — с полным инженерным
                расчётом, качественными материалами и собственным монтажом.
              </p>
              <p className="f-pop text-[var(--muted)] text-[15px] leading-[1.7]">
                Сегодня у нас свой завод, конструкторское бюро и штатная монтажная бригада.
                Мы не посредники — мы полный цикл от проекта до регулировки.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 border border-[var(--border)] mb-16">
            {[["9 лет", "на рынке"], ["200+", "объектов"], ["4 200 м²", "завод"], ["10 лет", "гарантия"]].map(([v, l]) => (
              <div key={l} className="p-7 border-r border-[var(--border)] last:border-r-0 text-center">
                <p className="f-montm text-[var(--dark)] mb-1" style={{ fontSize: "clamp(22px,2.5vw,36px)" }}>{v}</p>
                <p className="f-pop text-[var(--muted)] text-[12px]">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ background: "var(--light)" }}>
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-8">История</p>
          <div className="flex flex-col gap-0 border-l-2 border-[var(--accent)] ml-4">
            {timeline.map((t) => (
              <div key={t.year} className="relative pl-8 pb-8 last:pb-0">
                <div className="absolute -left-[9px] top-0 size-4 border-2 border-[var(--accent)] bg-white" />
                <p className="f-montm text-[var(--accent)] text-[13px] mb-1">{t.year}</p>
                <p className="f-pop text-[var(--dark)] text-[14px] leading-[1.6]">{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container">
          <p className="f-popm text-[var(--muted)] text-[11px] uppercase tracking-[0.28em] mb-8">Команда</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-[var(--border)]">
            {[
              { name: "Алексей Воронов",   role: "Генеральный директор",     exp: "18 лет в отрасли" },
              { name: "Николай Петров",    role: "Главный конструктор",       exp: "Strabag, ПИК" },
              { name: "Андрей Семёнов",   role: "Руководитель монтажа",     exp: "1 500+ объектов" },
              { name: "Елена Кравцова",    role: "Технолог производства",    exp: "Certif. Rehau/SCHÜCO" },
            ].map((p) => (
              <div key={p.name} className="border-b border-r border-[var(--border)] p-6">
                <div className="size-14 bg-[var(--light)] flex items-center justify-center mb-4 border border-[var(--border)]">
                  <span className="f-montm text-[var(--accent)] text-[18px]">{p.name.split(" ").map((w) => w[0]).join("")}</span>
                </div>
                <p className="f-pops text-[var(--dark)] text-[14px] mb-1">{p.name}</p>
                <p className="f-pop text-[var(--muted)] text-[12px] mb-0.5">{p.role}</p>
                <p className="f-pop text-[var(--accent)] text-[11px]">{p.exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[var(--dark)]">
        <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h2 className="f-mont text-white" style={{ fontSize: "clamp(22px,3vw,38px)" }}>Посмотрите, как мы работаем</h2>
          <div className="flex gap-3">
            <button onClick={() => onNavigate("production")} className="btn-outline !text-white !border-white/30">Производство</button>
            <button onClick={() => onNavigate("portfolio")} className="btn-primary accent-btn">Наши проекты</button>
          </div>
        </div>
      </section>
    </>
  );
}
