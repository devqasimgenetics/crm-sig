import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

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
  nationality: Yup.string()
    .required('Nationality is required'),
  residency: Yup.string()
    .required('Residency is required'),
  language: Yup.string()
    .required('Preferred language is required'),
  source: Yup.string()
    .required('Lead source is required'),
  remarks: Yup.string()
    .max(500, 'Remarks must not exceed 500 characters'),
});

// Initial Values
const initialValues = {
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

const CreateLeadForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [countryCodes] = useState([
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
  ]);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Dropdown options
  const nationalities = [
    'Afghan', 'Albanian', 'Algerian', 'American', 'Argentinian', 'Australian',
    'Austrian', 'Bangladeshi', 'Belgian', 'Brazilian', 'British', 'Canadian',
    'Chinese', 'Colombian', 'Danish', 'Dutch', 'Egyptian', 'Emirati', 'Filipino',
    'Finnish', 'French', 'German', 'Greek', 'Indian', 'Indonesian', 'Iranian',
    'Iraqi', 'Irish', 'Italian', 'Japanese', 'Jordanian', 'Kenyan', 'Korean',
    'Kuwaiti', 'Lebanese', 'Malaysian', 'Mexican', 'Moroccan', 'Nigerian',
    'Norwegian', 'Pakistani', 'Palestinian', 'Polish', 'Portuguese', 'Qatari',
    'Romanian', 'Russian', 'Saudi', 'Singaporean', 'South African', 'Spanish',
    'Sri Lankan', 'Swedish', 'Swiss', 'Syrian', 'Thai', 'Turkish', 'Ukrainian',
    'Yemeni',
  ];

  const residencies = [
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'Pakistan',
    'India',
    'Egypt',
    'Jordan',
    'Lebanon',
    'United Kingdom',
    'United States',
    'Canada',
    'Australia',
    'Other',
  ];

  const languages = [
    'English',
    'Arabic',
    'Urdu',
    'Hindi',
    'French',
    'Spanish',
    'German',
    'Chinese (Mandarin)',
    'Russian',
    'Portuguese',
    'Italian',
    'Japanese',
    'Korean',
    'Turkish',
    'Persian (Farsi)',
    'Bengali',
    'Tamil',
    'Telugu',
    'Malayalam',
  ];

  const sources = [
    'Website',
    'Social Media (Facebook)',
    'Social Media (Instagram)',
    'Social Media (LinkedIn)',
    'Social Media (Twitter)',
    'Google Ads',
    'Referral',
    'Walk-in',
    'Phone Call',
    'Email Campaign',
    'Exhibition/Event',
    'WhatsApp',
    'Agent',
    'Partner',
    'Other',
  ];

  // useFormik hook
  const formik = useFormik({
    initialValues,
    validationSchema: leadValidationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      console.log('Lead Form submitted:', values);
      if (onSubmit) {
        onSubmit(values);
      }
      setSubmitting(false);
      // Optional: Reset form after successful submission
      // resetForm();
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
          onClick={() => navigate("/leads")}
          className="flex items-center space-x-2 text-white hover:text-gray-300 hover:underline transition mb-4 cursor-pointer"
          type="button"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">Add New Lead</h1>

        {/* Form Container */}
        <div className="bg-[#1e1e1e] border border-[#BBA473] rounded-lg p-4 sm:p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6" autoComplete="off">
            {/* Lead Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-gray-400 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('name') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                />
                {getFieldError('name') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
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
                      <div className="absolute z-10 mt-1 w-64 bg-[#2e2e2e] border-2 border-[#BBA473] rounded-md shadow-lg max-h-60 overflow-y-auto">
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
                    className={`flex-1 px-4 py-2 border-2 ${
                      getFieldError('phone') ? 'border-red-500' : 'border-[#BBA473]'
                    } border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                  />
                </div>
                {getFieldError('phone') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
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
                  placeholder="john.doe@example.com"
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

              {/* Nationality */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <select
                  name="nationality"
                  value={formik.values.nationality}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('nationality') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                >
                  <option value="">Select Nationality</option>
                  {nationalities.map((nationality) => (
                    <option key={nationality} value={nationality}>
                      {nationality}
                    </option>
                  ))}
                </select>
                {getFieldError('nationality') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.nationality}</div>
                )}
              </div>

              {/* Residency */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Country of Residency <span className="text-red-500">*</span>
                </label>
                <select
                  name="residency"
                  value={formik.values.residency}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('residency') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                >
                  <option value="">Select Residency</option>
                  {residencies.map((residency) => (
                    <option key={residency} value={residency}>
                      {residency}
                    </option>
                  ))}
                </select>
                {getFieldError('residency') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.residency}</div>
                )}
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Preferred Language <span className="text-red-500">*</span>
                </label>
                <select
                  name="language"
                  value={formik.values.language}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('language') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                >
                  <option value="">Select Language</option>
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                {getFieldError('language') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.language}</div>
                )}
              </div>

              {/* Source */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Lead Source <span className="text-red-500">*</span>
                </label>
                <select
                  name="source"
                  value={formik.values.source}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('source') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                >
                  <option value="">Select Source</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                {getFieldError('source') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.source}</div>
                )}
              </div>

              {/* Remarks */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-gray-400 block">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  placeholder="Add any additional notes or comments about this lead..."
                  rows="4"
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('remarks') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white resize-none`}
                />
                <div className="flex justify-between items-center">
                  <div>
                    {getFieldError('remarks') && (
                      <div className="text-red-500 text-xs">{formik.errors.remarks}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formik.values.remarks.length}/500
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="flex-1 px-4 py-3 rounded-md font-semibold transition-colors duration-200 ease-in-out bg-gradient-to-r from-[#8E7D5A] to-[#685A3D] text-white hover:from-[#a69363] hover:to-[#7a6749] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? 'Creating Lead...' : 'Create Lead'}
              </button>
              <button
                type="button"
                onClick={() => formik.resetForm()}
                className="px-4 py-3 rounded-md font-semibold transition-colors duration-200 ease-in-out bg-gray-700 text-white hover:bg-gray-600 sm:w-auto"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateLeadForm;