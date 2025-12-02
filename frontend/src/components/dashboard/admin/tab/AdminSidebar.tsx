// src/components/dashboard/admin/AdminSidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { House, NotePencil, Files, SignOut } from '@phosphor-icons/react';

interface AdminSidebarProps {
  currentPath: string;
}

const navItems = [
  { name: 'Home', page: 'home', Icon: House },
  { name: 'Pending Profiles', page: 'pending-profiles', Icon: NotePencil },
  { name: 'Approved Profiles', page: 'approved', Icon: Files },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPath }) => {
  const basePath = '/admin/vidyaru-dashboard';

  const isActive = (page: string) => {
    const route = page === 'home' ? basePath : `${basePath}/${page}`;
    return currentPath.endsWith(route);
  };

  return (
    <aside className="w-60 bg-white p-6 shadow-xl h-screen sticky top-0">
      <div className="flex flex-col items-center mb-8">
        <img src="/header-logo.png" alt="Vidyaru" className="h-12 w-auto" />
      </div>

      <nav>
        {navItems.map(({ name, page, Icon }) => {
          const path = page === 'home' ? basePath : `${basePath}/${page}`;
          const active = isActive(page);

          return (
            <Link
              key={page}
              to={path}
              className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
                active ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} weight={active ? 'fill' : 'regular'} />
              {name}
            </Link>
          );
        })}

        <a
          href="/api/users/logout"
          className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 mt-6"
        >
          <SignOut size={20} />
          Logout
        </a>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
