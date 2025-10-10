import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Home from '../pages/Home/Home';
import Task from '../pages/Task/Task';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';
import Profile from '../pages/Profile';
import KpiSystem from '../pages/KpiSystem/KpiSystem';
import Report from '../pages/Report';
import Calendar from '../pages/Calendar';
import Performance from '../pages/Performance/Performance';
import PerformancePage from '../pages/UserPerformance/PerformancePage';
import UserManagement from '../pages/UserManagement/UserManagement';

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Task />} />
        <Route path="/kpi_system" element={<KpiSystem />} />
        <Route path="/report" element={<Report />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/userperformance" element={<PerformancePage />} />
        <Route path="/performance/:slug" element={<Performance />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Route>
    </Routes>
  );
}
