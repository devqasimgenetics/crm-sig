import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, RefreshCw, Upload, X } from 'lucide-react';

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
  department: Yup.string()
    .required('Department is required'),
  role: Yup.string()
    .required('Role is required'),
  inBranch: Yup.string()
    .required('Branch is required'),
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

// Initial Values
const initialValues = {
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

const CreateClientForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [countryCodes] = useState([
    { code: 'ae', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
    { code: 'iq', name: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
    { code: 'jo', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
    { code: 'sa', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  ]);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Dropdown options
  const departments = [
    'Sales',
    'Marketing',
    'Finance',
    'Human Resources',
    'IT',
    'Operations',
    'Customer Service',
    'Administration',
  ];

  const roles = [
    'Manager',
    'Team Lead',
    'Senior Associate',
    'Associate',
    'Junior Associate',
    'Intern',
    'Consultant',
    'Director',
  ];

  const branches = [
    'Dubai Main Branch',
    'Abu Dhabi Branch',
    'Sharjah Branch',
    'Ajman Branch',
    'Ras Al Khaimah Branch',
    'Fujairah Branch',
    'Umm Al Quwain Branch',
  ];

  // Handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    formik.setFieldValue('image', null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  // Generate random password
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

  // useFormik hook
  const formik = useFormik({
    initialValues,
    validationSchema: clientValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log('Form submitted:', values);
      if (onSubmit) {
        onSubmit(values);
      }
      setSubmitting(false);
    },
  });

  // Helper function to get field error
  const getFieldError = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName];
  };

  return (
    <main className="relative p-1 overflow-x-hidden min-h-screen bg-black">
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-4 sm:py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/clients")}
          className="flex items-center space-x-2 text-white hover:text-gray-300 hover:underline transition mb-4 cursor-pointer"
          type="button"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">Create New Client</h1>

        {/* Form Container */}
        <div className="bg-[#1e1e1e] border border-[#BBA473] rounded-lg p-4 sm:p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6" autoComplete="off">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('firstName') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                />
                {getFieldError('firstName') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.firstName}</div>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('lastName') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                />
                {getFieldError('lastName') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.lastName}</div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john.doe@saveingold.ae"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('email') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                />
                {getFieldError('email') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="h-11 px-3 bg-[#2e2e2e] border-2 border-[#BBA473] border-r-0 rounded-l-md flex items-center gap-2 hover:bg-[#3e3e3e] transition"
                    >
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <span className="text-white text-sm">{selectedCountry.dialCode}</span>
                    </button>
                    
                    {showCountryDropdown && (
                      <div className="absolute z-10 mt-1 w-64 bg-[#2e2e2e] border-2 border-[#BBA473] rounded-md shadow-lg">
                        {countryCodes.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              formik.setFieldValue('phone', `${country.dialCode} `);
                              setShowCountryDropdown(false);
                            }}
                            className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#3e3e3e] text-white text-left transition"
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
                    className={`flex-1 px-4 py-2 border-2 ${
                      getFieldError('phone') ? 'border-red-500' : 'border-[#BBA473]'
                    } border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                  />
                </div>
                {getFieldError('phone') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('dateOfBirth') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                />
                {getFieldError('dateOfBirth') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.dateOfBirth}</div>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('department') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {getFieldError('department') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.department}</div>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('role') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {getFieldError('role') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.role}</div>
                )}
              </div>

              {/* InBranch */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Branch <span className="text-red-500">*</span>
                </label>
                <select
                  name="inBranch"
                  value={formik.values.inBranch}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('inBranch') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                {getFieldError('inBranch') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.inBranch}</div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
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
                    className={`w-full px-4 py-2 pr-24 border ${
                      getFieldError('password') ? 'border-red-500' : 'border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-white focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="h-7 px-2 flex items-center justify-center bg-[#BBA473] text-black rounded-md hover:bg-[#d4bc89] focus:outline-none text-xs"
                      title="Generate Password"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      <span>Gen</span>
                    </button>
                  </div>
                </div>
                {getFieldError('password') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 block">
                Profile Image
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#BBA473] transition-colors">
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
                    <Upload className="w-12 h-12 text-gray-400" />
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
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {getFieldError('image') && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.image}</div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full px-4 py-3 rounded-md font-semibold transition-colors duration-200 ease-in-out bg-gradient-to-r from-[#8E7D5A] to-[#685A3D] text-white hover:from-[#a69363] hover:to-[#7a6749] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? 'Creating Client...' : 'Create Client'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateClientForm;