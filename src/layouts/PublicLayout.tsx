import { Outlet } from "react-router-dom";
import { Trees } from "lucide-react"; // 用 Trees 图标暂时代替盆景 logo

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trees className="h-6 w-6 text-green-700" />
            <span className="font-bold text-lg tracking-tight">盆景 Bonsai</span>
            <span className="hidden sm:inline-block ml-4 text-sm text-muted-foreground">
              我的项目盆景园
            </span>
          </div>
          <nav className="flex items-center gap-4">
            {/* 未来可以放登录/控制台入口 */}
            <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              关于
            </span>
          </nav>
        </div>
      </header>

      {/* 页面主要内容区 */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-8">
        <Outlet />
      </main>
      
      {/* 页脚 */}
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto px-4 sm:px-8 flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row text-sm text-muted-foreground">
          <p>
            持续培育中 · 迭代不停歇
          </p>
        </div>
      </footer>
    </div>
  );
}
