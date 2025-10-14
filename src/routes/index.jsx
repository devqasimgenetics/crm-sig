import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';

import LoginPage from '@/routes/Login';
import DashboardPage from '@/routes/Dashboard';
import ClientsPage from '@/routes/Clients';
import AddClientPage from '@/routes/Clients/AddClient';
import RoleManagementPage from '@/routes/RoleManagement';
import AddRolePage from '@/routes/RoleManagement/AddRole';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserWidget from '@/features/user/components/UserWidget';

export function AppRoutes() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const routes = [
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardPage />,
    },
    {
      path: '/clients',
      element: <ClientsPage />,
    },
    {
      path: '/clients/add',
      element: <AddClientPage />,
    },
    {
      path: '/role-management',
      element: <RoleManagementPage />,
    },
    {
      path: '/role-management/add',
      element: <AddRolePage />,
    },
  ];

  const element = useRoutes(routes);

  // hide Header & Sidebar on login route
  const isLoginPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex bg-gray-50">
      {!isLoginPage && (
        <Sidebar 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
      )}

      {/* Main Content Wrapper */}
      <div 
        className={`
          flex flex-col flex-1 min-w-0
          transition-all duration-300 ease-in-out
          ${!isLoginPage 
            ? isCollapsed 
              ? 'lg:ml-20' 
              : 'lg:ml-64' 
            : ''
          }
        `}
      >
        {!isLoginPage && (
          <Header
            rightWidget={<UserWidget />}
            menuItems={[
              { label: 'Home', href: '/dashboard', testId: 'home-link' },
              { label: 'Clients', href: '/clients', testId: 'clients-link' },
            ]}
          />
        )}

        {/* Main Content Area - Full Width */}
        <main 
          className={`
            flex-1 w-full
            overflow-x-hidden
            ${!isLoginPage ? 'bg-gray-50' : 'bg-white'}
          `}
        >
          {element}
        </main>
      </div>
    </div>
  );
}