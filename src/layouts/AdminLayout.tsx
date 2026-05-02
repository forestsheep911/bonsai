import { Outlet, Link } from "react-router-dom";
import {
  ArrowLeft,
  FilePlus2,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Settings,
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

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row font-sans">
      {/* 左侧导航 */}
      <aside className="w-full md:w-64 border-r bg-background shrink-0 flex flex-col hidden md:flex">
        <div className="h-14 border-b flex items-center px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Trees className="h-5 w-5 text-green-700 transition-transform group-hover:scale-110" />
            <span className="font-semibold tracking-tight">Bonsai Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin">
            <Button variant="ghost" className="w-full justify-start text-foreground bg-muted/50">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              工作台概览
            </Button>
          </Link>
          <Link to="/admin/projects/factory-soon">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <FolderKanban className="w-4 h-4 mr-2" />
              项目编辑
            </Button>
          </Link>
          <Link to="/admin/projects/new">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <FilePlus2 className="w-4 h-4 mr-2" />
              新建项目
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Settings className="w-4 h-4 mr-2" />
            偏好设置
          </Button>
        </nav>
        <div className="p-4 border-t text-sm text-muted-foreground">
          <Link to="/" className="flex items-center gap-2 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            返回公共视图
          </Link>
        </div>
      </aside>

      {/* 右侧主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 移动端顶部占位 */}
        <header className="h-14 border-b bg-background flex items-center justify-between px-4 md:hidden">
           <Link to="/admin" className="flex items-center gap-2">
            <Trees className="h-5 w-5 text-green-700" />
            <span className="font-semibold tracking-tight">Bonsai Admin</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>后台菜单</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin" className="cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" />
                  工作台概览
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/projects/factory-soon" className="cursor-pointer">
                  <FolderKanban className="h-4 w-4" />
                  项目编辑
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/projects/new" className="cursor-pointer">
                  <FilePlus2 className="h-4 w-4" />
                  新建项目
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/" className="cursor-pointer">
                  <ArrowLeft className="h-4 w-4" />
                  返回公共视图
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto flex flex-col relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
