import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

// Dummy JSON Data
const generateDummyRoles = () => {
  const roleNames = [
    'Admin',
    'Sales Manager',
    'Sales Agent',
    'Marketing Manager',
    'Marketing Specialist',
    'Finance Manager',
    'Accountant',
    'HR Manager',
    'HR Specialist',
    'IT Admin',
    'IT Support',
    'Operations Manager',
    'Customer Service Lead',
    'Customer Service Agent',
    'Branch Manager'
  ];

  const departments = ['Sales', 'Marketing', 'Finance', 'Human Resources', 'IT', 'Operations', 'Customer Service', 'Administration'];

  const roles = [];
  for (let i = 0; i < roleNames.length; i++) {
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    roles.push({
      id: 1000 + i,
      roleName: roleNames[i],
      department: department,
      permissions: {
        read: Math.random() > 0.1, // 90% chance of read
        write: Math.random() > 0.3, // 70% chance of write
        update: Math.random() > 0.4, // 60% chance of update
        delete: Math.random() > 0.6, // 40% chance of delete
      },
      usersAssigned: Math.floor(Math.random() * 50) + 1,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return roles;
};

const RoleManagement = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(generateDummyRoles());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(null);

  const tabs = ['All', 'Sales', 'Marketing', 'Finance', 'IT', 'Operations', 'Administration'];
  const perPageOptions = [10, 20, 30, 50, 100];

  // Filter roles based on search query and active tab
  const filteredRoles = roles.filter(role => {
    const matchesSearch = 
      role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'All' || role.department === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = filteredRoles.slice(startIndex, endIndex);
  const showingFrom = startIndex + 1;
  const showingTo = Math.min(endIndex, filteredRoles.length);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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

  // Handle Edit
  const handleEdit = (role) => {
    console.log('Editing role:', role);
    navigate('/role-management/add', { state: { role } });
  };

  // Handle Delete
  const handleDelete = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      setRoles(roles.filter(role => role.id !== roleId));
      setShowActionsDropdown(null);
      console.log('Deleted role ID:', roleId);
    }
  };

  // Handle View Permissions
  const handleViewPermissions = (role) => {
    setShowPermissionsModal(role);
    setShowActionsDropdown(null);
  };

  // Toggle actions dropdown
  const toggleActionsDropdown = (roleId) => {
    setShowActionsDropdown(showActionsDropdown === roleId ? null : roleId);
  };

  // Permission Badge Component
  const PermissionBadge = ({ granted }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      granted 
        ? 'bg-green-500/20 text-green-300' 
        : 'bg-red-500/20 text-red-300'
    }`}>
      {granted ? 'Yes' : 'No'}
    </span>
  );

  return (
    <main className="relative p-1 overflow-x-hidden bg-[#1A1A1A] min-h-screen pt-8">
      <div className="px-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-white sm:flex-shrink-0">
            Role Management
          </h1>
          
          <div className="flex items-center gap-4 sm:ml-auto">
            {/* Search Bar */}
            <div className="relative w-65">
              <input
                type="text"
                placeholder="Search by role name or department..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-lg bg-[#2A2A2A] text-[#E8D5A3] border border-[#BBA473]/30 focus:outline-none focus:border-[#BBA473] placeholder-[#E8D5A3]/50 text-sm"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#E8D5A3] w-4 h-4" />
            </div>

            {/* Add New Button */}
            <button 
              onClick={() => navigate('/role-management/add')}
              className="bg-[#BBA473] hover:bg-[#A68F5C] text-black rounded px-4 py-2 flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Role
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-6 py-1.5 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#BBA473] text-white shadow-md'
                  : 'bg-[#2A2A2A] text-[#E8D5A3] hover:bg-[#3A3A3A]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="max-h-[78vh] overflow-y-auto overflow-x-auto w-full rounded-lg relative border border-[#BBA473]/30 mt-2">
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
              {currentRoles.map((role) => (
                <tr
                  key={role.id}
                  className="border-b border-[#BBA473]/20 hover:bg-[#3A3A3A] transition-colors duration-300"
                >
                  <td className="py-3 px-3 text-sm">{role.id}</td>
                  <td className="py-3 px-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#BBA473] flex items-center justify-center">
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
                  <td className="hidden lg:table-cell py-3 px-3 text-center">
                    <PermissionBadge granted={role.permissions.read} />
                  </td>
                  <td className="hidden lg:table-cell py-3 px-3 text-center">
                    <PermissionBadge granted={role.permissions.write} />
                  </td>
                  <td className="hidden xl:table-cell py-3 px-3 text-center">
                    <PermissionBadge granted={role.permissions.update} />
                  </td>
                  <td className="hidden xl:table-cell py-3 px-3 text-center">
                    <PermissionBadge granted={role.permissions.delete} />
                  </td>
                  <td className="hidden 2xl:table-cell py-3 px-3 text-center text-gray-400">
                    {role.usersAssigned}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() => toggleActionsDropdown(role.id)}
                        className="p-2 hover:bg-[#4A4A4A] rounded-lg transition-colors"
                      >
                        <svg 
                          className="w-5 h-5 text-[#E8D5A3]" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" 
                          />
                        </svg>
                      </button>

                      {/* Actions Dropdown */}
                      {showActionsDropdown === role.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-[#2A2A2A] border border-[#BBA473]/30 rounded-lg shadow-lg z-50">
                          <button
                            onClick={() => handleViewPermissions(role)}
                            className="w-full px-4 py-2 text-left text-sm text-[#E8D5A3] hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors rounded-t-lg"
                          >
                            <Shield className="w-4 h-4" />
                            View Permissions
                          </button>
                          <button
                            onClick={() => handleEdit(role)}
                            className="w-full px-4 py-2 text-left text-sm text-[#E8D5A3] hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Role
                          </button>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Role
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg px-4 py-2 sm:px-6 mt-0">
          {/* Mobile Pagination */}
          <div className="flex flex-1 justify-between w-full sm:hidden">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="relative inline-flex items-center rounded-md border border-[#BBA473]/30 bg-[#3A3A3A] px-4 py-2 text-sm font-medium text-[#E8D5A3] hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="relative ml-3 inline-flex items-center rounded-md border border-[#BBA473]/30 bg-[#3A3A3A] px-4 py-2 text-sm font-medium text-[#E8D5A3] hover:bg-[#4A4A4A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-[#E8D5A3]/70">
                  Showing <span className="font-medium text-[#BBA473]">{showingFrom}</span> to{' '}
                  <span className="font-medium text-[#BBA473]">{showingTo}</span> of{' '}
                  <span className="font-medium text-[#BBA473]">{filteredRoles.length}</span> results
                </p>
              </div>

              {/* Per Page Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#E8D5A3]/70">Show:</span>
                <div className="relative">
                  <button
                    onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
                    className="relative inline-flex items-center gap-2 rounded-md border border-[#BBA473]/30 bg-[#3A3A3A] px-3 py-2 text-sm font-medium text-[#E8D5A3] hover:bg-[#4A4A4A] transition-colors duration-200"
                  >
                    {itemsPerPage}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {showPerPageDropdown && (
                    <div className="absolute bottom-full mb-1 right-0 bg-[#2A2A2A] border border-[#BBA473]/30 rounded-md shadow-lg z-20">
                      {perPageOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => handlePerPageChange(option)}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#3A3A3A] transition-colors ${
                            itemsPerPage === option ? 'text-[#BBA473]' : 'text-[#E8D5A3]'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-sm text-[#E8D5A3]/70">per page</span>
              </div>
            </div>

            {/* Page Numbers */}
            <div>
              <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-[#E8D5A3]/70 border border-[#BBA473]/30 bg-[#3A3A3A] hover:bg-[#4A4A4A] focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors duration-200 border border-[#BBA473]/30 focus:z-20 ${
                      currentPage === page
                        ? 'z-10 bg-[#BBA473] text-[#1A1A1A]'
                        : 'text-[#E8D5A3] bg-[#3A3A3A] hover:bg-[#4A4A4A]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-[#E8D5A3]/70 border border-[#BBA473]/30 bg-[#3A3A3A] hover:bg-[#4A4A4A] focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Modal */}
      {showPermissionsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2A2A2A] border-2 border-[#BBA473] rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#BBA473]" />
                Role Permissions
              </h2>
              <button
                onClick={() => setShowPermissionsModal(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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

            <button
              onClick={() => setShowPermissionsModal(null)}
              className="w-full mt-6 bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] text-black font-semibold py-3 rounded-lg hover:from-[#d4bc89] hover:to-[#a69363] transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showActionsDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowActionsDropdown(null)}
        ></div>
      )}
    </main>
  );
};

export default RoleManagement;