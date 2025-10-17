import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronLeft, ChevronRight, Shield, X, CheckCircle } from 'lucide-react';

// Validation Schema
const roleValidationSchema = Yup.object({
  roleName: Yup.string()
    .required('Role name is required')
    .min(3, 'Role name must be at least 3 characters')
    .max(50, 'Role name must not exceed 50 characters'),
  department: Yup.string()
    .required('Department is required'),
});

// Features List
const featuresList = [
  { id: 'dashboard', name: 'Dashboard', description: 'View analytics and reports', icon: '📊' },
  { id: 'clients', name: 'Client Management', description: 'Manage client accounts', icon: '👥' },
  { id: 'roles', name: 'Role Management', description: 'Manage roles and permissions', icon: '🛡️' },
  { id: 'users', name: 'User Management', description: 'Manage system users', icon: '👤' },
  { id: 'transactions', name: 'Transactions', description: 'View and manage transactions', icon: '💰' },
  { id: 'reports', name: 'Reports', description: 'Generate and view reports', icon: '📈' },
  { id: 'settings', name: 'Settings', description: 'System configuration', icon: '⚙️' },
  { id: 'audit', name: 'Audit Logs', description: 'View system audit logs', icon: '📋' },
];

// Generate dummy roles
const generateDummyRoles = () => {
  const roleNames = ['Admin', 'Sales Manager', 'Sales Agent', 'Marketing Manager', 'Marketing Specialist', 'Finance Manager', 'Accountant', 'HR Manager', 'HR Specialist', 'IT Admin', 'IT Support', 'Operations Manager', 'Customer Service Lead', 'Customer Service Agent', 'Branch Manager'];
  const departments = ['Sales', 'Marketing', 'Finance', 'Human Resources', 'IT', 'Operations', 'Customer Service', 'Administration'];
  
  return roleNames.map((name, i) => ({
    id: 1000 + i,
    roleName: name,
    department: departments[Math.floor(Math.random() * departments.length)],
    permissions: {
      read: Math.random() > 0.1,
      write: Math.random() > 0.3,
      update: Math.random() > 0.4,
      delete: Math.random() > 0.6,
    },
    usersAssigned: Math.floor(Math.random() * 50) + 1,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

const RoleManagement = () => {
  const [roles, setRoles] = useState(generateDummyRoles());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const tabs = ['All', 'Sales', 'Marketing', 'Finance', 'IT', 'Operations', 'Administration'];
  const perPageOptions = [10, 20, 30, 50, 100];
  const departments = ['Sales', 'Marketing', 'Finance', 'Human Resources', 'IT', 'Operations', 'Customer Service', 'Administration'];

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) || role.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || role.department === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = filteredRoles.slice(startIndex, endIndex);
  const showingFrom = startIndex + 1;
  const showingTo = Math.min(endIndex, filteredRoles.length);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setShowPerPageDropdown(false);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    return pages;
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setDrawerOpen(true);
    setShowActionsDropdown(null);
  };

  const handleDelete = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId));
      setShowActionsDropdown(null);
    }
  };

  const handleViewPermissions = (role) => {
    setShowPermissionsModal(role);
    setShowActionsDropdown(null);
  };

  const toggleActionsDropdown = (roleId) => {
    setShowActionsDropdown(showActionsDropdown === roleId ? null : roleId);
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setEditingRole(null), 300);
  };

  const PermissionBadge = ({ granted }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${granted ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
      {granted ? 'Yes' : 'No'}
    </span>
  );

  // Get initial form values
  const getInitialValues = (existingRole) => {
    if (existingRole) {
      return {
        roleName: existingRole.roleName || '',
        department: existingRole.department || '',
        features: existingRole.features || {},
      };
    }
    const features = {};
    featuresList.forEach(feature => {
      features[feature.id] = { enabled: false, read: false, write: false, update: false, delete: false };
    });
    return { roleName: '', department: '', features };
  };

  // Formik for drawer form
  const formik = useFormik({
    initialValues: getInitialValues(editingRole),
    validationSchema: roleValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      console.log('Form submitted:', values);
      alert(editingRole ? 'Role updated successfully!' : 'Role created successfully!');
      setSubmitting(false);
      resetForm();
      handleCloseDrawer();
    },
  });

  const handleFeatureToggle = (featureId) => {
    const currentEnabled = formik.values.features[featureId].enabled;
    formik.setFieldValue(`features.${featureId}.enabled`, !currentEnabled);
    if (currentEnabled) {
      formik.setFieldValue(`features.${featureId}.read`, false);
      formik.setFieldValue(`features.${featureId}.write`, false);
      formik.setFieldValue(`features.${featureId}.update`, false);
      formik.setFieldValue(`features.${featureId}.delete`, false);
    }
  };

  const handlePermissionToggle = (featureId, permission) => {
    const currentValue = formik.values.features[featureId][permission];
    formik.setFieldValue(`features.${featureId}.${permission}`, !currentValue);
  };

  const handleSelectAll = (featureId) => {
    formik.setFieldValue(`features.${featureId}.read`, true);
    formik.setFieldValue(`features.${featureId}.write`, true);
    formik.setFieldValue(`features.${featureId}.update`, true);
    formik.setFieldValue(`features.${featureId}.delete`, true);
  };

  const handleClearAll = (featureId) => {
    formik.setFieldValue(`features.${featureId}.read`, false);
    formik.setFieldValue(`features.${featureId}.write`, false);
    formik.setFieldValue(`features.${featureId}.update`, false);
    formik.setFieldValue(`features.${featureId}.delete`, false);
  };

  return (
    <>
      <main className="relative p-1 overflow-x-hidden bg-[#1A1A1A] min-h-screen pt-8">
        <div className="px-2">
          {/* Header */}
          <div className={`flex flex-col sm:flex-row sm:items-center gap-4 mb-2 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
            <h1 className="text-3xl font-bold text-white sm:flex-shrink-0">Role Management</h1>
            
            <div className="flex items-center gap-4 sm:ml-auto">
              {/* Search Bar */}
              <div className="relative w-65 group">
                <input
                  type="text"
                  placeholder="Search by role..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-2 rounded-lg bg-[#2A2A2A] text-[#E8D5A3] border border-[#BBA473]/30 focus:outline-none focus:border-[#BBA473] focus:ring-2 focus:ring-[#BBA473]/50 placeholder-[#E8D5A3]/50 text-sm transition-all duration-300 hover:border-[#d4bc89]"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#E8D5A3] w-4 h-4 transition-all duration-300 group-hover:text-[#BBA473]" />
              </div>

              {/* Add New Button */}
              <button 
                onClick={handleAddRole}
                className="bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] hover:from-[#d4bc89] hover:to-[#a69363] text-black rounded px-4 py-2 flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#BBA473]/40 transform hover:scale-105 active:scale-95 font-semibold"
              >
                <Plus className="h-4 w-4" />
                Add Role
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex space-x-2 mb-2 overflow-x-auto transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-6 py-1.5 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#BBA473] text-white shadow-md scale-105'
                    : 'bg-[#2A2A2A] text-[#E8D5A3] hover:bg-[#3A3A3A] hover:scale-105'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className={`max-h-[78vh] overflow-y-auto overflow-x-auto w-full rounded-lg relative border border-[#BBA473]/30 mt-2 transition-all duration-700 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <table className="w-full text-[#E8D5A3] bg-[#2A2A2A]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#BBA473] text-[#1A1A1A] font-semibold">
                  <th className="py-2 px-3 text-sm text-left">ID</th>
                  <th className="py-2 px-3 text-sm text-left">Role Name</th>
                  <th className="hidden md:table-cell py-2 px-3 text-sm text-left">Department</th>
                  <th className="hidden lg:table-cell py-2 px-3 text-sm text-center">Read</th>
                  <th className="hidden lg:table-cell py-2 px-3 text-sm text-center">Write</th>
                  <th className="hidden xl:table-cell py-2 px-3 text-sm text-center">Update</th>
                  <th className="hidden xl:table-cell py-2 px-3 text-sm text-center">Delete</th>
                  <th className="hidden 2xl:table-cell py-2 px-3 text-sm text-center">Users</th>
                  <th className="py-2 px-3 text-sm text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRoles.map((role, index) => (
                  <tr
                    key={role.id}
                    className="border-b border-[#BBA473]/20 hover:bg-[#3A3A3A] transition-all duration-300 hover:shadow-md"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-3 px-3 text-sm">{role.id}</td>
                    <td className="py-3 px-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#BBA473] flex items-center justify-center transition-transform duration-300 hover:scale-110">
                          <Shield className="w-4 h-4 text-black" />
                        </div>
                        <span className="font-medium">{role.roleName}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-3 px-3 text-sm">
                      <span className="px-2 py-1 bg-[#BBA473]/20 text-[#BBA473] rounded text-xs font-medium">
                        {role.department}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell py-3 px-3 text-center"><PermissionBadge granted={role.permissions.read} /></td>
                    <td className="hidden lg:table-cell py-3 px-3 text-center"><PermissionBadge granted={role.permissions.write} /></td>
                    <td className="hidden xl:table-cell py-3 px-3 text-center"><PermissionBadge granted={role.permissions.update} /></td>
                    <td className="hidden xl:table-cell py-3 px-3 text-center"><PermissionBadge granted={role.permissions.delete} /></td>
                    <td className="hidden 2xl:table-cell py-3 px-3 text-center text-gray-400">{role.usersAssigned}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="relative inline-block">
                        <button
                          onClick={() => toggleActionsDropdown(role.id)}
                          className="p-2 hover:bg-[#4A4A4A] rounded-lg transition-all duration-300 hover:scale-110"
                        >
                          <svg className="w-5 h-5 text-[#E8D5A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>

                        {showActionsDropdown === role.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-[#2A2A2A] border border-[#BBA473]/30 rounded-lg shadow-lg z-50 overflow-hidden animate-fadeIn">
                            <button onClick={() => handleViewPermissions(role)} className="w-full px-4 py-2 text-left text-sm text-[#E8D5A3] hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors">
                              <Shield className="w-4 h-4" />View Permissions
                            </button>
                            <button onClick={() => handleEdit(role)} className="w-full px-4 py-2 text-left text-sm text-[#E8D5A3] hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors">
                              <Edit className="w-4 h-4" />Edit Role
                            </button>
                            <button onClick={() => handleDelete(role.id)} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors">
                              <Trash2 className="w-4 h-4" />Delete Role
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg px-4 py-2 sm:px-6 mt-0 transition-all duration-700 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="flex flex-1 justify-between w-full sm:hidden">
              <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="relative inline-flex items-center rounded-md border border-[#BBA473]/30 bg-[#3A3A3A] px-4 py-2 text-sm font-medium text-[#E8D5A3] hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                Previous
              </button>
              <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="relative ml-3 inline-flex items-center rounded-md border border-[#BBA473]/30 bg-[#3A3A3A] px-4 py-2 text-sm font-medium text-[#E8D5A3] hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                Next
              </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-[#E8D5A3]/70">
                    Showing <span className="font-medium text-[#BBA473]">{showingFrom}</span> to <span className="font-medium text-[#BBA473]">{showingTo}</span> of <span className="font-medium text-[#BBA473]">{filteredRoles.length}</span> results
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#E8D5A3]/70">Show:</span>
                  <div className="relative">
                    <button onClick={() => setShowPerPageDropdown(!showPerPageDropdown)} className="relative inline-flex items-center gap-2 rounded-md border border-[#BBA473]/30 bg-[#3A3A3A] px-3 py-2 text-sm font-medium text-[#E8D5A3] hover:bg-[#4A4A4A] transition-colors duration-200">
                      {itemsPerPage}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {showPerPageDropdown && (
                      <div className="absolute bottom-full mb-1 right-0 bg-[#2A2A2A] border border-[#BBA473]/30 rounded-md shadow-lg z-20">
                        {perPageOptions.map((option) => (
                          <button key={option} onClick={() => handlePerPageChange(option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#3A3A3A] transition-colors ${itemsPerPage === option ? 'text-[#BBA473]' : 'text-[#E8D5A3]'}`}>
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-[#E8D5A3]/70">per page</span>
                </div>
              </div>

              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md">
                  <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-[#E8D5A3]/70 border border-[#BBA473]/30 bg-[#3A3A3A] hover:bg-[#4A4A4A] focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {getPageNumbers().map((page) => (
                    <button key={page} onClick={() => handlePageChange(page)} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors duration-200 border border-[#BBA473]/30 focus:z-20 ${currentPage === page ? 'z-10 bg-[#BBA473] text-[#1A1A1A]' : 'text-[#E8D5A3] bg-[#3A3A3A] hover:bg-[#4A4A4A]'}`}>
                      {page}
                    </button>
                  ))}

                  <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-[#E8D5A3]/70 border border-[#BBA473]/30 bg-[#3A3A3A] hover:bg-[#4A4A4A] focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Modal */}
        {showPermissionsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-[#2A2A2A] border-2 border-[#BBA473] rounded-lg p-6 max-w-md w-full transform transition-all duration-300 scale-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#BBA473]" />
                  Role Permissions
                </h2>
                <button onClick={() => setShowPermissionsModal(null)} className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Role Name</p>
                  <p className="text-lg font-semibold text-white">{showPermissionsModal.roleName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Department</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-[#BBA473]/20 text-[#BBA473] rounded text-sm font-medium">
                    {showPermissionsModal.department}
                  </span>
                </div>

                <div className="border-t border-[#BBA473]/30 pt-4">
                  <p className="text-sm text-gray-400 mb-3">Permissions</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded">
                      <span className="text-[#E8D5A3]">Read</span>
                      <PermissionBadge granted={showPermissionsModal.permissions.read} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded">
                      <span className="text-[#E8D5A3]">Write</span>
                      <PermissionBadge granted={showPermissionsModal.permissions.write} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded">
                      <span className="text-[#E8D5A3]">Update</span>
                      <PermissionBadge granted={showPermissionsModal.permissions.update} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded">
                      <span className="text-[#E8D5A3]">Delete</span>
                      <PermissionBadge granted={showPermissionsModal.permissions.delete} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#BBA473]/30 pt-4">
                  <p className="text-sm text-gray-400">Users Assigned</p>
                  <p className="text-2xl font-bold text-[#BBA473]">{showPermissionsModal.usersAssigned}</p>
                </div>
              </div>

              <button onClick={() => setShowPermissionsModal(null)} className="w-full mt-6 bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] text-black font-semibold py-3 rounded-lg hover:from-[#d4bc89] hover:to-[#a69363] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#BBA473]/40 transform hover:scale-105 active:scale-95">
                Close
              </button>
            </div>
          </div>
        )}

        {showActionsDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowActionsDropdown(null)}></div>}
      </main>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn" onClick={handleCloseDrawer}></div>
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-[#1A1A1A] shadow-2xl z-50 overflow-y-auto transition-transform duration-500 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#1A1A1A] pb-4 border-b border-[#BBA473]/30 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#BBA473] flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </h2>
            </div>
            <button onClick={handleCloseDrawer} className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90 p-2 hover:bg-[#2A2A2A] rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-[#2A2A2A] border border-[#BBA473]/30 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">📝</span>
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role Name */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="roleName"
                    placeholder="e.g., Sales Manager"
                    value={formik.values.roleName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.roleName && formik.errors.roleName
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  />
                  {formik.touched.roleName && formik.errors.roleName && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.roleName}</div>
                  )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.department && formik.errors.department
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {formik.touched.department && formik.errors.department && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.department}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Features & Permissions */}
            <div className="bg-[#2A2A2A] border border-[#BBA473]/30 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#BBA473]/30 pb-3">
                <Shield className="w-5 h-5 text-[#BBA473]" />
                <h3 className="text-lg font-semibold text-white">Features & Permissions</h3>
              </div>

              <p className="text-sm text-gray-400">
                Enable features and set permissions (Read, Write, Update, Delete) for this role.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 gap-4 mt-4">
                {featuresList.map((feature, index) => (
                  <div
                    key={feature.id}
                    className={`border rounded-lg transition-all duration-300 ${
                      formik.values.features[feature.id]?.enabled
                        ? 'border-[#BBA473] bg-[#1A1A1A] shadow-lg shadow-[#BBA473]/20'
                        : 'border-[#BBA473]/30 bg-[#252525] hover:border-[#BBA473]/50'
                    }`}
                  >
                    <div className="p-4">
                      {/* Feature Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={formik.values.features[feature.id]?.enabled || false}
                          onChange={() => handleFeatureToggle(feature.id)}
                          className="mt-1 h-5 w-5 accent-[#BBA473] border-gray-600 rounded focus:ring-[#BBA473] cursor-pointer transition-transform duration-300 hover:scale-110"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{feature.icon}</span>
                            <h4 className="text-white font-semibold text-sm">{feature.name}</h4>
                            {formik.values.features[feature.id]?.enabled && (
                              <CheckCircle className="w-4 h-4 text-green-400 animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{feature.description}</p>
                        </div>
                      </div>

                      {/* Permissions Section */}
                      {formik.values.features[feature.id]?.enabled && (
                        <div className="space-y-3 pt-3 border-t border-[#BBA473]/30 animate-fadeIn">
                          {/* Quick Actions */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSelectAll(feature.id)}
                              className="flex-1 text-xs px-3 py-2 bg-[#BBA473] text-black rounded hover:bg-[#d4bc89] transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={() => handleClearAll(feature.id)}
                              className="flex-1 text-xs px-3 py-2 bg-[#3A3A3A] text-white rounded hover:bg-[#4A4A4A] transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                            >
                              Clear All
                            </button>
                          </div>

                          {/* Permissions Grid */}
                          <div className="grid grid-cols-2 gap-2">
                            {['read', 'write', 'update', 'delete'].map((permission) => (
                              <label key={permission} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[#2A2A2A] transition-all duration-300 group">
                                <input
                                  type="checkbox"
                                  checked={formik.values.features[feature.id]?.[permission] || false}
                                  onChange={() => handlePermissionToggle(feature.id, permission)}
                                  className="h-4 w-4 accent-[#BBA473] border-gray-600 rounded cursor-pointer transition-transform duration-300 group-hover:scale-110"
                                />
                                <span className="text-xs text-gray-300 font-medium capitalize">{permission}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="bg-[#1A1A1A] border border-[#BBA473]/30 rounded-lg p-4 mt-6">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  Permission Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Enabled Features:</span>
                    <span className="text-[#BBA473] font-bold text-xl">
                      {Object.values(formik.values.features).filter(f => f.enabled).length} / {featuresList.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formik.values.features)
                      .filter(([_, permissions]) => permissions.enabled)
                      .map(([featureId]) => {
                        const feature = featuresList.find(f => f.id === featureId);
                        return (
                          <span
                            key={featureId}
                            className="px-3 py-1 bg-[#BBA473]/20 text-[#BBA473] rounded-full text-xs font-medium flex items-center gap-1 animate-fadeIn"
                          >
                            <span>{feature?.icon}</span>
                            <span>{feature?.name}</span>
                          </span>
                        );
                      })}
                    {Object.values(formik.values.features).filter(f => f.enabled).length === 0 && (
                      <span className="text-gray-500 text-sm italic">No features enabled yet</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 sticky bottom-0 bg-[#1A1A1A] pt-4 border-t border-[#BBA473]/30">
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="flex-1 px-4 py-3 rounded-lg font-semibold bg-[#3A3A3A] text-white hover:bg-[#4A4A4A] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="flex-1 px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] text-black hover:from-[#d4bc89] hover:to-[#a69363] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#BBA473]/40 transform hover:scale-105 active:scale-95"
              >
                {formik.isSubmitting 
                  ? (editingRole ? 'Updating Role...' : 'Creating Role...') 
                  : (editingRole ? 'Update Role' : 'Create Role')
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default RoleManagement;