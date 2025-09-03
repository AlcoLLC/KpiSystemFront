import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Home from "../pages/Home";
import PrivateRoute from "../components/PrivateRoute"; // -> PrivateRoute import edilir

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          // <PrivateRoute>
          <MainLayout />
          // </PrivateRoute>
        }
      >
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}
