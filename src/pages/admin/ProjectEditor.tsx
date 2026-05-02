import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mockProjects } from "@/data/mock";
import { projectStatusMeta, type ProjectStatus } from "@/domain/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Save, Plus, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

export function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";
  const project = isNew ? undefined : mockProjects.find((p) => p.slug === id || p.id === id);

  const [name, setName] = useState(project?.name || (isNew ? "" : "未命名项目"));
  const [summary, setSummary] = useState(project?.summary || "");
  const [status, setStatus] = useState<ProjectStatus>(project?.status || "idea");
  const [story, setStory] = useState(project?.story || "");
  const [tags, setTags] = useState<string[]>(project?.tags || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // Simulate real saving flow: go back to project view or admin dashboard
      navigate(isNew ? "/projects" : `/projects/${project?.slug || id}`);
    }, 800); // 模拟保存
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* 顶部路径与操作区 */}
      <header className="h-14 border-b flex items-center justify-between px-6 shrink-0 bg-background/95 backdrop-blur z-10 sticky top-0">
        <nav className="flex items-center text-sm font-medium text-muted-foreground">
          <Link to="/admin" className="hover:text-foreground transition-colors">工作台</Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="text-foreground">{isNew ? "新建项目" : (name || "未命名项目")}</span>
        </nav>
        <div className="flex items-center gap-3">
           <Button variant="ghost" size="sm" className="h-8" onClick={handleCancel}>取消</Button>
           <Button size="sm" className="h-8 bg-green-700 hover:bg-green-800 text-white shadow-sm" onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "保存中..." : (isNew ? "创建项目" : "保存更改")}
           </Button>
        </div>
      </header>

      {/* 主表单区域 */}
      <div className="flex-1 overflow-auto p-6 md:p-8 pb-32">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* 基本信息 */}
          <section className="space-y-6">
             <div>
               <h2 className="text-lg font-bold tracking-tight mb-4 border-b pb-2">基本信息</h2>
               <div className="grid gap-6">
                 <div className="grid gap-2">
                   <Label htmlFor="name">项目名称</Label>
                   <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="max-w-md font-semibold text-lg h-10" />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="summary">一句话简介</Label>
                   <Input id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} className="max-w-2xl" placeholder="例如：小型工厂建造与管理模拟器。" />
                 </div>
               </div>
             </div>
          </section>

          {/* 状态与元数据 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-6">
               <h2 className="text-lg font-bold tracking-tight mb-4 border-b pb-2">当前状态</h2>
               <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg w-fit border">
                 {(Object.entries(projectStatusMeta) as [ProjectStatus, typeof projectStatusMeta[ProjectStatus]][]).map(([key, meta]) => (
                   <button
                     key={key}
                     onClick={() => setStatus(key)}
                     className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${
                       status === key 
                        ? "bg-background shadow-sm text-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                     }`}
                   >
                     <span>{meta.icon}</span>
                     {meta.label}
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-6">
                <h2 className="text-lg font-bold tracking-tight mb-4 border-b pb-2">标签与分类</h2>
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pr-1 font-normal border shadow-sm">
                        {tag}
                        <button className="ml-1 hover:bg-muted rounded-full p-0.5" onClick={() => setTags(tags.filter(t => t !== tag))}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="h-6 text-xs border-dashed">
                      <Plus className="w-3 h-3 mr-1" />
                      添加标签
                    </Button>
                  </div>
                </div>
             </div>
          </section>

          {/* 媒体与链接占位 */}
          <section className="space-y-6">
             <h2 className="text-lg font-bold tracking-tight mb-4 border-b pb-2">封面与链接</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 h-32 hover:bg-muted/20 transition-colors cursor-pointer">
                   <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                   <span className="text-sm font-medium">点击上传封面图片</span>
                   <span className="text-xs mt-1">推荐比例 16:9, 小于 2MB</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-muted/20 border rounded-md p-2.5 text-sm">
                     <div className="flex items-center gap-2">
                       <LinkIcon className="w-4 h-4 text-muted-foreground" />
                       <span className="font-medium">GitHub</span>
                       <span className="text-muted-foreground ml-2 truncate max-w-[150px]">github.com/bonsai-dev/demo</span>
                     </div>
                     <Button variant="ghost" size="icon" className="h-6 w-6"><X className="w-3 h-3" /></Button>
                  </div>
                  <Button variant="outline" size="sm" className="w-full border-dashed">
                    <Plus className="w-4 h-4 mr-2" />
                    添加链接 (Website, Demo, 等)
                  </Button>
                </div>
             </div>
          </section>

          {/* 项目故事 (Markdown 编辑与预览并排) */}
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b pb-2">
               <h2 className="text-lg font-bold tracking-tight">项目故事</h2>
               <div className="text-xs text-muted-foreground flex items-center gap-2">
                  支持 Markdown 格式
               </div>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
               <div className="flex flex-col">
                 <Textarea 
                   className="flex-1 min-h-[500px] font-mono text-sm resize-y leading-relaxed bg-muted/10 border shadow-inner p-4 focus-visible:ring-1 focus-visible:ring-green-700/50" 
                   value={story}
                   onChange={(e) => setStory(e.target.value)}
                   placeholder="写下这个项目的起源、过程和收获..."
                 />
               </div>
               <div className="flex flex-col border rounded-md bg-background p-6 overflow-auto max-h-[700px] shadow-sm">
                 <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground/90 leading-loose">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                     {story || "*在此处预览 Markdown 内容*"}
                   </ReactMarkdown>
                 </div>
               </div>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}
