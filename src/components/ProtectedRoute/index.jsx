import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '@/utils/authUtils';
import { hasRouteAccess, ROUTES } from '@/config/roleConfig';

/**
 * ProtectedRoute Component
 * Wraps routes to provide role-based access control
 * 
 * Usage:
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <DashboardPage />
 *   </ProtectedRoute>
 * } />
 */
const ProtectedRoute = ({ children, requiredRoute = null }) => {
  const location = useLocation();
  const userRole = getUserRole();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    console.log('🔒 User not authenticated, redirecting to login');
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // If no specific route requirement, just check authentication
  if (!requiredRoute) {
    return children;
  }

  // Check if user has access to the required route
  const hasAccess = hasRouteAccess(userRole, requiredRoute);

  if (!hasAccess) {
    console.log(`🚫 Access denied: User role "${userRole}" cannot access ${requiredRoute}`);
    // Redirect to dashboard if no access
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // User has access, render the component
  return children;
};

export default ProtectedRoute;