import LoginPage from '@/routes/Login'
import DashboardPage from '@/routes/Dashboard';
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
