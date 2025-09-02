import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
