import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">KPI System</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link to="/">Dashboard</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
      
    </div>
  );
}
