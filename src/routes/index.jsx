import LoginPage from '@/routes/Login'
import DashboardPage from '@/routes/Dashboard';
import ClientsPage from '@/routes/Clients';
import AddClientPage from '@/routes/Clients/AddClient';
import RoleManagementPage from '@/routes/RoleManagement';
import AddRolePage from '@/routes/RoleManagement/AddRole';
import { Header } from '@/UI/Layout/Header';
import UserWidget from '@/features/user/components/UserWidget';
import { useRoutes } from 'react-router-dom';

export function AppRoutes() {
  const routes = [
    {
      path: '*',
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

  const element = useRoutes([...routes]);

  return (
    <>
      {/* <Header
        rightWidget={<UserWidget />}
        menuItems={[
          { label: 'Home', href: '/', testId: 'home-link' },
          {
            label: 'Subscriptions',
            href: '/subscriptions',
            testId: 'subscription-link',
          },
        ]}
      /> */}
      {element}
    </>
  );
}
