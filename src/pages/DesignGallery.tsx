import { ExternalLink, ImageIcon, Monitor, Smartphone } from "lucide-react";
import publicGardenImage from "../../design/generated-images/019de44d-3de1-7700-acff-6cef3e390712/ig_0d2634c5cb7165cd0169f4d242921c81919f1a3ddfeae8b424.png";
import projectDetailImage from "../../design/generated-images/019de44d-3de1-7700-acff-6cef3e390712/ig_0d2634c5cb7165cd0169f4d2ef734081918c662619204b40ad.png";
import timelineImage from "../../design/generated-images/019de44d-3de1-7700-acff-6cef3e390712/ig_0d2634c5cb7165cd0169f4d37271648191bfdb0f11b754691d.png";
import adminEditorImage from "../../design/generated-images/019de44d-3de1-7700-acff-6cef3e390712/ig_0d2634c5cb7165cd0169f4d3c0e26c8191b4aa664e68f78001.png";
import mobilePublicImage from "../../design/generated-images/019de44d-3de1-7700-acff-6cef3e390712/ig_0d2634c5cb7165cd0169f4d466a9d08191afc58e09e144033f.png";
import homepageManifestoCuratedImage from "../../design/generated-images/homepage-variants-2026-05-03/D06-homepage-manifesto-curated.png";
import homepageLiveChangelogImage from "../../design/generated-images/homepage-variants-2026-05-03/D07-homepage-live-changelog.png";
import homepagePrinciplesTableImage from "../../design/generated-images/homepage-variants-2026-05-03/D08-homepage-principles-table.png";
import homepageWorkshopIndexImage from "../../design/generated-images/homepage-variants-2026-05-03/D09-homepage-workshop-index.png";
import homepageLowDecorationImage from "../../design/generated-images/homepage-refinements-2026-05-03/D10-homepage-low-decoration.png";
import homepageDenseIndexImage from "../../design/generated-images/homepage-refinements-2026-05-03/D11-homepage-dense-index.png";
import homepagePersonalNarrativeImage from "../../design/generated-images/homepage-refinements-2026-05-03/D12-homepage-personal-narrative.png";

interface DesignFrame {
  code: string;
  title: string;
  role: string;
  viewport: string;
  dimensions: string;
  image: string;
  orientation: "desktop" | "mobile";
}

const frames: DesignFrame[] = [
  {
    code: "D01",
    title: "公开项目园首页",
    role: "Public Garden",
    viewport: "Desktop",
    dimensions: "1487 x 1058",
    image: publicGardenImage,
    orientation: "desktop",
  },
  {
    code: "D02",
    title: "项目详情页",
    role: "Project Detail",
    viewport: "Desktop",
    dimensions: "1487 x 1058",
    image: projectDetailImage,
    orientation: "desktop",
  },
  {
    code: "D03",
    title: "全站时间线",
    role: "Global Timeline",
    viewport: "Desktop",
    dimensions: "1487 x 1058",
    image: timelineImage,
    orientation: "desktop",
  },
  {
    code: "D04",
    title: "后台项目编辑器",
    role: "Admin Editor",
    viewport: "Desktop",
    dimensions: "1487 x 1058",
    image: adminEditorImage,
    orientation: "desktop",
  },
  {
    code: "D05",
    title: "移动端公开视图",
    role: "Mobile Public",
    viewport: "Mobile",
    dimensions: "853 x 1844",
    image: mobilePublicImage,
    orientation: "mobile",
  },
  {
    code: "D06",
    title: "首页方向 A：理念 + 优选项目",
    role: "Homepage Manifesto",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: homepageManifestoCuratedImage,
    orientation: "desktop",
  },
  {
    code: "D07",
    title: "首页方向 B：最近培育时间线",
    role: "Homepage Changelog",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: homepageLiveChangelogImage,
    orientation: "desktop",
  },
  {
    code: "D08",
    title: "首页方向 C：理念 + 项目表",
    role: "Homepage Principles",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: homepagePrinciplesTableImage,
    orientation: "desktop",
  },
  {
    code: "D09",
    title: "首页方向 D：项目索引工作坊",
    role: "Homepage Workshop",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: homepageWorkshopIndexImage,
    orientation: "desktop",
  },
  {
    code: "D10",
    title: "D09 打磨 A：低装饰项目索引",
    role: "Homepage Refinement",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: homepageLowDecorationImage,
    orientation: "desktop",
  },
  {
    code: "D11",
    title: "D09 打磨 B：高信息密度索引",
    role: "Homepage Refinement",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: homepageDenseIndexImage,
    orientation: "desktop",
  },
  {
    code: "D12",
    title: "D09 打磨 C：个人叙事索引",
    role: "Homepage Refinement",
    viewport: "Desktop",
    dimensions: "1536 x 1024",
    image: homepagePersonalNarrativeImage,
    orientation: "desktop",
  },
];

export function DesignGallery() {
  return (
    <main className="min-h-screen bg-[#f7f6f1] text-zinc-950">
      <section className="border-b border-zinc-900/10 bg-[#fbfaf6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-green-900/15 bg-green-900/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-green-900">
              <ImageIcon className="h-3.5 w-3.5" />
              Hidden Design Board
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Bonsai 原型设计图
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                固定代号用于远程讨论设计稿。以后提到 D01-D12，就按这里的编号对应。
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5 lg:w-auto">
            {frames.map((frame) => (
              <a
                key={frame.code}
                href={`#${frame.code}`}
                className="rounded-md border border-zinc-900/10 bg-white px-3 py-2 font-mono text-zinc-700 shadow-sm transition-colors hover:border-green-900/25 hover:bg-green-900/5"
              >
                {frame.code}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8">
        {frames.map((frame) => (
          <article
            id={frame.code}
            key={frame.code}
            className="overflow-hidden rounded-lg border border-zinc-900/10 bg-[#fffefa] shadow-sm"
          >
            <header className="flex flex-col gap-4 border-b border-zinc-900/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-zinc-950 font-mono text-sm font-bold text-white">
                  {frame.code}
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {frame.title}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
                    <span>{frame.role}</span>
                    <span className="text-zinc-300">/</span>
                    <span className="inline-flex items-center gap-1">
                      {frame.orientation === "mobile" ? (
                        <Smartphone className="h-3.5 w-3.5" />
                      ) : (
                        <Monitor className="h-3.5 w-3.5" />
                      )}
                      {frame.viewport}
                    </span>
                    <span className="text-zinc-300">/</span>
                    <span>{frame.dimensions}</span>
                  </div>
                </div>
              </div>
              <a
                href={frame.image}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-900/10 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:border-green-900/25 hover:text-green-900"
              >
                原图
                <ExternalLink className="h-4 w-4" />
              </a>
            </header>
            <div className="bg-[linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:24px_24px] p-3 sm:p-5">
              <div
                className={
                  frame.orientation === "mobile"
                    ? "mx-auto max-w-sm overflow-hidden rounded-md border border-zinc-900/10 bg-white shadow-md"
                    : "overflow-hidden rounded-md border border-zinc-900/10 bg-white shadow-md"
                }
              >
                <img
                  src={frame.image}
                  alt={`${frame.code} ${frame.title}`}
                  className="block h-auto w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
