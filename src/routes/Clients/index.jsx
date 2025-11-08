import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronLeft, ChevronRight, X, UserPlus, Eye, EyeOff, RefreshCw, Upload, Calendar } from 'lucide-react';
import { getAllUsers, createUser, updateUser, deleteUser, getDeviceInfo } from '../../services/teamService';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { getAllBranches } from '../../services/branchService';
import { getAllRoles } from '../../services/roleService';

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
    .required('Phone number is required')
    .test('valid-phone', 'Invalid phone number', function(value) {
      if (!value) return false;
      try {
        return isValidPhoneNumber(value);
      } catch {
        return false;
      }
    }),
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

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userRole, setUserRole] = useState('');

  // New states for roles and branches
  const [roles, setRoles] = useState([]);
  const [totalRoles, setTotalRoles] = useState(0);
  const [branches, setBranches] = useState([]);
  const [totalBranches, setTotalBranches] = useState(0);

  // New state for user permissions
  const [userPermissions, setUserPermissions] = useState({
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canView: true
  });

  const perPageOptions = [10, 20, 30, 50, 100];

  const departments = ['Sales'];

  // Dynamic tabs based on user role and fetched roles
  const getAllTabs = () => {
    const baseTabs = ['All'];
    
    // Add all role names from fetched roles
    roles.forEach(role => {
      // Only add the tab if the current user's role is NOT equal to this role
      if (role.roleName !== userRole) {
        baseTabs.push(role.roleName);
      }
    });
    
    return baseTabs;
  };

  const tabs = getAllTabs();

  // Fetch roles from API
  const fetchRoles = async (page = 1, limit = 100) => {
    try {
      const result = await getAllRoles(page, limit);
      
      if (result.success && result.data) {
        const transformedRoles = result.data.map((role) => ({
          id: role._id,
          roleId: role.roleId,
          roleName: role.roleName,
          department: role.department || 'IT',
          permissions: role.permissions,
          usersAssigned: 0,
          createdAt: role.createdAt || new Date().toISOString(),
          updatedAt: role.updatedAt || new Date().toISOString(),
        }));
        
        setRoles(transformedRoles);
        setTotalRoles(result.metadata?.total || transformedRoles.length);
      } else {
        console.error('Failed to fetch roles:', result.message);
        if (result.requiresAuth) {
          toast.error('Session expired. Please login again.');
        } else {
          toast.error(result.message || 'Failed to fetch roles');
        }
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles. Please try again.');
    }
  };

  // Fetch branches from API
  const fetchBranches = async (page = 1, limit = 100) => {
    try {
      const result = await getAllBranches(page, limit);
      
      if (result.success && result.data) {
        const transformedBranches = result.data.map((branch) => ({
          id: branch._id,
          branchId: branch.branchId,
          branchName: branch.branchName,
          branchLocation: branch.branchLocation,
          branchPhoneNumber: branch.branchPhoneNumber,
          branchEmail: branch.branchEmail,
          branchManager: branch.branchManager,
          branchCoordinates: branch.branchCoordinates || [0, 0],
          createdAt: branch.createdAt || new Date().toISOString(),
        }));
        
        setBranches(transformedBranches);
        setTotalBranches(result.metadata?.total || transformedBranches.length);
      } else {
        console.error('Failed to fetch branches:', result.message);
        if (result.requiresAuth) {
          toast.error('Session expired. Please login again.');
        } else {
          toast.error(result.message || 'Failed to fetch branches');
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to fetch branches. Please try again.');
    }
  };

  // Fetch users from API
  const fetchUsers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const result = await getAllUsers(page, limit);
      
      if (result.success && result.data) {
        const transformedUsers = result.data.map((user) => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phoneNumber,
          dateOfBirth: user.dateOfBirthday,
          department: user.department || 'IT',
          role: user.roleName,
          branch: user.inBranch,
          image: user.imageUrl,
          permissions: user.permissions,
          createdAt: new Date().toISOString(),
        }));
        
        setClients(transformedUsers);
        setTotalUsers(result.metadata?.total || 0);
        
        // Set user role and permissions from first user or from auth context
        if (transformedUsers.length > 0) {
          const currentUserRole = localStorage.getItem('userRole') || transformedUsers[0].role;
          setUserRole(currentUserRole);
          
          // Set user permissions from the logged-in user's data
          // You should ideally get the current logged-in user's ID from your auth context
          // For now, we'll use the first user or localStorage
          const currentUserId = localStorage.getItem('userId');
          const currentUser = transformedUsers.find(u => u.id === currentUserId) || transformedUsers[0];
          
          if (currentUser && currentUser.permissions && currentUser.permissions.userPermissions) {
            // setUserPermissions(currentUser.permissions.userPermissions);
          }
        }
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
    // Fetch roles and branches first, then users
    const fetchAllData = async () => {
      await Promise.all([
        fetchRoles(1, 100),
        fetchBranches(1, 100)
      ]);
      await fetchUsers(currentPage, itemsPerPage);
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const formik = useFormik({
    initialValues: {
      firstName: editingClient?.firstName || '',
      lastName: editingClient?.lastName || '',
      email: editingClient?.email || '',
      phone: editingClient?.phone || '',
      dateOfBirth: editingClient?.dateOfBirth || '',
      department: editingClient?.department || '',
      role: editingClient?.role || '',
      inBranch: editingClient?.branch || '',
      image: null,
      password: '',
      gender: 'Male',
      nationality: 'Pakistani',
      countryOfResidence: 'Pakistan',
    },
    validationSchema: clientValidationSchema,
    context: { isEditing: !!editingClient },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const deviceInfo = getDeviceInfo();
        const phoneNumber = values.phone.replace(/\s/g, '');
        
        const userData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: phoneNumber,
          dateOfBirthday: values.dateOfBirth,
          gender: values.gender,
          imageUrl: values.imageUrl || "https://example.com/images/default.jpg",
          roleName: values.role,
          department: values.department,
          inBranch: values.inBranch, // This will now contain the branch ID
          countryOfResidence: values.countryOfResidence,
          nationality: values.nationality,
          isPhoneVerified: true,
          isEmailVerified: true,
          deviceType: deviceInfo.deviceType,
          deviceName: deviceInfo.deviceName,
          deviceOperatingSystem: deviceInfo.deviceOperatingSystem,
          deviceIPAddress: "0.0.0.0"
        };

        // Add password only for new users
        if (!editingClient && values.password) {
          userData.password = values.password;
        }

        let result;
        if (editingClient) {
          result = await updateUser(editingClient.id, userData);
        } else {
          result = await createUser(userData);
        }

        if (result.success) {
          toast.success(result.message || (editingClient ? 'User updated successfully!' : 'User created successfully!'));
          resetForm();
          setImagePreview(null);
          setDrawerOpen(false);
          setEditingClient(null);
          fetchUsers(currentPage, itemsPerPage);
        } else {
          if (result.requiresAuth) {
            toast.error('Session expired. Please login again.');
          } else {
            toast.error(result.message || (editingClient ? 'Failed to update user' : 'Failed to create user'));
          }
        }
      } catch (error) {
        console.error('Error saving user:', error);
        toast.error('Failed to save user. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || client.email.toLowerCase().includes(searchQuery.toLowerCase()) || client.phone.includes(searchQuery) || client.department.toLowerCase().includes(searchQuery.toLowerCase()) || client.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || client.role === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients;
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
    if (!userPermissions.canEdit) {
      toast.error('You do not have permission to edit users');
      return;
    }
    setEditingClient(client);
    setImagePreview(client.image || null);
    setDrawerOpen(true);
    setShowActionsDropdown(null);
  };

  const handleDelete = async (clientId) => {
    if (!userPermissions.canDelete) {
      toast.error('You do not have permission to delete users');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await deleteUser(clientId);
        
        if (result.success) {
          toast.success(result.message || 'User deleted successfully!');
          fetchUsers(currentPage, itemsPerPage);
        } else {
          if (result.requiresAuth) {
            toast.error('Session expired. Please login again.');
          } else {
            toast.error(result.message || 'Failed to delete user');
          }
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user. Please try again.');
      }
      setShowActionsDropdown(null);
    }
  };

  const handleAddUser = () => {
    if (!userPermissions.canAdd) {
      toast.error('You do not have permission to add users');
      return;
    }
    setEditingClient(null);
    formik.resetForm();
    setImagePreview(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingClient(null);
    formik.resetForm();
    setImagePreview(null);
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
    let password = '';
    const categories = {
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      special: '@$!%*?&'
    };
    password += categories.lowercase[Math.floor(Math.random() * categories.lowercase.length)];
    password += categories.uppercase[Math.floor(Math.random() * categories.uppercase.length)];
    password += categories.numbers[Math.floor(Math.random() * categories.numbers.length)];
    password += categories.special[Math.floor(Math.random() * categories.special.length)];
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    formik.setFieldValue('password', password);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    formik.setFieldValue('image', null);
    setImagePreview(null);
  };

  const formatPhoneDisplay = (phone) => {
    if (!phone) return '';
    return phone;
  };

  // Helper function to get branch name by ID
  const getBranchNameById = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.branchName : branchId;
  };

  return (
    <>
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
                Manage All Users
              </h1>
              <p className="text-gray-400 mt-2">View and manage all Save In Gold CRM Users</p>
            </div>
            {userPermissions.canAdd && (
              <button
                onClick={handleAddUser}
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] text-black overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#BBA473]/40 transform hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <UserPlus className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative z-10">Add New User</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {userPermissions.canView && (
          <div className="mb-6 overflow-x-auto animate-fadeIn">
            <div className="flex gap-2 border-b border-[#BBA473]/30 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-[#BBA473] text-[#BBA473] bg-[#BBA473]/10'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        {userPermissions.canView && (
          <div className="mb-6 flex flex-col lg:flex-row gap-4 animate-fadeIn">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, department, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-[#BBA473]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBA473]/50 focus:border-[#BBA473] bg-[#1A1A1A] text-white transition-all duration-300 hover:border-[#BBA473]"
              />
            </div>
          </div>
        )}

        {/* Permission Denied Message */}
        {!userPermissions.canView && (
          <div className="bg-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden border border-red-500/20 animate-fadeIn p-12 text-center">
            <div className="text-red-400 text-xl font-semibold mb-2">Access Denied</div>
            <p className="text-gray-400">You do not have permission to view users.</p>
          </div>
        )}

        {/* Table Container */}
        {userPermissions.canView && (
          <div className="bg-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden border border-[#BBA473]/20 animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1A1A1A] border-b border-[#BBA473]/30">
                  <tr>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">ID</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Full Name</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Phone</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Department</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Branch</th>
                    {(userPermissions.canEdit || userPermissions.canDelete) && (
                      <th className="text-center px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BBA473]/10">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                        Loading users...
                      </td>
                    </tr>
                  ) : currentClients.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                        No members found
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
                        <td className="px-6 py-4 text-gray-300">{client.role}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{getBranchNameById(client.branch)}</td>
                        {(userPermissions.canEdit || userPermissions.canDelete) && (
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              {userPermissions.canEdit && (
                                <button
                                  onClick={() => handleEdit(client)}
                                  className="p-2 rounded-lg bg-[#BBA473]/20 text-[#BBA473] hover:bg-[#BBA473] hover:text-black transition-all duration-300 hover:scale-110"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                              {userPermissions.canDelete && (
                                <button
                                  onClick={() => handleDelete(client.id)}
                                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-[#BBA473]/30 hover:border-[#BBA473] disabled:hover:border-[#BBA473]/30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {currentPage > 2 && totalPages > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-4 py-2 rounded-lg bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] transition-all duration-300 border border-[#BBA473]/30 hover:border-[#BBA473]"
                    >
                      1
                    </button>
                    {currentPage > 3 && <span className="text-gray-400">...</span>}
                  </>
                )}

                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 border ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] text-black border-[#BBA473] font-semibold shadow-lg'
                        : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] border-[#BBA473]/30 hover:border-[#BBA473]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {currentPage < totalPages - 1 && totalPages > 3 && (
                  <>
                    {currentPage < totalPages - 2 && <span className="text-gray-400">...</span>}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-4 py-2 rounded-lg bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] transition-all duration-300 border border-[#BBA473]/30 hover:border-[#BBA473]"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-[#BBA473]/30 hover:border-[#BBA473] disabled:hover:border-[#BBA473]/30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full lg:w-2/5 bg-[#1A1A1A] shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-[#BBA473]/30 bg-gradient-to-r from-[#BBA473]/10 to-transparent">
            <div>
              <h2 className="text-2xl font-bold text-[#BBA473]">
                {editingClient ? 'Edit Team User' : 'Add New User'}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {editingClient ? 'Update user information' : 'Fill in the details to add a new team user'}
              </p>
            </div>
            <button
              onClick={handleCloseDrawer}
              className="p-2 rounded-lg hover:bg-[#2A2A2A] transition-all duration-300 text-gray-400 hover:text-white hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="bg-[#2A2A2A] border border-[#BBA473]/30 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-[#BBA473]/30 pb-3">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.firstName && formik.errors.firstName
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.firstName}</div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.lastName && formik.errors.lastName
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.lastName}</div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.email && formik.errors.email
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.email}</div>
                  )}
                </div>

                {/* Date of Birth with Calendar */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formik.values.dateOfBirth}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                        formik.touched.dateOfBirth && formik.errors.dateOfBirth
                          ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                          : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                      }`}
                      style={{
                        colorScheme: 'dark'
                      }}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#BBA473] pointer-events-none" />
                  </div>
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.dateOfBirth}</div>
                  )}
                </div>

                {/* Phone - International */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="AE"
                    value={formik.values.phone}
                    onChange={(value) => formik.setFieldValue('phone', value || '')}
                    onBlur={() => formik.setFieldTouched('phone', true)}
                    className={`phone-input-custom ${
                      formik.touched.phone && formik.errors.phone
                        ? 'phone-input-error'
                        : ''
                    }`}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.phone}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="bg-[#2A2A2A] border border-[#BBA473]/30 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-[#BBA473]/30 pb-3">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="department"
                      value={formik.values.department}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 appearance-none ${
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
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#BBA473] pointer-events-none" />
                  </div>
                  {formik.touched.department && formik.errors.department && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.department}</div>
                  )}
                </div>

                {/* Role - Now using fetched roles */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formik.values.role}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 appearance-none ${
                        formik.touched.role && formik.errors.role
                          ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                          : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                      }`}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.roleName}>{role.roleName}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#BBA473] pointer-events-none" />
                  </div>
                  {formik.touched.role && formik.errors.role && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.role}</div>
                  )}
                </div>

                {/* Branch - Now using fetched branches and storing ID */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="inBranch"
                      value={formik.values.inBranch}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 appearance-none ${
                        formik.touched.inBranch && formik.errors.inBranch
                          ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                          : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                      }`}
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>{branch.branchName}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#BBA473] pointer-events-none" />
                  </div>
                  {formik.touched.inBranch && formik.errors.inBranch && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.inBranch}</div>
                  )}
                </div>

                {/* Password - only for new users */}
                {!editingClient && (
                  <div className="space-y-2">
                    <label className="text-sm text-[#E8D5A3] font-medium block">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-3 pr-24 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                          formik.touched.password && formik.errors.password
                            ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                            : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-white focus:outline-none transition-all duration-300 hover:scale-110"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={generatePassword}
                          className="h-7 px-2 flex items-center justify-center bg-[#BBA473] text-black rounded-md hover:bg-[#d4bc89] focus:outline-none text-xs transition-all duration-300 hover:scale-105"
                          title="Generate Password"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          <span>Gen</span>
                        </button>
                      </div>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="text-red-400 text-sm animate-pulse">{formik.errors.password}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2 pt-4">
                <label className="text-sm text-[#E8D5A3] font-medium block">
                  Profile Image
                </label>
                
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-[#BBA473]/30 rounded-lg p-6 text-center hover:border-[#BBA473] transition-all duration-300">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="w-12 h-12 text-gray-400 transition-transform duration-300 hover:scale-110" />
                      <span className="text-gray-400">Click to upload image</span>
                      <span className="text-xs text-gray-500">JPG, PNG or GIF (Max 5MB)</span>
                    </label>
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-[#BBA473]"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-300 hover:scale-110 hover:rotate-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {formik.touched.image && formik.errors.image && (
                  <div className="text-red-400 text-sm animate-pulse">{formik.errors.image}</div>
                )}
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
                  ? (editingClient ? 'Updating...' : 'Creating...') 
                  : (editingClient ? 'Update User' : 'Create User')
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

        /* Custom Phone Input Styles */
        .phone-input-custom .PhoneInputInput {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid rgba(187, 164, 115, 0.3);
          border-radius: 0.5rem;
          background-color: #1A1A1A;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .phone-input-custom .PhoneInputInput:hover {
          border-color: #BBA473;
        }

        .phone-input-custom .PhoneInputInput:focus {
          border-color: #BBA473;
          ring: 2px;
          ring-color: rgba(187, 164, 115, 0.5);
        }

        .phone-input-error .PhoneInputInput {
          border-color: #ef4444;
        }

        .phone-input-error .PhoneInputInput:focus {
          border-color: #f87171;
          ring-color: rgba(239, 68, 68, 0.5);
        }

        .phone-input-custom .PhoneInputCountry {
          margin-right: 0.5rem;
          padding: 0.5rem;
          background-color: #1A1A1A;
          border: 2px solid rgba(187, 164, 115, 0.3);
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .phone-input-custom .PhoneInputCountry:hover {
          border-color: #BBA473;
        }

        .phone-input-custom .PhoneInputCountryIcon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .phone-input-custom .PhoneInputCountrySelectArrow {
          color: #BBA473;
          opacity: 0.8;
          margin-left: 0.5rem;
        }

        /* Custom select arrow fix */
        select {
          background-image: none;
        }

        /* Date input calendar icon styling */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.6) sepia(1) saturate(3) hue-rotate(5deg);
          cursor: pointer;
          opacity: 0;
          position: absolute;
          right: 0;
          width: 100%;
          height: 100%;
        }

        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default ClientManagement;