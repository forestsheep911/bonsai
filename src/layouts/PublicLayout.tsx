import { Outlet, Link } from "react-router-dom";
import {
  CalendarDays,
  LayoutDashboard,
  Menu,
  Network,
  Trees,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* 顶部导航栏 - 产品壳 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <Trees className="h-5 w-5 text-green-700 transition-transform group-hover:scale-110" />
              <span className="font-semibold tracking-tight text-foreground">Bonsai</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">项目园</Link>
              <Link to="/overview" className="hover:text-foreground transition-colors">概览</Link>
              <Link to="/timeline" className="hover:text-foreground transition-colors">培育日志</Link>
              <Link to="/protocol" className="hover:text-foreground transition-colors">协议</Link>
            </nav>
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>导航</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    <Trees className="h-4 w-4" />
                    项目园
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/overview" className="cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    概览
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/timeline" className="cursor-pointer">
                    <CalendarDays className="h-4 w-4" />
                    培育日志
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/protocol" className="cursor-pointer">
                    <Network className="h-4 w-4" />
                    协议
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* 页面主要内容区 */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-8">
        <Outlet />
      </main>
      
      {/* 页脚 */}
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto px-4 sm:px-8 flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row text-sm text-muted-foreground">
          <p>Bonsai Project Garden · 持续培育中</p>
        </div>
      </footer>
    </div>
  );
}
