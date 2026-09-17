import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import HSPortalPage from "./pages/HSPortalPage";
import FSPortalPage from "./pages/FSPortalPage";
import SlidingSystemsPage from "./pages/SlidingSystemsPage";
import CalculatorPage from "./pages/CalculatorPage";
import AluminumPage from "./pages/AluminumPage";
import PortfolioPage from "./pages/PortfolioPage";
import ReviewsPage from "./pages/ReviewsPage";
import WhyUsPage from "./pages/WhyUsPage";
import AboutPage from "./pages/AboutPage";
import ProductionPage from "./pages/ProductionPage";
import BlogPage from "./pages/BlogPage";
import VideoPage from "./pages/VideoPage";
import GalleryPage from "./pages/GalleryPage";
import Models3DPage from "./pages/Models3DPage";

export type Page =
  | "home"
  | "sliding"
  | "hs-portal"
  | "fs-portal"
  | "calculator"
  | "aluminum"
  | "portfolio"
  | "reviews"
  | "why-us"
  | "about"
  | "production"
  | "blog"
  | "video"
  | "gallery"
  | "models3d";

const pages = new Set<Page>([
  "home", "sliding", "hs-portal", "fs-portal", "calculator", "aluminum",
  "portfolio", "reviews", "why-us", "about", "production", "blog",
  "video", "gallery", "models3d",
]);

function pageFromHash(): Page {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return pages.has(raw as Page) ? (raw as Page) : "home";
}

export default function App() {
  const [page, setPage] = useState<Page>(() => pageFromHash());

  const navigate = (nextPage: Page) => {
    if (nextPage === page) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const nextHash = nextPage === "home" ? "" : `#/${nextPage}`;
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onNavigation = () => {
      setPage(pageFromHash());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onNavigation);
    window.addEventListener("popstate", onNavigation);
    return () => {
      window.removeEventListener("hashchange", onNavigation);
      window.removeEventListener("popstate", onNavigation);
    };
  }, []);

  useEffect(() => {
    const titles: Record<Page, string> = {
      home: "OKNOVA — окна и раздвижные системы",
      sliding: "Раздвижные системы — OKNOVA",
      "hs-portal": "HS-порталы — OKNOVA",
      "fs-portal": "FS-порталы — OKNOVA",
      calculator: "Калькулятор остекления — OKNOVA",
      aluminum: "Панорамные окна — OKNOVA",
      portfolio: "Проекты — OKNOVA",
      reviews: "Отзывы — OKNOVA",
      "why-us": "Почему OKNOVA",
      about: "О компании — OKNOVA",
      production: "Производство — OKNOVA",
      blog: "Блог — OKNOVA",
      video: "Видео — OKNOVA",
      gallery: "Галерея — OKNOVA",
      models3d: "3D-модели — OKNOVA",
    };
    document.title = titles[page];
  }, [page]);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <Header currentPage={page} onNavigate={navigate} />
      <main>
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "sliding" && <SlidingSystemsPage onNavigate={navigate} />}
        {page === "hs-portal" && <HSPortalPage />}
        {page === "fs-portal" && <FSPortalPage />}
        {page === "calculator" && <CalculatorPage />}
        {page === "aluminum" && <AluminumPage />}
        {page === "portfolio" && <PortfolioPage />}
        {page === "reviews" && <ReviewsPage />}
        {page === "why-us" && <WhyUsPage />}
        {page === "about" && <AboutPage onNavigate={navigate} />}
        {page === "production" && <ProductionPage />}
        {page === "blog" && <BlogPage />}
        {page === "video" && <VideoPage />}
        {page === "gallery" && <GalleryPage />}
        {page === "models3d" && <Models3DPage />}
      </main>
      <Footer onNavigate={navigate} onScrollTop={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
    </div>
  );
}
