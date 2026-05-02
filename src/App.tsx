import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { Home } from "./pages/Home";
import { ProjectDetail } from "./pages/ProjectDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          {/* 默认渲染 Home 页面 */}
          <Route index element={<Home />} />
          {/* 项目详情页路由 */}
          <Route path="project/:id" element={<ProjectDetail />} />
        </Route>
        
        {/* 后台路由预留 */}
        {/* <Route path="/admin" element={<AdminLayout />}>
           ...
        </Route> */}
        
        {/* 未匹配路由重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
