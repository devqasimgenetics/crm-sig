import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Dummy JSON Data
const generateDummyClients = () => {
  const firstNames = ['John', 'Sarah', 'Mohammed', 'Fatima', 'Ahmed', 'Layla', 'Omar', 'Aisha', 'Ali', 'Noura', 'Hassan', 'Maryam', 'Khalid', 'Zainab', 'Abdullah'];
  const lastNames = ['Smith', 'Johnson', 'Al-Mansouri', 'Khan', 'Al-Hashimi', 'Brown', 'Davis', 'Wilson', 'Al-Sayed', 'Martinez', 'Garcia', 'Al-Farsi', 'Anderson', 'Taylor'];
  const departments = ['Sales', 'Marketing', 'Finance', 'Human Resources', 'IT', 'Operations', 'Customer Service', 'Administration'];
  const roles = ['Manager', 'Team Lead', 'Senior Associate', 'Associate', 'Junior Associate', 'Consultant', 'Director'];
  const branches = ['Dubai Main Branch', 'Abu Dhabi Branch', 'Sharjah Branch', 'Ajman Branch', 'Ras Al Khaimah Branch'];

  const clients = [];
  for (let i = 0; i < 73; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];
    
    // Generate age between 25-60
    const age = Math.floor(Math.random() * 36) + 25;
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    
    clients.push({
      id: 100000169 - i,
      firstName: firstName,
      lastName: lastName,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@saveingold.ae`,
      phone: `+971 ${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
      dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
      department: department,
      role: role,
      branch: branch,
      image: null, // Can add image URLs here if needed
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return clients;
};

const ClientManagement = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState(generateDummyClients());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);

  const tabs = ['All', 'Sales', 'Marketing', 'Finance', 'IT', 'Operations'];
  const perPageOptions = [10, 20, 30, 50, 100];

  // Filter clients based on search query and active tab
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'All' || client.department === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);
  const showingFrom = startIndex + 1;
  const showingTo = Math.min(endIndex, filteredClients.length);

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
  const handleEdit = (client) => {
    console.log('Editing client:', client);
    // Add your edit logic here - navigate to edit page or open modal
    alert(`Editing: ${client.fullName}`);
  };

  // Handle Delete
  const handleDelete = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== clientId));
      setShowActionsDropdown(null);
      console.log('Deleted client ID:', clientId);
      // Add your delete API call here
    }
  };

  // Handle View Details
  const handleViewDetails = (client) => {
    console.log('Viewing details for:', client);
    // Add your view details logic here
    alert(`Viewing details for: ${client.fullName}`);
  };

  // Toggle actions dropdown
  const toggleActionsDropdown = (clientId) => {
    setShowActionsDropdown(showActionsDropdown === clientId ? null : clientId);
  };

  return (
    <main className="relative p-1 overflow-x-hidden bg-[#1A1A1A] min-h-screen pt-8">
      <div className="px-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-white sm:flex-shrink-0">
            Client Management
          </h1>
          
          <div className="flex items-center gap-4 sm:ml-auto">
            {/* Search Bar */}
            <div className="relative w-65">
              <input
                type="text"
                placeholder="Search by name, email, phone..."
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
              onClick={() => navigate('/clients/add')}
              className="bg-[#BBA473] hover:bg-[#A68F5C] text-black rounded px-4 py-2 flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New
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
                <th className="py-2 px-3 text-sm text-left">Name</th>
                <th className="hidden md:table-cell py-2 px-3 text-sm text-left">Email</th>
                <th className="hidden sm:table-cell py-2 px-3 text-sm text-left">Phone</th>
                <th className="hidden lg:table-cell py-2 px-3 text-sm text-left">Department</th>
                <th className="hidden xl:table-cell py-2 px-3 text-sm text-left">Role</th>
                <th className="hidden 2xl:table-cell py-2 px-3 text-sm text-left">Branch</th>
                <th className="py-2 px-3 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-[#BBA473]/20 hover:bg-[#3A3A3A] transition-colors duration-300"
                >
                  <td className="py-3 px-3 text-sm">{client.id}</td>
                  <td className="py-3 px-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#BBA473] flex items-center justify-center text-black font-semibold text-xs">
                        {client.firstName[0]}{client.lastName[0]}
                      </div>
                      <span className="font-medium">{client.fullName}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-3 px-3 text-sm">{client.email}</td>
                  <td className="hidden sm:table-cell py-3 px-3 text-sm">{client.phone}</td>
                  <td className="hidden lg:table-cell py-3 px-3 text-sm">
                    <span className="px-2 py-1 bg-[#BBA473]/20 text-[#BBA473] rounded text-xs font-medium">
                      {client.department}
                    </span>
                  </td>
                  <td className="hidden xl:table-cell py-3 px-3 text-sm">{client.role}</td>
                  <td className="hidden 2xl:table-cell py-3 px-3 text-sm text-gray-400">{client.branch}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() => toggleActionsDropdown(client.id)}
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
                      {showActionsDropdown === client.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#2A2A2A] border border-[#BBA473]/30 rounded-lg shadow-lg z-50">
                          <button
                            onClick={() => {
                              navigate('/clients/add');
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-[#E8D5A3] hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors rounded-t-lg"
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                              />
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                              />
                            </svg>
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              navigate('/clients/add');
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-[#E8D5A3] hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
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
                  <span className="font-medium text-[#BBA473]">{filteredClients.length}</span> results
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

export default ClientManagement;