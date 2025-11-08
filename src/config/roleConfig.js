/**
 * Role-Based Access Control (RBAC) Configuration
 * 
 * This file centralizes all role permissions for easy maintenance.
 * To add a new role or modify permissions, simply update this configuration.
 */

/**
 * Define all available routes in the application
 */
export const ROUTES = {
    // Public routes
    LOGIN: '/',
    
    // Protected routes
    DASHBOARD: '/dashboard',
    AGENT: '/agent',
    AGENT_ADD: '/agent/add',
    LEADS: '/leads',
    LEAD_ADD: '/lead/add',
    BRANCHES: '/branches',
    BRANCH_ADD: '/branch/add',
    ROLE_MANAGEMENT: '/role-management',
    ROLE_MANAGEMENT_ADD: '/role-management/add',
    SETTINGS: '/settings',
  };
  
  /**
   * Define all roles in the system
   * These MUST match exactly with the roleName field from your API response
   */
  export const ROLES = {
    SUPER_ADMIN: 'Admin',
    SALES_MANAGER: 'Sales Manager',
    AGENT: 'Agent',
    KIOSK_MEMBER: 'Kiosk Agent',
  };
  
  /**
   * Role Permissions Configuration
   * 
   * Each role has an array of allowed routes.
   * To add a new role:
   * 1. Add it to the ROLES object above
   * 2. Add its permissions here
   * 
   * To modify permissions:
   * - Simply add or remove routes from the allowedRoutes array
   */
  export const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: {
      allowedRoutes: [
        ROUTES.DASHBOARD,
        ROUTES.AGENT,
        ROUTES.AGENT_ADD,
        ROUTES.LEADS,
        ROUTES.LEAD_ADD,
        ROUTES.BRANCHES,
        ROUTES.BRANCH_ADD,
        ROUTES.ROLE_MANAGEMENT,
        ROUTES.ROLE_MANAGEMENT_ADD,
        ROUTES.SETTINGS,
      ],
      label: 'Admin',
      description: 'Full access to all features',
    },
    
    [ROLES.SALES_MANAGER]: {
      allowedRoutes: [
        ROUTES.DASHBOARD,
        ROUTES.AGENT,
        ROUTES.AGENT_ADD,
        ROUTES.LEADS,
        ROUTES.LEAD_ADD,
      ],
      label: 'Sales Manager',
      description: 'Access to dashboard, agents, and leads',
    },
    
    [ROLES.AGENT]: {
      allowedRoutes: [
        ROUTES.DASHBOARD,
        ROUTES.LEADS,
        ROUTES.LEAD_ADD,
      ],
      label: 'Agent',
      description: 'Access to dashboard and leads',
    },
    
    [ROLES.KIOSK_MEMBER]: {
      allowedRoutes: [
        ROUTES.DASHBOARD,
        ROUTES.LEADS,
        ROUTES.LEAD_ADD,
      ],
      label: 'Kiosk Member',
      description: 'Access to dashboard and leads',
    },
  };
  
  /**
   * Default role to use if user role is not found
   * This provides a fallback with minimal permissions
   */
  export const DEFAULT_ROLE = ROLES.AGENT;
  
  /**
   * Sidebar Menu Configuration
   * Maps routes to their sidebar display properties
   */
  export const SIDEBAR_MENU_CONFIG = [
    {
      label: 'Home',
      route: ROUTES.DASHBOARD,
      icon: 'Home',
    },
    {
      label: 'All Users',
      route: ROUTES.AGENT,
      icon: 'User',
      childRoutes: [ROUTES.AGENT_ADD], // Child routes that should be hidden with parent
    },
    {
      label: 'Leads',
      route: ROUTES.LEADS,
      icon: 'TrendingUp',
      childRoutes: [ROUTES.LEAD_ADD],
    },
    {
      label: 'Branches',
      route: ROUTES.BRANCHES,
      icon: 'GitBranch',
      childRoutes: [ROUTES.BRANCH_ADD],
    },
    {
      label: 'Role Management',
      route: ROUTES.ROLE_MANAGEMENT,
      icon: 'ShieldCheck',
      childRoutes: [ROUTES.ROLE_MANAGEMENT_ADD],
    },
  ];
  
  /**
   * Bottom menu items (always visible to authenticated users)
   */
  export const BOTTOM_MENU_CONFIG = [
    {
      label: 'Settings',
      route: ROUTES.SETTINGS,
      icon: 'Settings',
    },
  ];
  
  /**
   * Helper function to check if a role has access to a specific route
   * @param {string} userRole - The user's role
   * @param {string} route - The route to check
   * @returns {boolean} - True if user has access
   */
  export const hasRouteAccess = (userRole, route) => {
    if (!userRole) return false;
    
    // Get role permissions, fallback to default role if not found
    const rolePermissions = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS[DEFAULT_ROLE];
    
    return rolePermissions.allowedRoutes.includes(route);
  };
  
  /**
   * Helper function to get all allowed routes for a role
   * @param {string} userRole - The user's role
   * @returns {Array<string>} - Array of allowed routes
   */
  export const getAllowedRoutes = (userRole) => {
    if (!userRole) {
      return [];
    }
    
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    
    if (!rolePermissions) {
      // Fallback to default role if not found
      return ROLE_PERMISSIONS[DEFAULT_ROLE].allowedRoutes;
    }
    
    return rolePermissions.allowedRoutes;
  };
  
  /**
   * Helper function to filter menu items based on role
   * @param {Array} menuItems - Array of menu items with route property
   * @param {string} userRole - The user's role
   * @returns {Array} - Filtered menu items
   */
  export const filterMenuByRole = (menuItems, userRole) => {
    if (!userRole) return [];
    
    const allowedRoutes = getAllowedRoutes(userRole);
    
    return menuItems.filter(item => {
      // Check if main route is allowed
      return allowedRoutes.includes(item.route);
    });
  };
  
  /**
   * Helper function to get role information
   * @param {string} userRole - The user's role
   * @returns {Object} - Role information
   */
  export const getRoleInfo = (userRole) => {
    return ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS[DEFAULT_ROLE];
  };