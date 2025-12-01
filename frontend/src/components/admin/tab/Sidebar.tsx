import { House, Books, Buildings, Files, NotePencil, SignOut } from '@phosphor-icons/react';
import React from 'react';
import { Link } from 'react-router-dom'; // 👈 Import Link

interface SidebarProps {
  currentPath: string; // The full path from useLocation()
  userId: string;
}

// Define nav items with their relative paths
const navItems = [
  { name: 'Home', page: 'home', Icon: House },
  { name: 'Course', page: 'course', Icon: Books },
  { name: 'Libraries', page: 'libraries', Icon: Buildings },
  { name: 'Review', page: 'review', Icon: NotePencil },
  { name: 'Application', page: 'application', Icon: Files },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPath, userId }) => {
  // Determine the base path (e.g., /dashboard/tutor-123)
  const basePath = `/admin/dashboard/${userId}`;

  // Helper function to check if the current path matches the item path
const isActive = (page: string) => {
  const route = page === 'home' ? basePath : `${basePath}/${page}`;
  return currentPath.endsWith(route);
};

  
  return (
    <aside className="w-60 bg-white p-6 shadow-xl h-screen sticky top-0">
      <div className="flex flex-col items-center mb-8">
        <div className="text-3xl font-extrabold text-blue-600">EduHub</div>
      </div>

      <nav>
        {navItems.map(({ name, page, Icon }) => {
          const path = page === 'home' ? basePath : `${basePath}/${page}`;
          const active = isActive(page);

          return (
            <Link // 👈 Use the Link component
              key={page}
              to={path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 ${
                active
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} weight={active ? "fill" : "regular"} />
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