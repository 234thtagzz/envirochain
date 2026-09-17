import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div
        className="flex flex-1 flex-col transition-all duration-300 ml-64"
      >
        <div className="flex-1 overflow-y-auto">
          <Header title="EnviroChain" subtitle="Dashboard" liveIndicator />

          <main className="p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
