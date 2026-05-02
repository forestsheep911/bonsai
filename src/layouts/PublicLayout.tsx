import { Outlet, Link } from "react-router-dom";
import {
  CalendarDays,
  FilePlus2,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Trees,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
              <Link to="/" className="hover:text-foreground transition-colors">概览</Link>
              <Link to="/projects" className="hover:text-foreground transition-colors">项目 Dashboard</Link>
              <Link to="/timeline" className="hover:text-foreground transition-colors">培育日志</Link>
              <Link to="/admin" className="hover:text-foreground transition-colors">后台</Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-3 shrink-0 ml-auto">
            <Link to="/admin/projects/new">
              <Button size="sm" className="h-9 gap-1.5 bg-green-700 hover:bg-green-800 text-white shadow-sm">
                <FilePlus2 className="h-4 w-4" />
                <span>新建项目</span>
              </Button>
            </Link>
            {/* 个人入口占位 */}
            <Avatar className="h-8 w-8 cursor-pointer border ring-offset-background hover:ring-2 hover:ring-green-700/50 hover:ring-offset-2 transition-all">
              <AvatarImage src="https://github.com/shadcn.png" alt="@owner" />
              <AvatarFallback>BW</AvatarFallback>
            </Avatar>
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
                    概览
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/projects" className="cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    项目 Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/timeline" className="cursor-pointer">
                    <CalendarDays className="h-4 w-4" />
                    培育日志
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer">
                    <FolderKanban className="h-4 w-4" />
                    后台工作台
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/projects/new" className="cursor-pointer">
                    <FilePlus2 className="h-4 w-4" />
                    新建项目
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
