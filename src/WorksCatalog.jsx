import React, { useMemo, useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * SVG文字列を安全な data URI に変換
 * - encodeURIComponent で壊れにくくする
 */
function svgToDataUri(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * 背景模様（SVG）
 * 重要: rgba(...) を使うと環境によって「無効→透明」扱いになり模様が消えることがある。
 * なので #ffffff + (stroke-opacity / fill-opacity) で統一して、確実に表示させる。
 */
const PATTERN_SVG = {
  catalog: `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
    <rect width="160" height="160" fill="none"/>
    <path d="M0 32H160M0 64H160M0 96H160M0 128H160" stroke="#ffffff" stroke-opacity="0.10" stroke-width="1"/>
    <path d="M32 0V160M64 0V160M96 0V160M128 0V160" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
    <circle cx="40" cy="40" r="1.5" fill="#ffffff" fill-opacity="0.18"/>
    <circle cx="120" cy="88" r="1.5" fill="#ffffff" fill-opacity="0.18"/>
    <circle cx="76" cy="132" r="1.5" fill="#ffffff" fill-opacity="0.18"/>
  </svg>`,

  sea: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
    <rect width="220" height="220" fill="none"/>
    <circle cx="110" cy="110" r="42" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>
    <circle cx="110" cy="110" r="74" fill="none" stroke="#ffffff" stroke-opacity="0.09" stroke-width="1"/>
    <circle cx="110" cy="110" r="102" fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
    <path d="M24 160c22-18 46-18 68 0s46 18 68 0 46-18 68 0"
      fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
  </svg>`,

  demon: `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
    <rect width="220" height="220" fill="none"/>
    <path d="M20 40 L110 20 L200 60 L180 150 L90 200 L30 140 Z"
      fill="none" stroke="#ffffff" stroke-opacity="0.10" stroke-width="1"/>
    <path d="M60 70 L120 55 L170 90 L150 160 L95 175 L55 130 Z"
      fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
    <path d="M40 190 L110 120 L200 200"
      fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
  </svg>`,

  postDemonWar: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
  <rect width="240" height="240" fill="none"/>

  <!-- 干渉円 -->
  <circle cx="120" cy="120" r="36" fill="none" stroke="#ffffff" stroke-opacity="0.10" stroke-width="1"/>
  <circle cx="120" cy="120" r="68" fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1"/>
  <circle cx="120" cy="120" r="102" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>

  <!-- 魔力の流れ -->
  <path d="M0 80 C60 60 120 100 180 80 210 70 230 75 240 80"
    fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1"/>
  <path d="M0 160 C70 140 130 180 200 160"
    fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>

  <!-- 星屑 -->
  <circle cx="48" cy="52" r="1.5" fill="#ffffff" fill-opacity="0.18"/>
  <circle cx="190" cy="90" r="1.2" fill="#ffffff" fill-opacity="0.15"/>
  <circle cx="140" cy="190" r="1.4" fill="#ffffff" fill-opacity="0.16"/>
</svg>`,

};

const Ornament = ({ tone = "amber" }) => {
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

  // Tailwindは動的クラスを拾えないので固定マップ化
  const clampClass =
    clampLines === 2
      ? "line-clamp-2"
      : clampLines === 4
      ? "line-clamp-4"
      : "line-clamp-3";

  return (
    <div>
      <p
        className={cx(
          "text-slate-200/85 leading-relaxed whitespace-pre-line",
          !open && clampClass
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

  // ★ Characters と 相関図は「同列」なので state も別々
  const [charactersOpen, setCharactersOpen] = useState(true);
  const [relationsOpen, setRelationsOpen] = useState(true);

  const works = useMemo(
    () => [
      {
        id: 1,
        title: "王女のブルーアネモネ号",
        subtitle: "The H.R.H.S Blue Anemone",
        image: "/characters/all.jpg",
        theme: {
          pageBg: "bg-[#071524]",
          glow:
            "bg-[radial-gradient(1000px_circle_at_15%_10%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(14,165,233,0.18),transparent_55%),radial-gradient(900px_circle_at_50%_95%,rgba(255,255,255,0.06),transparent_55%)]",
          patternKey: "sea",
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
        summary: "王女のブルーアネモネ号",

        // ★相関図：ここに画像パスをコピペで増やすだけ
        relationImages: ["/characters/bs1.jpg", "/characters/bs2.jpg"],

        characters: [
          {
            name: "アドニス（20）",
            role: "船長",
            description:
              "北の海の海賊、ケートスの息子で、西国に処刑されるはずだったが、処刑直前でなぜかグッドマン伯爵に助けられた。\n行方不明となった妹のイヴを探し出すため伯爵と取引をし、以降私掠船プリンセス・ブルーアネモネ号の船長として西国の私掠に加担している。\n温和で思慮深く慕われているが、たまにずれている。\n操船術や自然の観察力に長けており、航海士としての腕は超一流。",
            image: "/characters/adonis.jpg",
          },
          {
            name: "ビル（20）",
            role: "クルー",
            description:
              "貧民街の生まれで過酷な幼少期をすごす。\n文字も読めず言葉もまともに発せなかったが、まだ海賊の卵だったアドニスと妹ティナに出会い、生きる術を教わった。\n自身を地獄から救い出してくれた二人に恩を感じており、以来忠誠を尽くしている。\n無口だが情に厚い男。",
            image: "/characters/bill.jpg",
          },
          {
            name: "ペトラ（16）",
            role: "船医",
            description:
              "中流階級の医師の一人娘。女の身の生きづらさから、自由を求めて船に乗り込んだ。\n船上戦での負傷者を救護する姿から、女とバレてしまった後も船医としても重宝されている。\nしっかり者で男勝りな性格だけど、ちゃんと乙女な一面も。\n実は海賊時代のアドニスと面識があり、ペトラの初恋の人だったり。",
            image: "/characters/petra.jpg",
          },
          {
            name: "ランポート（24）",
            role: "主計長",
            description:
              "大貴族であるウルクス子爵家の現当主だが、ブルーアネモネ号の出資者かつ亡き父の借金の債権者であるグッドマン伯爵の要求で仕方なく主計長としてブルーアネモネ号に乗り込んでいる。\nその正体を知っているのは今のところアドニスとビルのみ。\n博学かつ社交界特有の立ち回りが上手く、貴族の間では「賢者」と名高いが、船の上ではパンガ相手にしょっちゅう怒ってる。\n婚約者がいるが、あまり会えず申し訳ないと思っている。",
            image: "/characters/lamport.jpg",
          },
          {
            name: "パンガ（18）",
            role: "クルー",
            description:
              "積まれていた奴隷船が難破し岸に流れ着いたところに、停泊中のブルーアネモネ号を発見。\n故郷の島を見つけるまでと言い張って勝手に乗船している。\n粗野で無遠慮な振舞いからしょっちゅうランポートを怒らせているが、本人は大して気にしていない。\n戦闘舞踏民族で踊りが得意。\n大食いだが料理も上手く、船員たちの胃袋をつかんでいる。",
            image: "/characters/panga.jpg",
          },
          {
            name: "ヘイゼル･ド･ヴィクトーニャ（17）",
            role: "—",
            description:
              "ランポートの婚約者。ある私掠船の船員に身分違いの恋をしたと苛まれていたが、それは婚約者のランポートが扮した姿だった。\nランポートは隠しているようなので、いつか彼から話してくれるまで健気に陸で待ち続けている。\n引っ込み思案で恥ずかしがりな性格。",
            image: "/characters/hazel.jpg",
          },
          { name: "イヴ", role: "—", description: "準備中", image: "/characters/eve.jpg" },
          {
            name: "ソフィア",
            role: "—",
            description: "準備中",
            image: "/characters/sophia.jpg",
          },
          { name: "テオ", role: "—", description: "準備中", image: "/characters/theo.jpg" },
          {
            name: "オルド・ポルトロッド",
            role: "—",
            description: "準備中",
            image: "/characters/ordo.jpg",
          },
          {
            name: "ケートス",
            role: "—",
            description: "準備中",
            image: "/characters/cetus.jpg",
          },
          { name: "ミラ", 
            role: "—", 
            description: "準備中", 
            image: "/characters/mira.jpg" },
        ],
      },
      {
        id: 2,
        title: "悪魔シリーズ",
        subtitle: "Demon Series",
        image: "/characters/king.jpg",
        theme: {
          pageBg: "bg-[#11060D]",
          glow:
            "bg-[radial-gradient(1000px_circle_at_20%_10%,rgba(244,63,94,0.14),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(168,85,247,0.13),transparent_55%),radial-gradient(900px_circle_at_40%_95%,rgba(255,255,255,0.05),transparent_55%)]",
          patternKey: "demon",
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

        // ★相関図：ここに画像パスをコピペで増やすだけ
        relationImages: ["/characters/ds.jpg"],

        characters: [
          {
            name: "ミリオン",
            role: "—",
            description:
              "人間の血が半分混じっている。\n妖艶な美しい見た目とは反対に結構パワータイプ。\n堅気で情に厚い男。\n目的のためなら手段を選ばない父であるギムレットのやり方に憤り、一矢報いることを決意する。",
            image: "/characters/million.jpg",
          },
          {
            name: "カーマ",
            role: "—",
            description:
              "面白いことが大好きな異教の悪魔。\nギムレットの悪事の片棒を担っていたが、妻の死、ミリオンの勧誘をきっかけに彼の元を離れた。",
            image: "/characters/karma.jpg",
          },
          {
            name: "ギムレット",
            role: "—",
            description:
              "下級悪魔のインキュバスの身でありながら、地獄の支配者階級に最も近い位置まで昇りつめた。\n彼の野心は留まるところを知らない。",
            image: "/characters/gimlet.jpg",
          },
          {
            name: "ルシファー",
            role: "王",
            description:
              "神との戦いに敗れ堕天。\n最高位であったその手腕で法による地獄の統治を試みるなど、以降王として君臨する。\nただし彼の威厳は本命の前では無力になるようだ。",
            image: "/characters/lucifer.jpg",
          },
          {
            name: "アスモデウス",
            role: "—",
            description:
              "地獄のあらゆるセクシーを取り仕切るお姉さま。\nギムレットに捨てられ行き場のないミリオンとまだ赤子だった妹を拾い育ててくれた。\nミリオンにとっては上司であり恩人。",
            image: "/characters/asmodeus.jpg",
          },
          {
            name: "ベルフェゴール",
            role: "怠惰の悪魔",
            description:
              "なにもかもがめんどくさくてしょうがない怠惰の悪魔。\nとりあえず寝てるから起こさないで。",
            image: "/characters/belphegor.jpg",
          },
          {
            name: "マモン",
            role: "—",
            description:
              "かつては人間の魔導士であった。\n自身の欲が満たされるなら他のことはわりとなんでもいい。\n地獄の中で最も悪魔らしい悪魔かもしれない。",
            image: "/characters/mammon.jpg",
          },
          {
            name: "ベルゼブブ",
            role: "—",
            description:
              "かつては豊穣の神であったが、異教として貶められ悪魔となった。\n満たされない飢えという業をせおっている。",
            image: "/characters/beelzebub.jpg",
          },
          {
            name: "鰐梨淡香（21）",
            role: "—",
            description:
              "グラクラの恋人で愛が重ための女子大学生。\n幼少期、毒親だった両親を殺されたことをきっかけにグラクラに惚れ、執拗に探し続けついに大学で再会を果たした。\nグラクラが人間でないことは割とどうでもよく、自分さえ見ててくれればそれでいいと思っている。\nふらふらしがちなグラクラにキレて何回も刺したことがある。",
            image: "/characters/ayaka.jpg",
          },
          {
            name: "グラクラ",
            role: "—",
            description:
              "九官鳥の悪魔。自由自在に声色を操り、人間を騙し誘い出す。\nリヴァイアサンの側近兼友として地獄に人を導く役割を担っていたが、リヴァイアサンがギムレットに殺された際自身も深手を追い、人間界へと逃げ堕ちた。\n傷の手当てをしてくれた淡香に対価を払うため、(食事のついでに)両親を殺したことで淡香に惚れられてしまう。\n淡香と付き合ってる方が面白そうだという理由で、地獄に戻らず人の姿で暮らしている。\n時々刺されるが、そんなところがかわいいらしい。",
            image: "/characters/gracula.jpg",
          },
        ],
      },
            {
        id: 3,
        title: "人類と魔族が手を取り合った後の話",
        subtitle: "Post Demon War",
        image: "/characters/pdw.jpg",
        theme: {
          pageBg: "bg-[#120A1F]", // 濃い紫
          glow:
            "bg-[radial-gradient(1000px_circle_at_20%_15%,rgba(168,85,247,0.22),transparent_55%),radial-gradient(900px_circle_at_80%_25%,rgba(236,72,153,0.14),transparent_55%),radial-gradient(900px_circle_at_50%_95%,rgba(255,255,255,0.05),transparent_55%)]",
          patternKey: "postDemonWar", // ★新しい模様キー
          tone: "rose", // 既存の rose を流用
          accentText: "text-fuchsia-100",
          subText: "text-fuchsia-100/70",
          line: "bg-fuchsia-200/30",
          cardBorder: "border-fuchsia-100/15",
          cardBg: "bg-white/[0.04] hover:bg-white/[0.06]",
          chip:
            "bg-fuchsia-100/10 text-fuchsia-50 border border-fuchsia-100/20 backdrop-blur",
          button:
            "border border-fuchsia-100/25 text-fuchsia-50 hover:bg-fuchsia-100/10",
          titleFont: "font-[var(--font-display)] tracking-[0.12em]",
        },

        summary: "人類と魔族が手を取り合った後の話",

        // ★相関図：ここに画像パスをコピペで増やすだけ
        //relationImages: ["/characters/bs1.jpg", "/characters/bs2.jpg"],

        characters: [
          {
            name: "魔王（????）",
            role: "魔王",
            description:
              "自身の莫大な魔力に対等に向き合える者がおらず、ずっと魔王城に引きこもっていた。\n何千年も前から一度も外に出ていない。\n世間知らずな天然。\n勇者のことをはじめての対等な友人として気に入っている。",
            image: "/characters/demon.jpg",
          },
          {
            name: "コスモ（18）",
            role: "勇者",
            description:
              "世界の声の導きにより、勇者として立ち上がった。\n圧倒的な魔力量を誇る魔王に魔族は心酔していること、魔王は引きこもっていることを知り、最後の闘いで魔王に和平を持ちかける。\n最終決戦で魔王と互角に闘い勝利するなど普通に強い。",
            image: "/characters/cosmo.jpg",
          },
          {
            name: "ヴィヴィアン（98）",
            role: "戦乙女",
            description:
              "優しく、強く、美しく、礼儀正しいお姉さん。\n世界の声を勇者に伝え、ともに魔王討伐の旅に出た。\n清楚そうな顔をして、わりと不純なことに興味がある。",
            image: "/characters/vivian.jpg",
          },
          {
            name: "モニカ（17）",
            role: "主計長",
            description:
              "我こそ至高の魔法使いと自負していたが、過去魔王に挑み力の差を思い知った。\nプライドが高く負けず嫌い。\n魔王に再度挑むべく、勇者一行に加わった。",
            image: "/characters/monica.jpg",
          },
          {
            name: "エド（55）",
            role: "武器商人",
            description:
              "温厚かつ朗らかな老人。\nまったりとしているが、武具にかける情熱は誰にも負けない。",
            image: "/characters/ed.jpg",
          },
          {
            name: "アマンダ（????）",
            role: "ナイトメア",
            description:
              "魔王の側近。\n魔王が魔王であった時から仕えているとか。\n魔王に絶対的な忠誠を誓っている。\n魔族の名づけは魔王が行う。\nこの名前を気に入っているらしい。",
            image: "/characters/amanda.jpg",
          },
        ],
      },
    ],
    []
  );

  // ===== ここから「戻る/進む対応」 =====
  useEffect(() => {
    const syncFromUrl = () => {
      const path = window.location.pathname;
      const m = path.match(/^\/works\/(\d+)$/);

      if (m) {
        const id = Number(m[1]);
        setSelectedWork(Number.isFinite(id) ? id : null);
      } else {
        setSelectedWork(null);
      }
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const openWork = (id) => {
    setSelectedWork(id);
    window.history.pushState({}, "", `/works/${id}`);
  };

  const closeWork = () => {
    setSelectedWork(null);
    window.history.pushState({}, "", `/`);
  };

  // 作品切り替え時は、Characters と 相関図を開いた状態に戻す
  useEffect(() => {
    setCharactersOpen(true);
    setRelationsOpen(true);
  }, [selectedWork]);
  // ===== ここまで =====

  const selected = selectedWork ? works.find((w) => w.id === selectedWork) : null;

  const catalogTheme = {
    pageBg: "bg-[#0A0C12]",
    glow:
      "bg-[radial-gradient(1000px_circle_at_15%_10%,rgba(245,158,11,0.14),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(59,130,246,0.10),transparent_55%),radial-gradient(900px_circle_at_50%_95%,rgba(255,255,255,0.06),transparent_55%)]",
    patternKey: "catalog",
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

  const patternUri = svgToDataUri(
    PATTERN_SVG[theme.patternKey] ?? PATTERN_SVG.catalog
  );

  const Shell = ({ children }) => (
    <div className={cx("min-h-screen relative", theme.pageBg, "text-slate-100")}>
      <div className={cx("absolute inset-0 pointer-events-none", theme.glow)} />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.75]"
        style={{
          backgroundImage: `url("${patternUri}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      />

      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><filter id=%22n%22 x=%220%22 y=%220%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2240%22 height=%2240%22 filter=%22url(%23n)%22 opacity=%220.45%22/></svg>')]" />

      <div className="relative z-10">{children}</div>
    </div>
  );

  // --------------------------
  // 作品ページ
  // --------------------------
  if (selected) {
    const relationImages = Array.isArray(selected.relationImages)
      ? selected.relationImages
      : [];

    return (
      <Shell>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
          <button
            onClick={closeWork}
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

              {/* ==========================
                  Characters（独立トグル）
              ========================== */}
              <section className="mb-10">
                <button
                  type="button"
                  onClick={() => setCharactersOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-4"
                >
                  <h2 className={cx("text-lg md:text-xl", theme.accentText)}>
                    Characters
                  </h2>

                  <span className="inline-flex items-center gap-2 text-xs text-white/70">
                    {charactersOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                    {charactersOpen ? "閉じる" : "開く"}
                  </span>
                </button>

                {charactersOpen && (
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

                            <div className="mt-2">
                              <ClampText text={char.description} clampLines={3} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ==========================
                  相関図（独立トグル / Charactersと同列）
              ========================== */}
              <section>
                <button
                  type="button"
                  onClick={() => setRelationsOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-4"
                >
                  <h2 className={cx("text-lg md:text-xl", theme.accentText)}>
                    Relationship Chart
                  </h2>

                  <span className="inline-flex items-center gap-2 text-xs text-white/70">
                    {relationsOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                    {relationsOpen ? "閉じる" : "開く"}
                  </span>
                </button>

                {relationsOpen && (
                  <div className="mt-4 grid gap-4">
                    {relationImages.length > 0 ? (
                      relationImages.map((src, i) => (
                        <div
                          key={i}
                          className={cx(
                            "mx-auto w-full max-w-[560px] lg:max-w-[640px]",
                            "overflow-hidden rounded-2xl border",
                            theme.cardBorder,
                            "bg-white/[0.03]"
                          )}
                        >
                          <img
                            src={src}
                            alt={`Relationship Chart ${i + 1}`}
                            className="block w-full h-auto object-contain max-h-[70vh]"
                            loading="lazy"
                          />
                        </div>
                      ))
                    ) : (
                      <p className={cx("mt-3 text-sm", theme.subText)}>
                        Relationship Chart is preparing
                      </p>
                    )}
                  </div>
                )}

                <p className="mt-6 text-xs text-slate-400"></p>
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

          {/* ★ここが Arumiran's Works の表記変更箇所 */}
          <h1
            className={cx("mt-3 text-4xl md:text-6xl", catalogTheme.titleFont)}
          >
            Arumiran&apos;s Works
          </h1>

          <div className="mt-5">
            <Ornament tone={catalogTheme.tone} />
          </div>

          <p className="mt-5 text-sm text-slate-300/75">
            あるみらん / Arumiranの作品アーカイブ
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => {
            const t = work.theme ?? catalogTheme;

            return (
              <button
                key={work.id}
                onClick={() => openWork(work.id)}
                className={cx(
                  "text-left rounded-3xl overflow-hidden border",
                  "transform-gpu transition duration-200 ease-out",
                  "hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,0,0,0.28)]",
                  "focus:outline-none focus:ring-2 focus:ring-white/20",
                  t.cardBg,
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
                    <span></span>
                    <span className={cx("tracking-[0.2em]", t.accentText)}>
                      ENTER →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Author section */}
        <section className="mt-16 flex flex-col items-center text-center gap-3">
          <img
            src="/arumiran.png"
            alt="あるみらん / Arumiran"
            className="w-20 h-20 rounded-full border border-white/20"
          />

          <p className="mt-2 text-lg font-semibold tracking-wide text-slate-100">
            あるみらん / Arumiran
          </p>

          <p className="text-sm text-slate-300/80">
            ビジュアルストーリーテラー･創作家
          </p>

          <p className="mt-2 text-sm text-slate-200/80 leading-relaxed max-w-md">
            漫画・絵画・イラスト・映像など複数の表現で、
            物語性のあるオリジナルIPを制作。<br />
            感情、物語を軸に世界を描いています。
          </p>

          <a
            href="https://lit.link/arurutan"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-sm text-amber-200 hover:text-amber-100 transition underline underline-offset-4"
          >
            litlink（ご依頼・ポートフォリオ・SNSはこちら）
          </a>

          <p className="mt-2 text-sm text-slate-300/80">
            お仕事のご相談（個人の方も歓迎）<br />
            <a
              href="mailto:arararararura@gmail.com"
              className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-slate-100 transition"
            >
              ✉️ arararararura@gmail.com
            </a>
          </p>
        </section>

        <footer className="mt-12 text-center text-xs text-slate-500">
          Crafted for Arumiran — Works & Characters
        </footer>
      </div>
    </Shell>
  );
};

export default WorksCatalog;
