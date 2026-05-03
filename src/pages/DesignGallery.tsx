import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ImageIcon,
  Monitor,
  Smartphone,
} from "lucide-react";

interface DesignFrame {
  code: string;
  title: string;
  role: string;
  viewport: string;
  dimensions: string;
  image: string;
  orientation: "desktop" | "mobile";
  group: "project-detail" | "homepage" | "foundation";
}

const foundationPath = "/design-assets/foundation";
const homepagePath = "/design-assets/homepage";
const projectDetailPath = "/design-assets/project-detail";

const frames: DesignFrame[] = [
  {
    code: "D13",
    title: "详情页方向 A：叙事档案",
    role: "Project Detail Narrative",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${projectDetailPath}/D13-project-detail-narrative-archive.png`,
    orientation: "desktop",
    group: "project-detail",
  },
  {
    code: "D14",
    title: "详情页方向 B：开发者档案",
    role: "Project Detail Dossier",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${projectDetailPath}/D14-project-detail-developer-dossier.png`,
    orientation: "desktop",
    group: "project-detail",
  },
  {
    code: "D15",
    title: "详情页方向 C：时间线优先",
    role: "Project Detail Timeline",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${projectDetailPath}/D15-project-detail-timeline-first.png`,
    orientation: "desktop",
    group: "project-detail",
  },
  {
    code: "D16",
    title: "详情页方向 D：作品展示",
    role: "Project Detail Showcase",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${projectDetailPath}/D16-project-detail-showcase.png`,
    orientation: "desktop",
    group: "project-detail",
  },
  {
    code: "D17",
    title: "详情页打磨 A：痛点优先",
    role: "Project Detail Refinement",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${projectDetailPath}/D17-project-detail-pain-first.png`,
    orientation: "desktop",
    group: "project-detail",
  },
  {
    code: "D18",
    title: "详情页打磨 B：截图主导",
    role: "Project Detail Refinement",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${projectDetailPath}/D18-project-detail-screenshot-led.png`,
    orientation: "desktop",
    group: "project-detail",
  },
  {
    code: "D19",
    title: "详情页打磨 C：故事主导",
    role: "Project Detail Refinement",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${projectDetailPath}/D19-project-detail-story-led.png`,
    orientation: "desktop",
    group: "project-detail",
  },
  {
    code: "D20",
    title: "详情页打磨 D：行动路径",
    role: "Project Detail Refinement",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${projectDetailPath}/D20-project-detail-action-path.png`,
    orientation: "desktop",
    group: "project-detail",
  },
  {
    code: "D06",
    title: "首页方向 A：理念 + 优选项目",
    role: "Homepage Manifesto",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${homepagePath}/D06-homepage-manifesto-curated.png`,
    orientation: "desktop",
    group: "homepage",
  },
  {
    code: "D07",
    title: "首页方向 B：最近培育时间线",
    role: "Homepage Changelog",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${homepagePath}/D07-homepage-live-changelog.png`,
    orientation: "desktop",
    group: "homepage",
  },
  {
    code: "D08",
    title: "首页方向 C：理念 + 项目表",
    role: "Homepage Principles",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${homepagePath}/D08-homepage-principles-table.png`,
    orientation: "desktop",
    group: "homepage",
  },
  {
    code: "D09",
    title: "首页方向 D：项目索引工作坊",
    role: "Homepage Workshop",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${homepagePath}/D09-homepage-workshop-index.png`,
    orientation: "desktop",
    group: "homepage",
  },
  {
    code: "D10",
    title: "D09 打磨 A：低装饰项目索引",
    role: "Homepage Refinement",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${homepagePath}/D10-homepage-low-decoration.png`,
    orientation: "desktop",
    group: "homepage",
  },
  {
    code: "D11",
    title: "D09 打磨 B：高信息密度索引",
    role: "Homepage Refinement",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${homepagePath}/D11-homepage-dense-index.png`,
    orientation: "desktop",
    group: "homepage",
  },
  {
    code: "D12",
    title: "D09 打磨 C：个人叙事索引",
    role: "Homepage Refinement",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: `${homepagePath}/D12-homepage-personal-narrative.png`,
    orientation: "desktop",
    group: "homepage",
  },
  {
    code: "D01",
    title: "公开项目园首页",
    role: "Public Garden",
    viewport: "Desktop",
    dimensions: "1487 x 1058",
    image: `${foundationPath}/ig_0d2634c5cb7165cd0169f4d242921c81919f1a3ddfeae8b424.png`,
    orientation: "desktop",
    group: "foundation",
  },
  {
    code: "D02",
    title: "项目详情页",
    role: "Project Detail",
    viewport: "Desktop",
    dimensions: "1487 x 1058",
    image: `${foundationPath}/ig_0d2634c5cb7165cd0169f4d2ef734081918c662619204b40ad.png`,
    orientation: "desktop",
    group: "foundation",
  },
  {
    code: "D03",
    title: "全站时间线",
    role: "Global Timeline",
    viewport: "Desktop",
    dimensions: "1487 x 1058",
    image: `${foundationPath}/ig_0d2634c5cb7165cd0169f4d37271648191bfdb0f11b754691d.png`,
    orientation: "desktop",
    group: "foundation",
  },
  {
    code: "D04",
    title: "后台项目编辑器",
    role: "Admin Editor",
    viewport: "Desktop",
    dimensions: "1487 x 1058",
    image: `${foundationPath}/ig_0d2634c5cb7165cd0169f4d3c0e26c8191b4aa664e68f78001.png`,
    orientation: "desktop",
    group: "foundation",
  },
  {
    code: "D05",
    title: "移动端公开视图",
    role: "Mobile Public",
    viewport: "Mobile",
    dimensions: "853 x 1844",
    image: `${foundationPath}/ig_0d2634c5cb7165cd0169f4d466a9d08191afc58e09e144033f.png`,
    orientation: "mobile",
    group: "foundation",
  },
];

const groups = [
  {
    key: "project-detail",
    label: "项目详情",
    description: "本次新增 D13-D20",
  },
  {
    key: "homepage",
    label: "首页",
    description: "D06-D12",
  },
  {
    key: "foundation",
    label: "早期全站",
    description: "D01-D05",
  },
] as const;

function getFrameByCode(code: string | null) {
  return frames.find((frame) => frame.code === code) ?? frames[0];
}

export function DesignGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFrame = getFrameByCode(searchParams.get("frame"));
  const activeIndex = frames.findIndex((frame) => frame.code === activeFrame.code);

  const framesByGroup = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        frames: frames.filter((frame) => frame.group === group.key),
      })),
    [],
  );

  function selectFrame(code: string) {
    setSearchParams({ frame: code });
  }

  function move(delta: number) {
    const nextIndex = Math.min(
      frames.length - 1,
      Math.max(0, activeIndex + delta),
    );
    selectFrame(frames[nextIndex].code);
  }

  return (
    <main className="min-h-screen bg-[#f7f6f1] text-zinc-950">
      <section className="border-b border-zinc-900/10 bg-[#fbfaf6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-green-900/15 bg-green-900/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-green-900">
              <ImageIcon className="h-3.5 w-3.5" />
              Lazy Design Board
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Bonsai 原型设计图
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                只渲染当前选中的设计图。点击编号才会请求对应原图，避免一次性加载历史设计稿。
              </p>
            </div>
          </div>
          <div className="rounded-md border border-zinc-900/10 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm">
            当前显示
            <span className="ml-2 font-mono font-semibold text-zinc-950">
              {activeFrame.code}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {framesByGroup.map((group) => (
            <section
              key={group.key}
              className="rounded-lg border border-zinc-900/10 bg-[#fffefa] p-3 shadow-sm"
            >
              <div className="px-1 pb-3">
                <h2 className="text-sm font-semibold text-zinc-950">
                  {group.label}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {group.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {group.frames.map((frame) => {
                  const isActive = frame.code === activeFrame.code;
                  return (
                    <button
                      key={frame.code}
                      type="button"
                      onClick={() => selectFrame(frame.code)}
                      className={`rounded-md border px-3 py-2 text-left transition-colors ${
                        isActive
                          ? "border-green-900 bg-green-900 text-white"
                          : "border-zinc-900/10 bg-white text-zinc-700 hover:border-green-900/25 hover:bg-green-900/5"
                      }`}
                    >
                      <span className="block font-mono text-sm font-bold">
                        {frame.code}
                      </span>
                      <span
                        className={`mt-1 block truncate text-xs ${
                          isActive ? "text-white/75" : "text-zinc-500"
                        }`}
                      >
                        {frame.role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </aside>

        <article className="overflow-hidden rounded-lg border border-zinc-900/10 bg-[#fffefa] shadow-sm">
          <header className="flex flex-col gap-4 border-b border-zinc-900/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-zinc-950 font-mono text-sm font-bold text-white">
                {activeFrame.code}
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  {activeFrame.title}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
                  <span>{activeFrame.role}</span>
                  <span className="text-zinc-300">/</span>
                  <span className="inline-flex items-center gap-1">
                    {activeFrame.orientation === "mobile" ? (
                      <Smartphone className="h-3.5 w-3.5" />
                    ) : (
                      <Monitor className="h-3.5 w-3.5" />
                    )}
                    {activeFrame.viewport}
                  </span>
                  <span className="text-zinc-300">/</span>
                  <span>{activeFrame.dimensions}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                disabled={activeIndex === 0}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-900/10 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:border-green-900/25 hover:text-green-900 disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                上一张
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                disabled={activeIndex === frames.length - 1}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-900/10 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:border-green-900/25 hover:text-green-900 disabled:pointer-events-none disabled:opacity-40"
              >
                下一张
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={activeFrame.image}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-900/10 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:border-green-900/25 hover:text-green-900"
              >
                原图
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </header>

          <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:24px_24px] p-3 sm:p-5">
            <div
              className={
                activeFrame.orientation === "mobile"
                  ? "mx-auto max-w-sm overflow-hidden rounded-md border border-zinc-900/10 bg-white shadow-md"
                  : "overflow-hidden rounded-md border border-zinc-900/10 bg-white shadow-md"
              }
            >
              <img
                key={activeFrame.code}
                src={activeFrame.image}
                alt={`${activeFrame.code} ${activeFrame.title}`}
                className="block h-auto w-full"
              />
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
