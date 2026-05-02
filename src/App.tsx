import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { Home } from "./pages/Home";
import { ProjectDetail } from "./pages/ProjectDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="project/:id" element={<ProjectDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
