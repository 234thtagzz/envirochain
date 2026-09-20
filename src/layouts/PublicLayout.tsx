import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 overflow-y-auto no-scrollbar">
      <Outlet />
    </div>
  );
}
