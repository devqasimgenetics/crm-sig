import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Edit, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllUsers, updateUser, deleteUser, getDeviceInfo } from '../../services/teamService';

// Validation Schema
const clientValidationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  email: Yup.string() 
    .required('Email is required')
    .email('Invalid email address'),
  phone: Yup.string()
    .required('Phone number is required'), 
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'Must be at least 18 years old', function(value) {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      return value <= cutoff;
    }),
  department: Yup.string().required('Department is required'),
  role: Yup.string().required('Role is required'),
  inBranch: Yup.string().required('Branch is required'),
  image: Yup.mixed()
    .nullable()
    .test('fileSize', 'File size must be less than 5MB', function(value) {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed (JPG, PNG, GIF)', function(value) {
      if (!value) return true;
      return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type);
    }),
  password: Yup.string()
    .when('$isEditing', {
      is: false,
      then: (schema) => schema
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain uppercase, lowercase, number and special character'
        ),
      otherwise: (schema) => schema.notRequired()
    }),
});

const SalesManagers = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  const perPageOptions = [10, 20, 30, 50, 100];

  // Fetch users from API and filter for Sales Manager role only
  const fetchUsers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const result = await getAllUsers(page, limit);
      
      if (result.success && result.data) {
        // Filter only Sales Manager users
        const salesManagers = result.data.filter(user => 
          user.roleName === 'Sales manager' || user.roleName === 'Sales Manager'
        );
        
        const transformedUsers = salesManagers.map((user) => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phoneNumber,
          dateOfBirth: user.dateOfBirthday,
          department: user.department || 'Sales',
          role: user.roleName,
          branch: user.inBranch,
          image: user.imageUrl,
          createdAt: new Date().toISOString(),
        }));
        
        setClients(transformedUsers);
        setTotalUsers(transformedUsers.length);
      } else {
        console.error('Failed to fetch users:', result.message);
        if (result.requiresAuth) {
          toast.error('Session expired. Please login again.');
        } else {
          toast.error(result.message || 'Failed to fetch users');
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsLoaded(true);
    fetchUsers(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.phone.includes(searchQuery);
    return matchesSearch;
  });

  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);
  const showingFrom = startIndex + 1;
  const showingTo = Math.min(startIndex + currentClients.length, totalUsers);

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

  const handleEdit = (client) => {
    toast.success('Edit functionality coming soon!');
    setShowActionsDropdown(null);
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this Sales Manager?')) {
      try {
        const result = await deleteUser(clientId);
        
        if (result.success) {
          toast.success(result.message || 'Sales Manager deleted successfully!', {
            duration: 3000,
            style: {
              background: '#2A2A2A',
              color: '#fff',
              border: '1px solid #BBA473',
            },
            iconTheme: {
              primary: '#BBA473',
              secondary: '#1A1A1A',
            },
          });
          fetchUsers(currentPage, itemsPerPage);
        } else {
          if (result.requiresAuth) {
            toast.error('Session expired. Please login again.');
          } else {
            toast.error(result.message || 'Failed to delete Sales Manager');
          }
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete Sales Manager. Please try again.');
      }
      setShowActionsDropdown(null);
    }
  };

  const formatPhoneDisplay = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\+\d{1,4})(\d+)/, '$1 $2').replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#2A2A2A',
            color: '#fff',
            border: '1px solid #BBA473',
          },
          success: {
            iconTheme: {
              primary: '#BBA473',
              secondary: '#1A1A1A',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1A1A1A',
            },
          },
        }}
      />

      <div className={`min-h-screen bg-[#1A1A1A] text-white p-6 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] bg-clip-text text-transparent">
                Sales Managers
              </h1>
              <p className="text-gray-400 mt-2">View and manage Sales Managers</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 animate-fadeIn">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-[#BBA473]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBA473]/50 focus:border-[#BBA473] bg-[#1A1A1A] text-white transition-all duration-300 hover:border-[#BBA473]"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden border border-[#BBA473]/20 animate-fadeIn">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1A1A1A] border-b border-[#BBA473]/30">
                <tr>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Full Name</th>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Phone</th>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Department</th>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Branch</th>
                  <th className="text-center px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BBA473]/10">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                      Loading Sales Managers...
                    </td>
                  </tr>
                ) : currentClients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                      No Sales Managers found
                    </td>
                  </tr>
                ) : (
                  currentClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-[#3A3A3A] transition-all duration-300 group"
                    >
                      <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                        #{client.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {client.image ? (
                            <img
                              src={client.image}
                              alt={client.fullName}
                              className="w-10 h-10 rounded-full object-cover border-2 border-[#BBA473]/30"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#BBA473] to-[#8E7D5A] flex items-center justify-center text-black font-semibold">
                              {client.firstName?.[0]}{client.lastName?.[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white group-hover:text-[#BBA473] transition-colors duration-300">
                              {client.fullName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{client.email}</td>
                      <td className="px-6 py-4 text-gray-300 font-mono text-sm">{formatPhoneDisplay(client.phone)}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#BBA473]/20 text-[#E8D5A3] border border-[#BBA473]/30">
                          {client.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{client.branch}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="p-2 rounded-lg bg-[#BBA473]/20 text-[#BBA473] hover:bg-[#BBA473] hover:text-black transition-all duration-300 hover:scale-110"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-[#1A1A1A] border-t border-[#BBA473]/30 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-gray-400 text-sm">
                  Showing <span className="text-white font-semibold">{showingFrom}</span> to{' '}
                  <span className="text-white font-semibold">{showingTo}</span> of{' '}
                  <span className="text-white font-semibold">{totalUsers}</span> entries
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] transition-all duration-300 border border-[#BBA473]/30"
                  >
                    <span className="text-sm">{itemsPerPage} per page</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showPerPageDropdown && (
                    <div className="absolute bottom-full mb-2 right-0 bg-[#2A2A2A] border border-[#BBA473]/30 rounded-lg shadow-xl z-10 min-w-[150px]">
                      {perPageOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => handlePerPageChange(option)}
                          className={`w-full px-4 py-2 text-left hover:bg-[#3A3A3A] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            option === itemsPerPage ? 'bg-[#BBA473]/20 text-[#BBA473]' : 'text-white'
                          }`}
                        >
                          {option} per page
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-[#BBA473]/30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-[#BBA473]/30 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] text-black'
                        : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A] hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-[#BBA473]/30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SalesManagers;