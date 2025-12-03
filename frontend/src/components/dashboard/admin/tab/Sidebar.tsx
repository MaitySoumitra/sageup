import React from 'react';
import { House, NotePencil, Files, SignOut } from '@phosphor-icons/react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { name: 'Home', tab: 'home', Icon: House },
  { name: 'Pending Profiles', tab: 'pending-profiles', Icon: NotePencil },
  { name: 'Approved Profiles', tab: 'approved', Icon: Files },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-60 bg-white p-6 shadow-xl h-screen sticky top-0">

      <div className="flex flex-col items-center mb-8">
        <img src="/header-logo.png" alt="Vidyaru" className="h-12 w-auto" />
      </div>

      <nav>
        {navItems.map(({ name, tab, Icon }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex w-full items-center gap-3 p-3 rounded-lg mb-2 text-left 
              ${activeTab === tab ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            <Icon size={20} weight={activeTab === tab ? 'fill' : 'regular'} />
            {name}
          </button>
        ))}

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
