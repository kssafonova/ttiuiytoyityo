import { useEffect, useRef, useState } from "react";
import type { Page } from "../App";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (p: Page) => void;
}

type MenuItem = { label: string; page: Page; sub?: string };
type MenuGroup = { label: string; items: MenuItem[] };

const productItems: MenuItem[] = [
  { label: "Раздвижные системы", page: "sliding", sub: "Обзор решений для дома и террасы" },
  { label: "HS-портал", page: "hs-portal", sub: "Подъёмно-раздвижные системы" },
  { label: "FS-портал", page: "fs-portal", sub: "Складные порталы-гармошки" },
  { label: "Панорамные окна", page: "aluminum", sub: "Алюминиевое остекление" },
];

const companyItems: MenuItem[] = [
  { label: "О компании", page: "about", sub: "Подход и экспертиза" },
  { label: "Производство", page: "production", sub: "Как создаём конструкции" },
  { label: "Почему мы", page: "why-us", sub: "Проектирование и монтаж" },
  { label: "Отзывы", page: "reviews", sub: "Опыт клиентов" },
];

const mobileGroups: MenuGroup[] = [
  { label: "Продукция", items: productItems },
  { label: "Компания", items: companyItems },
  {
    label: "Материалы",
    items: [
      { label: "Видео", page: "video" },
      { label: "Галерея", page: "gallery" },
      { label: "3D-модели", page: "models3d" },
    ],
  },
];

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>("Продукция");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDrop(null);
        setMobileOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDrop(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setOpenDrop(null);
    setMobileOpen(false);
  }, [currentPage]);

  const go = (page: Page) => {
    onNavigate(page);
    setOpenDrop(null);
    setMobileOpen(false);
  };

  const navClass = (active: boolean) =>
    `header-link ${active ? "header-link--active" : ""}`;

  const renderDropdown = (label: string, items: MenuItem[]) => {
    const isActive = items.some((item) => item.page === currentPage);
    const isOpen = openDrop === label;

    return (
      <div key={label} className="relative">
        <button
          type="button"
          className={navClass(isActive)}
          onClick={() => setOpenDrop(isOpen ? null : label)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <span>{label}</span>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        {isOpen && (
          <div className="header-dropdown" role="menu">
            {items.map((item) => (
              <button
                type="button"
                role="menuitem"
                key={item.page}
                onClick={() => go(item.page)}
                className="header-dropdown__item group"
              >
                <span className={currentPage === item.page ? "text-[var(--accent)]" : "text-[var(--dark)]"}>
                  {item.label}
                </span>
                {item.sub && <span className="header-dropdown__sub">{item.sub}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      ref={headerRef}
      className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}
    >
      <div className="container header-inner">
        <button type="button" onClick={() => go("home")} className="brand-lockup" aria-label="OKNOVA — на главную">
          <span className="brand-lockup__name">OKNOVA</span>
          <span className="brand-lockup__tagline">окна и раздвижные системы</span>
        </button>

        <nav className="hidden lg:flex items-center" aria-label="Основная навигация">
          {renderDropdown("Продукция", productItems)}
          <button type="button" onClick={() => go("portfolio")} className={navClass(currentPage === "portfolio")}>Проекты</button>
          {renderDropdown("Компания", companyItems)}
          <button type="button" onClick={() => go("blog")} className={navClass(currentPage === "blog")}>Блог</button>
        </nav>

        <div className="hidden lg:flex items-center gap-5 shrink-0">
          <a href="tel:88005551234" className="header-phone">8 (800) 555-12-34</a>
          <button type="button" onClick={() => go("calculator")} className="btn-primary accent-btn header-cta">
            Рассчитать проект
          </button>
        </div>

        <button
          type="button"
          className="lg:hidden mobile-menu-button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={mobileOpen}
        >
          <span className={`mobile-menu-line ${mobileOpen ? "mobile-menu-line--top" : ""}`} />
          <span className={`mobile-menu-line ${mobileOpen ? "mobile-menu-line--middle" : ""}`} />
          <span className={`mobile-menu-line ${mobileOpen ? "mobile-menu-line--bottom" : ""}`} />
        </button>
      </div>

      <div className={`mobile-drawer lg:hidden ${mobileOpen ? "mobile-drawer--open" : ""}`}>
        <div className="container mobile-drawer__inner">
          <div className="mobile-quick-links">
            <button type="button" onClick={() => go("portfolio")}>Проекты</button>
            <button type="button" onClick={() => go("blog")}>Блог</button>
            <button type="button" onClick={() => go("calculator")}>Калькулятор</button>
          </div>

          {mobileGroups.map((group) => {
            const isOpen = mobileGroup === group.label;
            return (
              <div key={group.label} className="mobile-group">
                <button
                  type="button"
                  className="mobile-group__toggle"
                  onClick={() => setMobileGroup(isOpen ? null : group.label)}
                  aria-expanded={isOpen}
                >
                  <span>{group.label}</span>
                  <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                <div className={`mobile-group__items ${isOpen ? "mobile-group__items--open" : ""}`}>
                  {group.items.map((item) => (
                    <button type="button" key={item.page} onClick={() => go(item.page)} className="mobile-group__item">
                      <span>{item.label}</span>
                      {item.sub && <small>{item.sub}</small>}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mobile-contact">
            <a href="tel:88005551234">8 (800) 555-12-34</a>
            <button type="button" onClick={() => go("calculator")} className="btn-primary accent-btn w-full sm:w-auto">
              Рассчитать проект
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
