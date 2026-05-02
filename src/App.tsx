import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { Overview } from "./pages/Overview";
import { Home } from "./pages/Home";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Timeline } from "./pages/Timeline";
import { Protocol } from "./pages/Protocol";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ProjectEditor } from "./pages/admin/ProjectEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="overview" element={<Overview />} />
          <Route path="projects" element={<Home />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="project/:id" element={<ProjectDetail />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="protocol" element={<Protocol />} />
        </Route>
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="projects/:id" element={<ProjectEditor />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
