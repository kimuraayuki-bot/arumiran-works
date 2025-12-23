import React, { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * 背景模様用（SVGをdata URIで埋め込み）
 * - catalog: 古地図っぽい格子＋点
 * - sea: 波紋（夏の海）
 * - demon: ステンドグラス風（ゴシックっぽい多角形）
 */
const PATTERN = {
  catalog:
    "bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='160' height='160' fill='none'/><path d='M0 32H160M0 64H160M0 96H160M0 128H160' stroke='rgba(255,255,255,0.06)' stroke-width='1'/><path d='M32 0V160M64 0V160M96 0V160M128 0V160' stroke='rgba(255,255,255,0.05)' stroke-width='1'/><circle cx='40' cy='40' r='1.5' fill='rgba(255,255,255,0.10)'/><circle cx='120' cy='88' r='1.5' fill='rgba(255,255,255,0.10)'/><circle cx='76' cy='132' r='1.5' fill='rgba(255,255,255,0.10)'/></svg>\")]",
  sea:
    "bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><rect width='220' height='220' fill='none'/><circle cx='110' cy='110' r='42' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1'/><circle cx='110' cy='110' r='74' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='1'/><circle cx='110' cy='110' r='102' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/><path d='M24 160c22-18 46-18 68 0s46 18 68 0 46-18 68 0' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/></svg>\")]",
  demon:
    "bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><rect width='220' height='220' fill='none'/><path d='M20 40 L110 20 L200 60 L180 150 L90 200 L30 140 Z' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='1'/><path d='M60 70 L120 55 L170 90 L150 160 L95 175 L55 130 Z' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/><path d='M40 190 L110 120 L200 200' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/></svg>\")]",
};

const Ornament = ({ tone = "amber" }) => {
  // tone: "amber" | "sky" | "rose"
  const line =
    tone === "sky"
      ? "bg-sky-200/30"
      : tone === "rose"
      ? "bg-rose-200/25"
      : "bg-amber-200/30";

  const dot =
    tone === "sky"
      ? "bg-sky-200/70"
      : tone === "rose"
      ? "bg-rose-200/70"
      : "bg-amber-200/70";

  return (
    <div className="flex items-center gap-4">
      <div className={cx("h-px flex-1", line)} />
      <div className="flex items-center gap-2">
        <span className={cx("h-1.5 w-1.5 rounded-full", dot)} />
        <span className={cx("h-2 w-2 rounded-full", dot, "opacity-70")} />
        <span className={cx("h-1.5 w-1.5 rounded-full", dot, "opacity-60")} />
      </div>
      <div className={cx("h-px flex-1", line)} />
    </div>
  );
};

const ClampText = ({ text, clampLines = 3 }) => {
  const [open, setOpen] = useState(false);

  // 改行ありテキストでも「短文」を成立させるため
  // - open=false のときは line-clamp で折る
  // - open=true のときは全文表示
  return (
    <div>
      <p
        className={cx(
          "text-slate-200/85 leading-relaxed whitespace-pre-line",
          !open && `line-clamp-${clampLines}`
        )}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition"
      >
        {open ? (
          <>
            <ChevronUp size={16} />
            <span>閉じる</span>
          </>
        ) : (
          <>
            <ChevronDown size={16} />
            <span>続きを読む</span>
          </>
        )}
      </button>
    </div>
  );
};

const WorksCatalog = () => {
  const [selectedWork, setSelectedWork] = useState(null);

  const works = useMemo(
    () => [
      {
        id: 1,
        title: "王女のブルーアネモネ号",
        subtitle: "Princess Blue Anemone",
        image: "/characters/all.jpg",
        theme: {
          // 夏の海：明るいシアン〜青、白の泡っぽさ
          pageBg: "bg-[#071524]",
          glow:
            "bg-[radial-gradient(1000px_circle_at_15%_10%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(14,165,233,0.18),transparent_55%),radial-gradient(900px_circle_at_50%_95%,rgba(255,255,255,0.06),transparent_55%)]",
          pattern: PATTERN.sea,
          tone: "sky",
          accentText: "text-sky-100",
          subText: "text-sky-100/70",
          line: "bg-sky-200/30",
          cardBorder: "border-sky-100/15",
          cardBg: "bg-white/[0.05] hover:bg-white/[0.07]",
          chip:
            "bg-sky-100/10 text-sky-50 border border-sky-100/20 backdrop-blur",
          button:
            "border border-sky-100/25 text-sky-50 hover:bg-sky-100/10",
          titleFont: "font-[var(--font-display)] tracking-[0.12em]",
        },
        summary:
          "「王女のブルーアネモネ号」",
        characters: [
          {
            name: "アドニス（20）",
            role: "船長",
            description:
              "北の海の海賊、ケートスの息子で、西国に処刑されるはずだったが、\n処刑直前でなぜかグッドマン伯爵に助けられた。\n行方不明となった妹のティナを探し出すため伯爵と取引をし、\n以降私掠船プリンセス・ブルーアネモネ号の船長として西国の\n私掠に加担している。\n温和で思慮深く慕われているが、たまにずれている。\n操船術や自然の観察力に長けており、航海士としての腕は超一流。",
            image: "/characters/adonis.jpg",
          },
          {
            name: "ビル（20）",
            role: "クルー",
            description:
              "貧民街の生まれで過酷な幼少期をすごす。\n文字も読めず言葉もまともに発せなかったが、まだ海賊の卵\nだったアドニスと妹ティナに出会い、生きる術を教わった。\n自身を地獄から救い出してくれた二人に恩を感じており、\n以来忠誠を尽くしている。無口だが情に厚い男。",
            image: "/characters/bill.jpg",
          },
          {
            name: "ペトラ（16）",
            role: "船医",
            description:
              "中流階級の医師の一人娘。女の身の生きづらさから、自由を\n求めて船に乗り込んだ。毒素が船上戦での負傷者を\n救護する姿から、女とバレてしまった後も船医としても重宝されている。\nしっかり者で男勝りな性格だけど、ちゃんと乙女な一面も。\n実は海賊時代のアドニスと面識があり、ペトラの初恋の人だったり。",
            image: "/characters/petra.jpg",
          },
          {
            name: "ランポート（24）",
            role: "主計長",
            description:
              "大貴族であるウルクス子爵家の現当主だが、ブルーアネモネ号の\n出資者かつ亡き父の借金の債権者であるグッドマン伯爵の要求で\n仕方なく主計長としてブルーアネモネ号に乗り込んでいる。\nその正体を知っているのは今のところアドニスとビルのみ。\n博学かつ社交界特有の立ち回りが上手く、貴族の間では「賢者」と\n名高いが、船の上ではパンガ相手にしょっちゅう怒ってる。\n婚約者がいるが、あまり会えず申し訳ないと思っている。",
            image: "/characters/lamport.jpg",
          },
          {
            name: "パンガ（18）",
            role: "クルー",
            description:
              "積まれていた奴隷船が難破し岸に流れ着いたところに、停泊中の\nブルーアネモネ号を発見。故郷の島を見つけるまでと言い張って\n勝手に乗船している。粗野で無遠慮な振舞いからしょっちゅう\nランポートを怒らせているが、本人は大して気にしていない。\n戦闘舞踏民族で踊りが得意。大食いだが料理も上手く、船員たちの\n胃袋をつかんでいる。",
            image: "/characters/panga.jpg",
          },
          {
            name: "イヴ（）",
            role: "？",
            description:
              "準備中",
            image: "/characters/eve.jpg",
          },
        ],
      },

      {
        id: 2,
        title: "悪魔シリーズ",
        subtitle: "Demon Series",
        image: "https://picsum.photos/seed/devilseries/1400/900",
        theme: {
          // ゴシック：深紅×紫、少しガラス模様
          pageBg: "bg-[#11060D]",
          glow:
            "bg-[radial-gradient(1000px_circle_at_20%_10%,rgba(244,63,94,0.14),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(168,85,247,0.13),transparent_55%),radial-gradient(900px_circle_at_40%_95%,rgba(255,255,255,0.05),transparent_55%)]",
          pattern: PATTERN.demon,
          tone: "rose",
          accentText: "text-rose-100",
          subText: "text-rose-100/70",
          line: "bg-rose-200/25",
          cardBorder: "border-rose-100/12",
          cardBg: "bg-white/[0.04] hover:bg-white/[0.06]",
          chip:
            "bg-rose-100/10 text-rose-50 border border-rose-100/20 backdrop-blur",
          button:
            "border border-rose-100/25 text-rose-50 hover:bg-rose-100/10",
          titleFont: "font-[var(--font-display)] tracking-[0.12em]",
        },
        summary: "悪魔シリーズ",
        characters: [
          {
            name: "ミリオン",
            role: "—",
            description:
              "人間の血が半分混じっている。\n妖艶な美しい見た目とは反対に結構パワータイプ。\n堅気で情に厚い男。\n目的のためなら手段を選ばない父であるギムレットのやり方に憤り、一矢報いることを決意する。",
            image: "https://i.pravatar.cc/200?img=11",
          },
          {
            name: "カーマ",
            role: "—",
            description:
              "面白いことが大好きな異教の悪魔。\nギムレットの悪事の片棒を担っていたが、妻の死、ミリオンの勧誘をきっかけに彼の元を離れた。",
            image: "https://i.pravatar.cc/200?img=22",
          },
          {
            name: "ギムレット",
            role: "—",
            description:
              "下級悪魔のインキュバスの身でありながら、地獄の支配者階級に最も近い位置まで昇りつめた。\n彼の野心は留まるところを知らない。",
            image: "https://i.pravatar.cc/200?img=31",
          },
          {
            name: "ルシファー",
            role: "王",
            description:
              "神との戦いに敗れ堕天。\n最高位であったその手腕で法による地獄の統治を試みるなど、以降王として君臨する。\nただし彼の威厳は本命の前では無力になるようだ。",
            image: "https://i.pravatar.cc/200?img=40",
          },
          {
            name: "アスモデウス",
            role: "—",
            description:
              "地獄のあらゆるセクシーを取り仕切るお姉さま。\nギムレットに捨てられ行き場のないミリオンとまだ赤子だった妹を拾い育ててくれた。\nミリオンにとっては上司であり恩人。",
            image: "https://i.pravatar.cc/200?img=49",
          },
          {
            name: "ベルフェゴール",
            role: "怠惰の悪魔",
            description:
              "なにもかもがめんどくさくてしょうがない怠惰の悪魔。\nとりあえず寝てるから起こさないで。",
            image: "https://i.pravatar.cc/200?img=55",
          },
          {
            name: "マモン",
            role: "—",
            description:
              "かつては人間の魔導士であった。\n自身の欲が満たされるなら他のことはわりとなんでもいい。\n地獄の中で最も悪魔らしい悪魔かもしれない。",
            image: "https://i.pravatar.cc/200?img=66",
          },
          {
            name: "ベルゼブブ",
            role: "—",
            description:
              "かつては豊穣の神であったが、異教として貶められ悪魔となった。\n満たされない飢えという業をせおっている。",
            image: "https://i.pravatar.cc/200?img=77",
          },
        ],
      },
    ],
    []
  );

  const selected = selectedWork
    ? works.find((w) => w.id === selectedWork)
    : null;

  // トップ（一覧）は「古地図」っぽく落ち着いた別テーマにする
  const catalogTheme = {
    pageBg: "bg-[#0A0C12]",
    glow:
      "bg-[radial-gradient(1000px_circle_at_15%_10%,rgba(245,158,11,0.14),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(59,130,246,0.10),transparent_55%),radial-gradient(900px_circle_at_50%_95%,rgba(255,255,255,0.06),transparent_55%)]",
    pattern: PATTERN.catalog,
    tone: "amber",
    accentText: "text-amber-200",
    subText: "text-slate-300/70",
    line: "bg-amber-200/25",
    cardBorder: "border-white/10",
    cardBg: "bg-white/[0.04] hover:bg-white/[0.06]",
    chip: "bg-amber-200/10 text-amber-100 border border-amber-200/20",
    button: "border border-amber-200/25 text-amber-100 hover:bg-amber-200/10",
    titleFont: "font-[var(--font-display)] tracking-[0.14em]",
  };

  const theme = selected?.theme ?? catalogTheme;

  const Shell = ({ children }) => (
    <div className={cx("min-h-screen", theme.pageBg, "text-slate-100")}>
      <div className={cx("absolute inset-0 pointer-events-none", theme.glow)} />
      <div
        className={cx(
          "absolute inset-0 pointer-events-none opacity-[0.55]",
          theme.pattern
        )}
      />
      {/* subtle grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><filter id=%22n%22 x=%220%22 y=%220%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2240%22 height=%2240%22 filter=%22url(%23n)%22 opacity=%220.45%22/></svg>')]" />
      <div className="relative z-10">{children}</div>
    </div>
  );

  // --------------------------
  // 作品ページ
  // --------------------------
  if (selected) {
    return (
      <Shell>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
          <button
            onClick={() => setSelectedWork(null)}
            className={cx(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 transition",
              "bg-white/5 backdrop-blur border",
              theme.button
            )}
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to works</span>
          </button>

          <div
            className={cx(
              "mt-8 overflow-hidden rounded-3xl border",
              theme.cardBorder,
              "bg-white/[0.04] backdrop-blur"
            )}
          >
            {/* Hero */}
            <div className="relative">
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full h-[280px] md:h-[360px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={cx(
                        "inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] tracking-[0.25em] uppercase",
                        theme.chip
                      )}
                    >
                      {selected.subtitle}
                    </span>
                    <span className={cx("text-xs", theme.subText)}>
                      {selected.characters.length} characters
                    </span>
                  </div>

                  <h1
                    className={cx(
                      "text-3xl md:text-5xl leading-tight",
                      theme.titleFont
                    )}
                  >
                    {selected.title}
                  </h1>

                  <Ornament tone={theme.tone} />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10">
              <section className="mb-10">
                <div className="flex items-center justify-between gap-4">
                  <h2 className={cx("text-lg md:text-xl", theme.accentText)}>
                    Story
                  </h2>
                </div>
                <div className="mt-3">
                  <ClampText text={selected.summary} clampLines={4} />
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between gap-4">
                  <h2 className={cx("text-lg md:text-xl", theme.accentText)}>
                    Characters
                  </h2>
                </div>

                {/* 2列グリッド（md以上） */}
                <div className="mt-5 grid gap-4 md:gap-5 md:grid-cols-2">
                  {selected.characters.map((char, idx) => (
                    <div
                      key={idx}
                      className={cx(
                        "rounded-2xl border p-5 md:p-6",
                        theme.cardBorder,
                        "bg-white/[0.03]"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={char.image}
                          alt={char.name}
                          className="w-16 h-16 md:w-18 md:h-18 rounded-full object-cover border border-white/15"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg md:text-xl font-medium">
                              {char.name}
                            </h3>
                            <span
                              className={cx(
                                "text-xs px-3 py-1 rounded-full",
                                theme.chip
                              )}
                            >
                              {char.role}
                            </span>
                          </div>

                          {/* 短文/全文トグル */}
                          <div className="mt-2">
                            <ClampText text={char.description} clampLines={3} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-xs text-slate-400">
                </p>
              </section>
            </div>
          </div>

          <footer className="mt-10 text-xs text-slate-500">
            Aru-rutan / Arumiran — Works Archive
          </footer>
        </div>
      </Shell>
    );
  }

  // --------------------------
  // 一覧ページ（トップ）
  // --------------------------
  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <header className="text-center mb-10 md:mb-14">
          <div
            className={cx(
              "text-[11px] tracking-[0.35em] uppercase",
              catalogTheme.accentText,
              "opacity-90"
            )}
          >
            Works Archive
          </div>

          <h1
            className={cx(
              "mt-3 text-4xl md:text-6xl",
              catalogTheme.titleFont
            )}
          >
            Arumiran&apos;s Works
          </h1>

          <div className="mt-5">
            <Ornament tone={catalogTheme.tone} />
          </div>

          <p className="mt-5 text-sm text-slate-300/75">
            A collection of stories and characters created by Arumiran.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => {
            const t = work.theme ?? catalogTheme;

            return (
              <button
                key={work.id}
                onClick={() => setSelectedWork(work.id)}
                className={cx(
                  "text-left rounded-3xl overflow-hidden border transition",
                  t.cardBg,
                  "focus:outline-none focus:ring-2 focus:ring-white/20",
                  t.cardBorder
                )}
              >
                <div className="relative">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={cx(
                          "inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] tracking-[0.25em] uppercase",
                          t.chip
                        )}
                      >
                        {work.subtitle}
                      </span>
                      <span className={cx("text-xs", t.subText)}>
                        {work.characters.length} characters
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className={cx("h-px w-14", t.line)} />
                      <h2 className={cx("mt-2 text-xl", t.titleFont)}>
                        {work.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-slate-200/85 leading-relaxed line-clamp-3 whitespace-pre-line">
                    {work.summary}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>Open</span>
                    <span className={cx("tracking-[0.2em]", t.accentText)}>
                      ENTER →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <footer className="mt-12 text-center text-xs text-slate-500">
          Crafted for Arumiran — Works & Characters
        </footer>
      </div>
    </Shell>
  );
};

export default WorksCatalog;
