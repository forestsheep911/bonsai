import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Menu,
  Trees,
  Search,
  Sprout,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function NavLink({ to, children, disabled }: { to: string; children: React.ReactNode; disabled?: boolean }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  if (disabled) {
    return (
      <span className="relative px-1 py-1 text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
        {children}
      </span>
    );
  }
  
  return (
    <Link 
      to={to} 
      className={`relative px-1 py-1 text-sm font-medium transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
    >
      {children}
      {isActive && (
        <span className="absolute left-0 right-0 -bottom-[19px] h-[2px] bg-foreground rounded-t-sm" />
      )}
    </Link>
  );
}

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* 顶部导航栏 - 产品壳 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto box-border flex h-14 items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-8 shrink-0 min-w-0">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <Trees className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              <span className="font-semibold tracking-tight text-foreground truncate">盆景 Bonsai</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 h-full pt-1 shrink-0">
              <NavLink to="/">首页</NavLink>
              <NavLink to="/timeline">时间线</NavLink>
              <NavLink to="/about" disabled>关于</NavLink>
              <NavLink to="/log" disabled>日志</NavLink>
            </nav>
          </div>
          
          {/* 右侧工具栏 */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="搜索项目" 
                className="h-9 w-48 rounded-md border border-input bg-transparent pl-9 pr-10 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex text-muted-foreground">
                <span className="text-xs">/</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-muted-foreground hover:text-foreground">
              <Sprout className="h-4 w-4" />
              园丁模式
            </Button>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild><Link to="/">首页</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/timeline">时间线</Link></DropdownMenuItem>
                <DropdownMenuItem disabled>关于 (建设中)</DropdownMenuItem>
                <DropdownMenuItem disabled>日志 (建设中)</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Sprout className="h-4 w-4 mr-2" /> 园丁模式
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* 页面主要内容区 */}
      <main className="mx-auto box-border w-full max-w-[1440px] min-w-0 flex-1 px-4 py-8 sm:px-8 md:py-12">
        <Outlet />
      </main>
      
      {/* 页脚 */}
      <footer className="border-t py-8 md:py-0">
        <div className="container mx-auto box-border flex flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:px-8 md:h-16 md:flex-row">
          <div className="flex items-center gap-2">
            <Trees className="h-4 w-4 shrink-0" />
            <span>© 2026 Bonsai 盆景 · Built with care</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="https://github.com/forestsheep911/bonsai" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">状态</a>
            <a href="#" className="hover:text-foreground transition-colors">隐私</a>
            <a href="#" className="hover:text-foreground transition-colors">条款</a>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0">
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
