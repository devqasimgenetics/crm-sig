import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronLeft, ChevronRight, X, UserPlus, Eye } from 'lucide-react';

// Validation Schema
const leadValidationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\+\d{1,4}\s\d{1,14}$/, 'Invalid phone number format'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'Must be at least 18 years old', function(value) {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      return value <= cutoff;
    }),
  nationality: Yup.string().required('Nationality is required'),
  residency: Yup.string().required('Residency is required'),
  language: Yup.string().required('Preferred language is required'),
  source: Yup.string().required('Lead source is required'),
  remarks: Yup.string().max(500, 'Remarks must not exceed 500 characters'),
});

// Generate dummy leads
const generateDummyLeads = () => {
  const names = ['John Smith', 'Sarah Johnson', 'Mohammed Al-Mansouri', 'Fatima Khan', 'Ahmed Hassan', 'Layla Ibrahim', 'Omar Abdullah', 'Aisha Rahman', 'Ali Al-Sayed', 'Noura Al-Farsi', 'Hassan Malik', 'Maryam Ahmed', 'Khalid Al-Hashimi', 'Zainab Ali', 'Abdullah Omar', 'Noor Ahmed', 'Tariq Hussain', 'Amira Nasir', 'Youssef Ibrahim', 'Huda Mahmoud', 'Rami Al-Zayed', 'Salma Mustafa', 'Faisal Al-Mansoori', 'Dina Kamal', 'Hamza Youssef'];
  const nationalities = ['Pakistani', 'Indian', 'Egyptian', 'Emirati', 'Saudi', 'British', 'American', 'Filipino', 'Jordanian', 'Lebanese', 'Syrian', 'Iraqi', 'Yemeni', 'Kuwaiti'];
  const residencies = ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Pakistan', 'India', 'Egypt', 'Jordan', 'United Kingdom'];
  const languages = ['English', 'Arabic', 'Urdu', 'Hindi', 'French', 'Spanish', 'Bengali', 'Tamil'];
  const sources = ['Website', 'Social Media (Facebook)', 'Social Media (Instagram)', 'Social Media (LinkedIn)', 'Google Ads', 'Referral', 'Walk-in', 'Phone Call', 'Email Campaign', 'WhatsApp', 'Exhibition/Event', 'Agent', 'Partner'];
  
  return Array.from({ length: 87 }, (_, i) => {
    const name = names[Math.floor(Math.random() * names.length)];
    const age = Math.floor(Math.random() * 41) + 25;
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const emailName = name.toLowerCase().replace(/\s+/g, '.');
    
    return {
      id: 200000250 - i,
      name,
      email: `${emailName}@example.com`,
      phone: `+971 ${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
      dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
      nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
      residency: residencies[Math.floor(Math.random() * residencies.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      remarks: Math.random() > 0.5 ? 'Interested in gold investment' : '',
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: ['New', 'Contacted', 'Qualified', 'Unqualified'][Math.floor(Math.random() * 4)]
    };
  });
};

const LeadManagement = () => {
  const [leads, setLeads] = useState(generateDummyLeads());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const tabs = ['All', 'New', 'Contacted', 'Qualified', 'Unqualified'];
  const perPageOptions = [10, 20, 30, 50, 100];

  const countryCodes = [
    { code: 'ae', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
    { code: 'sa', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
    { code: 'pk', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
    { code: 'in', name: 'India', dialCode: '+91', flag: '🇮🇳' },
    { code: 'gb', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
    { code: 'us', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
    { code: 'eg', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
    { code: 'jo', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
    { code: 'kw', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
    { code: 'qa', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  const nationalities = ['Afghan', 'Albanian', 'Algerian', 'American', 'Argentinian', 'Australian', 'Austrian', 'Bangladeshi', 'Belgian', 'Brazilian', 'British', 'Canadian', 'Chinese', 'Colombian', 'Danish', 'Dutch', 'Egyptian', 'Emirati', 'Filipino', 'Finnish', 'French', 'German', 'Greek', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Italian', 'Japanese', 'Jordanian', 'Kenyan', 'Korean', 'Kuwaiti', 'Lebanese', 'Malaysian', 'Mexican', 'Moroccan', 'Nigerian', 'Norwegian', 'Pakistani', 'Palestinian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Saudi', 'Singaporean', 'South African', 'Spanish', 'Sri Lankan', 'Swedish', 'Swiss', 'Syrian', 'Thai', 'Turkish', 'Ukrainian', 'Yemeni'];

  const residencies = ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Pakistan', 'India', 'Egypt', 'Jordan', 'Lebanon', 'United Kingdom', 'United States', 'Canada', 'Australia', 'Other'];

  const languages = ['English', 'Arabic', 'Urdu', 'Hindi', 'French', 'Spanish', 'German', 'Chinese (Mandarin)', 'Russian', 'Portuguese', 'Italian', 'Japanese', 'Korean', 'Turkish', 'Persian (Farsi)', 'Bengali', 'Tamil', 'Telugu', 'Malayalam'];

  const sources = ['Website', 'Social Media (Facebook)', 'Social Media (Instagram)', 'Social Media (LinkedIn)', 'Social Media (Twitter)', 'Google Ads', 'Referral', 'Walk-in', 'Phone Call', 'Email Campaign', 'Exhibition/Event', 'WhatsApp', 'Agent', 'Partner', 'Other'];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.email.toLowerCase().includes(searchQuery.toLowerCase()) || lead.phone.includes(searchQuery) || lead.nationality.toLowerCase().includes(searchQuery.toLowerCase()) || lead.residency.toLowerCase().includes(searchQuery.toLowerCase()) || lead.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || lead.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);
  const showingFrom = startIndex + 1;
  const showingTo = Math.min(endIndex, filteredLeads.length);

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

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setDrawerOpen(true);
    setShowActionsDropdown(null);
  };

  const handleDelete = (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLeads(leads.filter(lead => lead.id !== leadId));
      setShowActionsDropdown(null);
    }
  };

  const handleViewDetails = (lead) => {
    console.log('Viewing details for:', lead);
    alert(`Viewing details for: ${lead.name}`);
    setShowActionsDropdown(null);
  };

  const toggleActionsDropdown = (leadId) => {
    setShowActionsDropdown(showActionsDropdown === leadId ? null : leadId);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'bg-blue-500/20 text-blue-400';
      case 'Contacted': return 'bg-yellow-500/20 text-yellow-400';
      case 'Qualified': return 'bg-green-500/20 text-green-400';
      case 'Unqualified': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleAddLead = () => {
    setEditingLead(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setEditingLead(null), 300);
  };

  const getInitialValues = (existingLead) => {
    if (existingLead) {
      return {
        name: existingLead.name || '',
        phone: existingLead.phone || '',
        email: existingLead.email || '',
        dateOfBirth: existingLead.dateOfBirth || '',
        nationality: existingLead.nationality || '',
        residency: existingLead.residency || '',
        language: existingLead.language || '',
        source: existingLead.source || '',
        remarks: existingLead.remarks || '',
      };
    }
    return {
      name: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      nationality: '',
      residency: '',
      language: '',
      source: '',
      remarks: '',
    };
  };

  const formik = useFormik({
    initialValues: getInitialValues(editingLead),
    validationSchema: leadValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      console.log('Lead Form submitted:', values);
      alert(editingLead ? 'Lead updated successfully!' : 'Lead created successfully!');
      setSubmitting(false);
      resetForm();
      handleCloseDrawer();
    },
  });

  return (
    <>
      <main className="relative p-1 overflow-x-hidden bg-[#1A1A1A] min-h-screen pt-8">
        <div className="px-2">
          {/* Header */}
          <div className={`flex flex-col sm:flex-row sm:items-center gap-4 mb-2 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
            <h1 className="text-3xl font-bold text-white sm:flex-shrink-0">Leads Management</h1>
            
            <div className="flex items-center gap-4 sm:ml-auto">
              {/* Search Bar */}
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

              {/* Add New Button */}
              <button 
                onClick={handleAddLead}
                className="bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] hover:from-[#d4bc89] hover:to-[#a69363] text-black rounded px-4 py-2 flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#BBA473]/40 transform hover:scale-105 active:scale-95 font-semibold"
              >
                <Plus className="h-4 w-4" />
                Add Lead
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
                  <th className="hidden lg:table-cell py-2 px-3 text-sm text-left">Nationality</th>
                  <th className="hidden xl:table-cell py-2 px-3 text-sm text-left">Residency</th>
                  <th className="hidden 2xl:table-cell py-2 px-3 text-sm text-left">Language</th>
                  <th className="hidden lg:table-cell py-2 px-3 text-sm text-left">Source</th>
                  <th className="py-2 px-3 text-sm text-left">Status</th>
                  <th className="py-2 px-3 text-sm text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead) => {
                  const initials = lead.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-[#BBA473]/20 hover:bg-[#3A3A3A] transition-all duration-300 hover:shadow-md"
                    >
                      <td className="py-3 px-3 text-sm">{lead.id}</td>
                      <td className="py-3 px-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#BBA473] flex items-center justify-center text-black font-semibold text-xs transition-transform duration-300 hover:scale-110">
                            {initials}
                          </div>
                          <span className="font-medium">{lead.name}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell py-3 px-3 text-sm">{lead.email}</td>
                      <td className="hidden sm:table-cell py-3 px-3 text-sm">{lead.phone}</td>
                      <td className="hidden lg:table-cell py-3 px-3 text-sm">
                        <span className="px-2 py-1 bg-[#BBA473]/20 text-[#BBA473] rounded text-xs font-medium">
                          {lead.nationality}
                        </span>
                      </td>
                      <td className="hidden xl:table-cell py-3 px-3 text-sm text-gray-400">{lead.residency}</td>
                      <td className="hidden 2xl:table-cell py-3 px-3 text-sm text-gray-400">{lead.language}</td>
                      <td className="hidden lg:table-cell py-3 px-3 text-sm">
                        <span className="text-xs text-gray-400">{lead.source}</span>
                      </td>
                      <td className="py-3 px-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => toggleActionsDropdown(lead.id)}
                            className="p-2 hover:bg-[#4A4A4A] rounded-lg transition-all duration-300 hover:scale-110"
                          >
                            <svg className="w-5 h-5 text-[#E8D5A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>

                          {showActionsDropdown === lead.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#2A2A2A] border border-[#BBA473]/30 rounded-lg shadow-lg z-50 overflow-hidden animate-fadeIn">
                              <button onClick={() => handleViewDetails(lead)} className="w-full px-4 py-2 text-left text-sm text-[#E8D5A3] hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors">
                                <Eye className="w-4 h-4" />View Details
                              </button>
                              <button onClick={() => handleEdit(lead)} className="w-full px-4 py-2 text-left text-sm text-[#E8D5A3] hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors">
                                <Edit className="w-4 h-4" />Edit
                              </button>
                              <button onClick={() => handleDelete(lead.id)} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#3A3A3A] flex items-center gap-2 transition-colors">
                                <Trash2 className="w-4 h-4" />Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                    Showing <span className="font-medium text-[#BBA473]">{showingFrom}</span> to <span className="font-medium text-[#BBA473]">{showingTo}</span> of <span className="font-medium text-[#BBA473]">{filteredLeads.length}</span> results
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
                {editingLead ? 'Edit Lead' : 'Add New Lead'}
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
                Lead Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.name && formik.errors.name
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.name}</div>
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
                        <div className="absolute z-20 mt-1 w-64 bg-[#2A2A2A] border-2 border-[#BBA473] rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                              <span className="flex-1 text-sm">{country.name}</span>
                              <span className="text-gray-400 text-sm">{country.dialCode}</span>
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

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john.doe@example.com"
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

                {/* Nationality */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="nationality"
                    value={formik.values.nationality}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.nationality && formik.errors.nationality
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  >
                    <option value="">Select Nationality</option>
                    {nationalities.map((nationality) => (
                      <option key={nationality} value={nationality}>{nationality}</option>
                    ))}
                  </select>
                  {formik.touched.nationality && formik.errors.nationality && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.nationality}</div>
                  )}
                </div>

                {/* Residency */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Country of Residency <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="residency"
                    value={formik.values.residency}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.residency && formik.errors.residency
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  >
                    <option value="">Select Residency</option>
                    {residencies.map((residency) => (
                      <option key={residency} value={residency}>{residency}</option>
                    ))}
                  </select>
                  {formik.touched.residency && formik.errors.residency && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.residency}</div>
                  )}
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Preferred Language <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="language"
                    value={formik.values.language}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.language && formik.errors.language
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  >
                    <option value="">Select Language</option>
                    {languages.map((language) => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                  {formik.touched.language && formik.errors.language && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.language}</div>
                  )}
                </div>

                {/* Source */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Lead Source <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="source"
                    value={formik.values.source}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white transition-all duration-300 ${
                      formik.touched.source && formik.errors.source
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  >
                    <option value="">Select Source</option>
                    {sources.map((source) => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                  {formik.touched.source && formik.errors.source && (
                    <div className="text-red-400 text-sm animate-pulse">{formik.errors.source}</div>
                  )}
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <label className="text-sm text-[#E8D5A3] font-medium block">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    placeholder="Add any additional notes or comments about this lead..."
                    rows="4"
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1A1A1A] text-white resize-none transition-all duration-300 ${
                      formik.touched.remarks && formik.errors.remarks
                        ? 'border-red-500 focus:border-red-400 focus:ring-red-500/50'
                        : 'border-[#BBA473]/30 focus:border-[#BBA473] focus:ring-[#BBA473]/50 hover:border-[#BBA473]'
                    }`}
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      {formik.touched.remarks && formik.errors.remarks && (
                        <div className="text-red-400 text-sm animate-pulse">{formik.errors.remarks}</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formik.values.remarks.length}/500
                    </div>
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
                  ? (editingLead ? 'Updating Lead...' : 'Creating Lead...') 
                  : (editingLead ? 'Update Lead' : 'Create Lead')
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

export default LeadManagement;