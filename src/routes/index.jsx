import { useState, useMemo, Suspense, lazy, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useRoutes, Navigate } from 'react-router-dom';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserWidget from '@/features/user/components/UserWidget';
import ProtectedRoute from '@/components/ProtectedRoute';
import { RouteLoadingFallback } from '@/components/LoadingSpinner';

import { getUserRole } from '@/utils/authUtils';
import { ROUTES, getAllowedRoutes } from '@/config/roleConfig';

// ⭐ Lazy load route components with webpackPrefetch for better performance
const LoginPage = lazy(() => import(/* webpackPrefetch: true */ '@/routes/Login'));
const DashboardPage = lazy(() => import(/* webpackPrefetch: true */ '@/routes/Dashboard'));
const ClientsPage = lazy(() => import(/* webpackPrefetch: true */ '@/routes/Clients'));
const AddClientPage = lazy(() => import(/* webpackPrefetch: true */ '@/routes/Clients/AddClient'));
const LeadsPage = lazy(() => import(/* webpackPrefetch: true */ '@/routes/Leads'));
const AddLeadPage = lazy(() => import(/* webpackPrefetch: true */ '@/routes/Leads/AddLead'));
const BranchesPage = lazy(() => import(/* webpackPrefetch: true */ '@/routes/Branches'));
const AddBranchPage = lazy(() => import(/* webpackPrefetch: true */ '@/routes/Branches/AddBranch'));
const RoleManagementPage = lazy(() => import(/* webpackPrefetch: true */ '@/routes/RoleManagement'));
const AddRolePage = lazy(() => import(/* webpackPrefetch: true */ '@/routes/RoleManagement/AddRole'));

export function AppRoutes() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Memoize user role - only recalculate when location changes (after navigation)
  const userRole = useMemo(() => getUserRole(), [location.pathname]);
  
  // Memoize allowed routes to avoid repeated calculations
  const allowedRoutes = useMemo(() => getAllowedRoutes(userRole), [userRole]);

  // Preload routes after login to avoid delays
  // useEffect(() => {
  //   // Only preload after authentication (not on login page)
  //   if (location.pathname !== '/') {
  //     // Preload common routes in the background
  //     const preloadTimer = setTimeout(() => {
  //       DashboardPage.preload?.();
  //       ClientsPage.preload?.();
  //       LeadsPage.preload?.();
  //     }, 100); // Small delay to not block initial render

  //     return () => clearTimeout(preloadTimer);
  //   }
  // }, [location.pathname]);

  // Define all routes with protection and Suspense
  const allRoutes = [
    {
      path: '/',
      element: (
        <Suspense fallback={<RouteLoadingFallback />}>
          <LoginPage />
        </Suspense>
      ),
    },
    {
      path: '/dashboard',
      element: (
        // <ProtectedRoute requiredRoute={ROUTES.DASHBOARD}>
          // <Suspense fallback={<RouteLoadingFallback type="dashboard" />}>
            <DashboardPage />
          // </Suspense>
        // </ProtectedRoute>
      ),
    },
    {
      path: '/agent',
      element: (
        <ProtectedRoute requiredRoute={ROUTES.AGENT}>
          <Suspense fallback={<RouteLoadingFallback type="table" />}>
            <ClientsPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: '/agent/add',
      element: (
        <ProtectedRoute requiredRoute={ROUTES.AGENT_ADD}>
          <Suspense fallback={<RouteLoadingFallback type="form" />}>
            <AddClientPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: '/leads',
      element: (
        <ProtectedRoute requiredRoute={ROUTES.LEADS}>
          <Suspense fallback={<RouteLoadingFallback type="table" />}>
            <LeadsPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: '/lead/add',
      element: (
        <ProtectedRoute requiredRoute={ROUTES.LEAD_ADD}>
          <Suspense fallback={<RouteLoadingFallback type="form" />}>
            <AddLeadPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: '/branches',
      element: (
        <ProtectedRoute requiredRoute={ROUTES.BRANCHES}>
          <Suspense fallback={<RouteLoadingFallback type="table" />}>
            <BranchesPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: '/branch/add',
      element: (
        <ProtectedRoute requiredRoute={ROUTES.BRANCH_ADD}>
          <Suspense fallback={<RouteLoadingFallback type="form" />}>
            <AddBranchPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: '/role-management',
      element: (
        <ProtectedRoute requiredRoute={ROUTES.ROLE_MANAGEMENT}>
          <Suspense fallback={<RouteLoadingFallback type="table" />}>
            <RoleManagementPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: '/role-management/add',
      element: (
        <ProtectedRoute requiredRoute={ROUTES.ROLE_MANAGEMENT_ADD}>
          <Suspense fallback={<RouteLoadingFallback type="form" />}>
            <AddRolePage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    // Catch-all route for undefined paths
    {
      path: '*',
      element: <Navigate to="/dashboard" replace />,
    },
  ];

  const element = useRoutes(allRoutes);

  // hide Header & Sidebar on login route
  const isLoginPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex bg-[#BBA473]">
      {!isLoginPage && (
        <Sidebar 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed}
          userRole={userRole}
        />
      )}

      {/* Main Content Wrapper with smooth transitions */}
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
              { label: 'Clients', href: '/agent', testId: 'clients-link' },
            ]}
          />
        )}

        {/* Main Content Area with fade-in animation */}
        <main 
          className={`
            flex-1 w-full
            overflow-x-hidden
            ${!isLoginPage ? 'bg-gray-50' : 'bg-white'}
            animate-fadeIn
          `}
        >
          {element}
        </main>
      </div>
    </div>
  );
}