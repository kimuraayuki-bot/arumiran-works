import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  achievementGroups,
  navigationItems,
  originalSeries,
  pageTitles,
  shopDrafts,
  workDrafts,
} from "./portfolioData";
import "./PortfolioSite.css";

const CONTACT_EMAIL = "arararararura@gmail.com";
const SOCIAL_HUB_URL = "https://lit.link/arurutan";
const SITE_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function siteHref(path) {
  return `${SITE_BASE}${path}` || "/";
}

function publicAsset(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

function normalizePath(pathname) {
  const pathWithoutBase = SITE_BASE && pathname.startsWith(SITE_BASE)
    ? pathname.slice(SITE_BASE.length)
    : pathname;
  const cleanPath = pathWithoutBase.replace(/\/+$/, "") || "/";
  return pageTitles[cleanPath] ? cleanPath : "/";
}

function InternalLink({ to, onNavigate, className = "", children, ...props }) {
  return (
    <a href={siteHref(to)} className={className} onClick={(event) => onNavigate(event, to)} {...props}>
      {children}
    </a>
  );
}

function DraftAction({ children }) {
  return (
    <span className="button button--disabled" aria-disabled="true">
      {children}
      <span className="button__note">URL差し替え予定</span>
    </span>
  );
}

function PageIntro({ eyebrow, title, description }) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1 id="page-title" tabIndex="-1">{title}</h1>
      {description ? <p className="page-intro__description">{description}</p> : null}
    </header>
  );
}

function PlaceholderArtwork({ number, label }) {
  return (
    <div className="placeholder-art" role="img" aria-label={`${label}の画像差し替え枠`}>
      <span className="placeholder-art__number">{number}</span>
      <span className="placeholder-art__label">IMAGE / VIDEO</span>
      <span className="placeholder-art__note">素材差し替え予定</span>
    </div>
  );
}

function SiteHeader({ path, menuOpen, setMenuOpen, onNavigate }) {
  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen, setMenuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <InternalLink to="/" onNavigate={onNavigate} className="brand-mark" aria-label="あるみらん ポートフォリオ ホーム">
          <img src={publicAsset("/arumiran.png")} alt="" />
          <span>ALMIRAN.</span>
        </InternalLink>
        <button
          type="button"
          className="menu-button"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav id="primary-navigation" className={`primary-nav${menuOpen ? " primary-nav--open" : ""}`} aria-label="メインナビゲーション">
          {navigationItems.map((item) => (
            <InternalLink
              key={item.path}
              to={item.path}
              onNavigate={onNavigate}
              className="primary-nav__link"
              aria-current={path === item.path ? "page" : undefined}
            >
              {item.label}
            </InternalLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HomePage({ onNavigate }) {
  const blueAnemone = originalSeries[0];
  return (
    <div className="home-page">
      <section className="hero section-shell" data-section-key="hero">
        <div className="hero__copy">
          <p className="eyebrow">MANGA / ILLUSTRATION / VIDEO</p>
          <h1 id="page-title" tabIndex="-1">
            <span>あるみらん</span><span className="hero__slash">/</span><span className="hero__latin">Almiran.</span>
          </h1>
          <p className="hero__role">漫画家・イラストレーター・映像クリエイター</p>
          <InternalLink to="/about" onNavigate={onNavigate} className="text-link">
            PROFILE / ACTIVITY <ArrowRight aria-hidden="true" />
          </InternalLink>
        </div>
        <div className="hero__profile">
          <img src={publicAsset("/arumiran.png")} alt="あるみらんのプロフィールアイコン" />
          <div>
            <strong className="hero__count">130K+</strong>
            <span className="hero__count-label">SNS FOLLOWERS</span>
            <p>SNS総フォロワー13万人以上</p>
          </div>
        </div>
        <a className="hero__scroll" href="#featured" aria-label="注目作品へ移動">
          SCROLL <ArrowDown aria-hidden="true" />
        </a>
      </section>

      <section id="featured" className="featured section-shell" data-section-key="featured">
        <article className="feature-row feature-row--manga">
          <div className="manga-cover-draft" role="img" aria-label="漫画表紙画像の差し替え枠">
            <span>MANGA</span><strong>追放荷物持ちの<br />逆転無双</strong><small>表紙画像を追加予定</small>
          </div>
          <div className="feature-row__copy">
            <p className="eyebrow">MANGA — 商業連載</p>
            <h2>追放荷物持ちの逆転無双</h2>
            <p>ヤングアニマルWeb、マンガPark、単行本第1巻への導線をまとめます。</p>
            <InternalLink to="/manga" onNavigate={onNavigate} className="button">VIEW MANGA <ArrowRight aria-hidden="true" /></InternalLink>
          </div>
        </article>
        <article className="feature-row feature-row--original">
          <div className="feature-row__media"><img src={publicAsset(blueAnemone.image)} alt={blueAnemone.imageAlt} loading="lazy" /></div>
          <div className="feature-row__copy">
            <p className="eyebrow">ORIGINAL — オリジナルIP</p>
            <h2>{blueAnemone.title}</h2>
            <p>{blueAnemone.description}</p>
            <InternalLink to="/original" onNavigate={onNavigate} className="button">VIEW ORIGINAL <ArrowRight aria-hidden="true" /></InternalLink>
          </div>
        </article>
      </section>

      <section className="statement section-shell" data-section-key="statement">
        <p className="eyebrow">CROSS-MEDIA ARTIST STATEMENT</p>
        <div className="statement__heading">
          <h2>商業漫画家としての連載活動と、オリジナルIPの企画・制作、SNSでの発信。</h2>
        </div>
        <div className="discipline-grid">
          {[
            ["01", "MANGA", "商業連載作品", "/manga"],
            ["02", "ORIGINAL", "自主制作オリジナルIP", "/original"],
            ["03", "WORKS", "映像・イラスト・PR制作", "/works"],
          ].map(([number, title, description, route]) => (
            <InternalLink key={title} to={route} onNavigate={onNavigate} className="discipline-card">
              <span>{number}</span><strong>{title}</strong><p>{description}</p><ArrowUpRight aria-hidden="true" />
            </InternalLink>
          ))}
        </div>
      </section>

      <section className="works-preview section-shell" data-section-key="works-preview">
        <div className="section-heading">
          <div><p className="eyebrow">SELECTED WORKS</p><h2>WORKS.</h2></div>
          <InternalLink to="/works" onNavigate={onNavigate} className="text-link">ALL WORKS <ArrowRight aria-hidden="true" /></InternalLink>
        </div>
        <div className="works-preview__grid">
          {workDrafts.map((work) => (
            <article className="work-tile" key={work.number}>
              <PlaceholderArtwork number={work.number} label={work.category} /><p>{work.category}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-tail section-shell" data-section-key="shop-contact">
        <div className="home-tail__shop">
          <p className="eyebrow">SHOP</p><h2>作品・グッズの販売先</h2><p>ショップ名と販売ページは、URL確定後に接続します。</p>
          <InternalLink to="/shop" onNavigate={onNavigate} className="button">VIEW SHOP <ArrowRight aria-hidden="true" /></InternalLink>
        </div>
        <div className="home-tail__contact">
          <p className="eyebrow">CONTACT</p><h2>制作のご相談</h2><p>出版・企業・制作関係者様からのご依頼・ご相談を承っております。</p>
          <InternalLink to="/contact" onNavigate={onNavigate} className="button button--light">CONTACT <ArrowRight aria-hidden="true" /></InternalLink>
        </div>
      </section>
    </div>
  );
}

function MangaPage() {
  return (
    <div className="page-shell manga-page">
      <PageIntro eyebrow="COMMERCIAL SERIES" title="MANGA." description="商業連載作品と、各配信先・単行本の案内を掲載します。" />
      <section className="manga-feature" data-section-key="manga-title">
        <div className="manga-feature__copy">
          <p className="eyebrow">MANGA — 商業連載</p><h2>追放荷物持ちの逆転無双</h2><p className="draft-copy">作品紹介文を追加予定</p>
          <div className="action-stack" aria-label="作品を読むリンク">
            <DraftAction>ヤングアニマルWebで読む</DraftAction><DraftAction>マンガParkで読む</DraftAction><DraftAction>単行本 第1巻</DraftAction>
          </div>
        </div>
        <div className="manga-feature__cover">
          <div className="manga-cover-draft manga-cover-draft--large" role="img" aria-label="単行本表紙画像の差し替え枠">
            <span>COMIC COVER</span><strong>追放荷物持ちの<br />逆転無双</strong><small>表紙画像を追加予定</small>
          </div>
        </div>
      </section>
      <section className="page-note" data-section-key="manga-note"><span>NOTE</span><p>今後作品が増えた場合も、同じ形式で下へ追加できる構成です。</p></section>
    </div>
  );
}

function OriginalPage() {
  const [mainSeries, ...otherSeries] = originalSeries;
  return (
    <div className="page-shell original-page">
      <PageIntro eyebrow="SELF-PUBLISHED STORIES" title="ORIGINAL." description="自主制作のオリジナルシリーズと、公式サイト・再生リストへの案内です。" />
      <section className="original-lead" data-section-key="main-original">
        <div className="original-lead__media"><img src={publicAsset(mainSeries.image)} alt={mainSeries.imageAlt} /></div>
        <div className="original-lead__copy">
          <p className="eyebrow">MAIN SERIES</p><h2>{mainSeries.title}</h2><p className="original-lead__subtitle">{mainSeries.subtitle}</p><p>{mainSeries.description}</p>
          <div className="button-row">
            <a className="button" href={mainSeries.officialUrl} target="_blank" rel="noopener noreferrer">公式サイト <ExternalLink aria-hidden="true" /></a>
            <a className="button button--secondary" href={mainSeries.playlistUrl} target="_blank" rel="noopener noreferrer">再生リスト <ExternalLink aria-hidden="true" /></a>
          </div>
        </div>
      </section>
      <section className="other-series" data-section-key="other-originals">
        <div className="section-heading"><div><p className="eyebrow">OTHER SERIES</p><h2>その他のシリーズ</h2></div></div>
        <div className="other-series__grid">
          {otherSeries.map((series) => (
            <article className="series-card" key={series.title}>
              <img src={publicAsset(series.image)} alt={series.imageAlt} loading="lazy" />
              <div className="series-card__copy"><p>{series.subtitle}</p><h3>{series.title}</h3><span>{series.description}</span><a href={series.playlistUrl} target="_blank" rel="noopener noreferrer">再生リスト <ExternalLink aria-hidden="true" /></a></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function WorksPage() {
  return (
    <div className="page-shell works-page">
      <PageIntro eyebrow="VIDEO / ILLUSTRATION / PR / GOODS" title="WORKS." description="案件・制作物を、分野ごとに縦に掲載するページです。" />
      <div className="work-list" data-section-key="work-list">
        {workDrafts.map((work, index) => (
          <article className={`work-entry${index % 2 === 1 ? " work-entry--reverse" : ""}`} key={work.number}>
            <PlaceholderArtwork number={work.number} label={work.category} />
            <div className="work-entry__copy">
              <p className="eyebrow">WORKS — {work.category}</p><h2>{work.title}</h2>
              <dl><div><dt>制作期間</dt><dd>{work.period}</dd></div><div><dt>担当</dt><dd>{work.role}</dd></div></dl>
              <p>{work.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AboutPage({ onNavigate }) {
  return (
    <div className="page-shell about-page">
      <PageIntro eyebrow="PROFILE / ACTIVITY" title="ABOUT." />
      <section className="about-lead" data-section-key="profile">
        <div className="about-lead__copy">
          <p className="about-lead__latin">ALMIRAN.</p><h2>あるみらん</h2><p className="about-lead__role">漫画家 / イラストレーター / 映像クリエイター</p>
          <p>世界観を創り、物語を届けるマルチクリエイター。作品の企画・制作から漫画・映像展開まで手がけています。</p>
          <p>商業漫画制作、オリジナルIPの企画・発信、映像・背景美術など、媒体を横断して活動しています。</p>
        </div>
        <div className="about-lead__portrait"><img src={publicAsset("/arumiran.png")} alt="あるみらんのプロフィールアイコン" /></div>
      </section>
      <section className="achievements" data-section-key="achievements">
        <div className="section-heading"><div><p className="eyebrow">KEY ACHIEVEMENTS</p><h2>主な実績</h2></div></div>
        <div className="achievement-list">
          {achievementGroups.map((group) => <article key={group.title}><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}
        </div>
      </section>
      <section className="history" data-section-key="history">
        <div><p className="eyebrow">ACTIVITY HISTORY</p><h2>活動の経歴</h2></div>
        <ol>{["2026 — 現在", "2025", "2024", "2022", "2003"].map((year) => <li key={year}><time>{year}</time><span>活動内容を追加予定</span></li>)}</ol>
      </section>
      <div className="about-contact"><p>企業案件・招待・採択・受賞歴の詳細は、活動実績資料にまとめる予定です。</p><InternalLink to="/contact" onNavigate={onNavigate} className="button">CONTACT <ArrowRight aria-hidden="true" /></InternalLink></div>
    </div>
  );
}

function ShopPage() {
  return (
    <div className="page-shell shop-page">
      <PageIntro eyebrow="STORE / COMMISSION" title="SHOP." description="作品・グッズの販売先をまとめるページです。" />
      <section className="shop-grid" data-section-key="shop-links">
        {shopDrafts.map((shop, index) => <article className="shop-card" key={shop.label}><span>0{index + 1}</span><h2>{shop.label}</h2><p>{shop.description}</p><span className="shop-card__status">LINK PENDING</span></article>)}
      </section>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="page-shell contact-page">
      <PageIntro eyebrow="WORK INQUIRIES" title="CONTACT." description="出版・企業・制作関係者様からのご依頼・ご相談を承っております。個人の方も歓迎しています。" />
      <section className="contact-panel" data-section-key="contact-details">
        <div><p className="eyebrow">E-MAIL</p><a href={`mailto:${CONTACT_EMAIL}`} className="contact-panel__mail"><Mail aria-hidden="true" />{CONTACT_EMAIL}</a></div>
        <a className="button button--light" href={SOCIAL_HUB_URL} target="_blank" rel="noopener noreferrer">SNS / PORTFOLIO LINKS <ExternalLink aria-hidden="true" /></a>
      </section>
    </div>
  );
}

function SiteFooter({ onNavigate }) {
  return (
    <footer className="site-footer"><div className="site-footer__inner">
      <div><p className="site-footer__brand">ALMIRAN.</p><p>漫画 / イラスト / 映像</p></div>
      <div className="site-footer__links"><InternalLink to="/about" onNavigate={onNavigate}>ABOUT</InternalLink><a href={SOCIAL_HUB_URL} target="_blank" rel="noopener noreferrer">SNS <ArrowUpRight aria-hidden="true" /></a><a href={`mailto:${CONTACT_EMAIL}`}>MAIL</a></div>
      <p className="site-footer__copyright">© ALMIRAN</p>
    </div></footer>
  );
}

function PortfolioSite() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    const handlePopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.title = pageTitles[path];
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => document.querySelector("#page-title")?.focus({ preventScroll: true }));
  }, [path]);

  const handleNavigate = (event, nextPath) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const normalizedNextPath = normalizePath(nextPath);
    if (normalizedNextPath !== path) {
      window.history.pushState({}, "", siteHref(normalizedNextPath));
      setPath(normalizedNextPath);
    }
    setMenuOpen(false);
  };

  let page;
  switch (path) {
    case "/about": page = <AboutPage onNavigate={handleNavigate} />; break;
    case "/manga": page = <MangaPage />; break;
    case "/original": page = <OriginalPage />; break;
    case "/works": page = <WorksPage />; break;
    case "/shop": page = <ShopPage />; break;
    case "/contact": page = <ContactPage />; break;
    default: page = <HomePage onNavigate={handleNavigate} />;
  }

  return (
    <div className="portfolio-site">
      <SiteHeader path={path} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onNavigate={handleNavigate} />
      <main>{page}</main>
      <SiteFooter onNavigate={handleNavigate} />
    </div>
  );
}

export default PortfolioSite;
