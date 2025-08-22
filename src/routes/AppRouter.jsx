import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import KpiList from "../pages/KpiList";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<KpiList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
