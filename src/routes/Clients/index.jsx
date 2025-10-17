import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronLeft, ChevronRight, X, UserPlus, Eye, EyeOff, RefreshCw, Upload } from 'lucide-react';

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
    .matches(/^\+\d{1,4}\s\d{1,14}$/, 'Invalid phone number format'),
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
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
});

// Generate dummy clients
const generateDummyClients = () => {
  const firstNames = ['John', 'Sarah', 'Mohammed', 'Fatima', 'Ahmed', 'Layla', 'Omar', 'Aisha', 'Ali', 'Noura', 'Hassan', 'Maryam', 'Khalid', 'Zainab', 'Abdullah'];
  const lastNames = ['Smith', 'Johnson', 'Al-Mansouri', 'Khan', 'Al-Hashimi', 'Brown', 'Davis', 'Wilson', 'Al-Sayed', 'Martinez', 'Garcia', 'Al-Farsi', 'Anderson', 'Taylor'];
  const departments = ['Sales', 'Marketing', 'Finance', 'Human Resources', 'IT', 'Operations', 'Customer Service', 'Administration'];
  const roles = ['Manager', 'Team Lead', 'Senior Associate', 'Associate', 'Junior Associate', 'Consultant', 'Director'];
  const branches = ['Dubai Main Branch', 'Abu Dhabi Branch', 'Sharjah Branch', 'Ajman Branch', 'Ras Al Khaimah Branch'];

  return Array.from({ length: 73 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 36) + 25;
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    
    return {
      id: 100000169 - i,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@saveingold.ae`,
      phone: `+971 ${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
      dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      image: null,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

const ClientManagement = () => {
  const [clients, setClients] = useState(generateDummyClients());
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
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const tabs = ['All', 'Sales', 'Marketing', 'Finance', 'IT', 'Operations'];
  const perPageOptions = [10, 20, 30, 50, 100];

  const countryCodes = [
    { code: 'ae', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
    { code: 'iq', name: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
    { code: 'jo', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
    { code: 'sa', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  const departments = ['Sales', 'Marketing', 'Finance', 'Human Resources', 'IT', 'Operations', 'Customer Service', 'Administration'];
  const roles = ['Manager', 'Team Lead', 'Senior Associate', 'Associate', 'Junior Associate', 'Intern', 'Consultant', 'Director'];
  const branches = ['Dubai Main Branch', 'Abu Dhabi Branch', 'Sharjah Branch', 'Ajman Branch', 'Ras Al Khaimah Branch', 'Fujairah Branch', 'Umm Al Quwain Branch'];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || client.email.toLowerCase().includes(searchQuery.toLowerCase()) || client.phone.includes(searchQuery) || client.department.toLowerCase().includes(searchQuery.toLowerCase()) || client.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || client.department === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);
  const showingFrom = startIndex + 1;
  const showingTo = Math.min(endIndex, filteredClients.length);

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
    setEditingClient(client);
    setDrawerOpen(true);
    setShowActionsDropdown(null);
  };

  const handleDelete = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== clientId));
      setShowActionsDropdown(null);
    }
  };

  const handleViewDetails = (client) => {
    console.log('Viewing details for:', client);
    alert(`Viewing details for: ${client.fullName}`);
    setShowActionsDropdown(null);
  };

  const toggleActionsDropdown = (clientId) => {
    setShowActionsDropdown(showActionsDropdown === clientId ? null : clientId);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setImagePreview(null);
    setTimeout(() => setEditingClient(null), 300);
  };

  const getInitialValues = (existingClient) => {
    if (existingClient) {
      return {
        firstName: existingClient.firstName || '',
        lastName: existingClient.lastName || '',
        email: existingClient.email || '',
        phone: existingClient.phone || '',
        dateOfBirth: existingClient.dateOfBirth || '',
        department: existingClient.department || '',
        role: existingClient.role || '',
        inBranch: existingClient.branch || '',
        image: null,
        password: '',
      };
    }
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      department: '',
      role: '',
      inBranch: '',
      image: null,
      password: '',
    };
  };

  const formik = useFormik({
    initialValues: getInitialValues(editingClient),
    validationSchema: clientValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      console.log('Form submitted:', values);
      alert(editingClient ? 'Client updated successfully!' : 'Client created successfully!');
      setSubmitting(false);
      resetForm();
      handleCloseDrawer();
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
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
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
    const uppercaseCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseCharset = 'abcdefghijklmnopqrstuvwxyz';
    const numberCharset = '0123456789';
    const specialCharset = '@$!%*?&';
    
    let password = '';
    password += uppercaseCharset[Math.floor(Math.random() * uppercaseCharset.length)];
    password += lowercaseCharset[Math.floor(Math.random() * lowercaseCharset.length)];
    password += numberCharset[Math.floor(Math.random() * numberCharset.length)];
    password += specialCharset[Math.floor(Math.random() * specialCharset.length)];
    
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    formik.setFieldValue('password', password);
  };

  return (
    <>
      <main className="relative p-1 overflow-x-hidden bg-[#1A1A1A] min-h-screen pt-8">
        <div className="px-2">
          {/* Header */}
          <div className={`flex flex-col sm:flex-row sm:items-center gap-4 mb-2 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
            <h1 className="text-3xl font-bold text-white sm:flex-shrink-0">SIG Team</h1>
            
            <div className="flex items-center gap-4 sm:ml-auto">
              <div className="relative w-65 group">
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full px-4 py-2 rounded-lg bg-[#2A2A2A] text-[#E8D5A3] border border-[#BBA473]/30 focus:outline-none focus:border-[#BBA473] focus:ring-2 focus:ring-[#BBA473]/50 placeholder-[#E8D5A3]/50 text-sm transition-all duration-300 hover:border-[#d4bc89]"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#E8D5A3] w-4 h-4 transition-all duration-300 group-hover:text-[#BBA473]" />
              </div>

              <button 
                onClick={handleAddClient}
                className="bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] hover:from-[#d4bc89] hover:to-[#a69363] text-black rounded px-4 py-2 flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#BBA473]/40 transform hover:scale-105 active:scale-95 font-semibold"
              >
                <Plus className="h-4 w-4" />
                Add New
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
                    className="border-b border-[#BBA473]/20 hover:bg-[#3A3A3A] transition-all duration-300 hover:shadow-md"
                  >
                    <td className="py-3 px-3 text-sm">{client.id}</td>
                    <td className="py-3 px-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#BBA473] flex items-center justify-center text-black font-semibold text-xs transition-transform duration-300 hover:scale-110">
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
                          className="p-2 hover:bg-[#4A4A4A] rounded-lg transition-all duration-300 hover:scale-110"
                        >
                          <svg className="w-5 h-5 text-[#E8D5A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>

                        {showActionsDropdown === client.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-[#2A2A2A] border border-[#BBA473]/30 rounded-lg shadow-lg z-50 overflow-hidden animate-fadeIn">
                            <button onClick={() => handleViewDetails(client)} className="w-full px-4 py-2 text-left text-sm text-[#E8D5A3] hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors">
                              <Eye className="w-4 h-4" />View Details
                            </button>
                            <button onClick={() => handleEdit(client)} className="w-full px-4 py-2 text-left text-sm text-[#E8D5A3] hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors">
                              <Edit className="w-4 h-4" />Edit
                            </button>
                            <button onClick={() => handleDelete(client.id)} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors">
                              <Trash2 className="w-4 h-4" />Delete
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
                    Showing <span className="font-medium text-[#BBA473]">{showingFrom}</span> to <span className="font-medium text-[#BBA473]">{showingTo}</span> of <span className="font-medium text-[#BBA473]">{filteredClients.length}</span> results
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
                <UserPlus className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {editingClient ? 'Edit SIG Member' : 'Add SIG Member'}
              </h2>
            </div>
            <button onClick={handleCloseDrawer} className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90 p-2 hover:bg-[#2A2A2A] rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-[#2A2A2A] border border-[#BBA473]/30 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">📝</span>
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
                    placeholder="John"
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
                    placeholder="Doe"
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
                    placeholder="john.doe@saveingold.ae"
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

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="h-12 px-3 bg-[#1A1A1A] border-2 border-[#BBA473]/30 border-r-0 rounded-l-lg flex items-center gap-2 hover:bg-[#2A2A2A] transition-all duration-300"
                      >
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="text-white text-sm">{selectedCountry.dialCode}</span>
                      </button>
                      
                      {showCountryDropdown && (
                        <div className="absolute z-20 mt-1 w-64 bg-[#2A2A2A] border-2 border-[#BBA473] rounded-lg shadow-lg">
                          {countryCodes.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country);
                                formik.setFieldValue('phone', `${country.dialCode} `);
                                setShowCountryDropdown(false);
                              }}
                              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#3A3A3A] text-white text-left transition-all duration-300"
                            >
                              <span className="text-xl">{country.flag}</span>
                              <span className="flex-1">{country.name}</span>
                              <span className="text-gray-400">{country.dialCode}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="50 123 4567"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`flex-1 px-4 py-3 border-2 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                        formik.touched.phone && formik.errors.phone
                          ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                          : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                      }`}
                    />
                  </div>
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.phone}</div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.dateOfBirth && formik.errors.dateOfBirth
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  />
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.dateOfBirth}</div>
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

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.role && formik.errors.role
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {formik.touched.role && formik.errors.role && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.role}</div>
                  )}
                </div>

                {/* Branch */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="inBranch"
                    value={formik.values.inBranch}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.inBranch && formik.errors.inBranch
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                  {formik.touched.inBranch && formik.errors.inBranch && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.inBranch}</div>
                  )}
                </div>

                {/* Password */}
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
                  : (editingClient ? 'Update Member' : 'Create Member')
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

export default ClientManagement;