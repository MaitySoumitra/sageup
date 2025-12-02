import { House, Books, Buildings, Files, NotePencil, SignOut } from '@phosphor-icons/react';
import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  currentPath: string;
  userId: string;
  profileStatus: string; // 'under_review', 'approved', 'rejected'
}

const navItems = [
  { name: 'Home', page: 'home', Icon: House },
  { name: 'Course', page: 'course', Icon: Books },
  { name: 'Libraries', page: 'libraries', Icon: Buildings },
  { name: 'Review', page: 'review', Icon: NotePencil },
  { name: 'Application', page: 'application', Icon: Files },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPath, userId, profileStatus }) => {
  const basePath = `/dashboard/${userId}`;

  const isActive = (page: string) => {
    const route = page === 'home' ? basePath : `${basePath}/${page}`;
    return currentPath.endsWith(route);
  };

  // Only show full nav if profile is approved
  const visibleNavItems = profileStatus === 'approved' ? navItems : [];

  return (
    <aside className="w-60 bg-white p-6 shadow-xl h-screen sticky top-0">
      <div className="flex flex-col items-center mb-8">
        <img src="/header-logo.png" alt="Logo" className="h-12 w-auto" />
      </div>

      <nav>
        {visibleNavItems.map(({ name, page, Icon }) => {
          const path = page === 'home' ? basePath : `${basePath}/${page}`;
          const active = isActive(page);

          return (
            <Link
              key={page}
              to={path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 ${
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

export default Sidebar;
