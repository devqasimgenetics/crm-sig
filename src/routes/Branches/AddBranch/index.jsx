import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';

// Validation Schema
const roleValidationSchema = Yup.object({
  roleName: Yup.string()
    .required('Role name is required')
    .min(3, 'Role name must be at least 3 characters')
    .max(50, 'Role name must not exceed 50 characters'),
  department: Yup.string()
    .required('Department is required'),
});

// Features List with Permissions
const featuresList = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'View analytics and reports',
    icon: '📊',
  },
  {
    id: 'clients',
    name: 'Client Management',
    description: 'Manage client accounts',
    icon: '👥',
  },
  {
    id: 'roles',
    name: 'Role Management',
    description: 'Manage roles and permissions',
    icon: '🛡️',
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage system users',
    icon: '👤',
  },
  {
    id: 'transactions',
    name: 'Transactions',
    description: 'View and manage transactions',
    icon: '💰',
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Generate and view reports',
    icon: '📈',
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'System configuration',
    icon: '⚙️',
  },
  {
    id: 'audit',
    name: 'Audit Logs',
    description: 'View system audit logs',
    icon: '📋',
  },
];

// Initial Values
const getInitialValues = (existingRole) => {
  if (existingRole) {
    return {
      roleName: existingRole.roleName || '',
      department: existingRole.department || '',
      features: existingRole.features || {},
    };
  }
  
  // Initialize with all features disabled
  const features = {};
  featuresList.forEach(feature => {
    features[feature.id] = {
      enabled: false,
      read: false,
      write: false,
      update: false,
      delete: false,
    };
  });
  
  return {
    roleName: '',
    department: '',
    features: features,
  };
};

const AddEditRoleForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingRole = location.state?.role;
  const isEditMode = !!existingRole;

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
  const roles = ['Admin', 'Sales Manager', 'Agent', 'Kiosk Agent'];

  // useFormik hook
  const formik = useFormik({
    initialValues: getInitialValues(existingRole),
    validationSchema: roleValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log('Form submitted:', values);
      if (onSubmit) {
        onSubmit(values);
      }
      // Show success message
      alert(isEditMode ? 'Role updated successfully!' : 'Role created successfully!');
      setSubmitting(false);
      navigate('/roles');
    },
  });

  // Helper function to get field error
  const getFieldError = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName];
  };

  // Handle feature toggle
  const handleFeatureToggle = (featureId) => {
    const currentEnabled = formik.values.features[featureId].enabled;
    formik.setFieldValue(`features.${featureId}.enabled`, !currentEnabled);
    
    // If disabling, also disable all permissions
    if (currentEnabled) {
      formik.setFieldValue(`features.${featureId}.read`, false);
      formik.setFieldValue(`features.${featureId}.write`, false);
      formik.setFieldValue(`features.${featureId}.update`, false);
      formik.setFieldValue(`features.${featureId}.delete`, false);
    }
  };

  // Handle permission toggle
  const handlePermissionToggle = (featureId, permission) => {
    const currentValue = formik.values.features[featureId][permission];
    formik.setFieldValue(`features.${featureId}.${permission}`, !currentValue);
  };

  // Select all permissions for a feature
  const handleSelectAll = (featureId) => {
    formik.setFieldValue(`features.${featureId}.read`, true);
    formik.setFieldValue(`features.${featureId}.write`, true);
    formik.setFieldValue(`features.${featureId}.update`, true);
    formik.setFieldValue(`features.${featureId}.delete`, true);
  };

  // Clear all permissions for a feature
  const handleClearAll = (featureId) => {
    formik.setFieldValue(`features.${featureId}.read`, false);
    formik.setFieldValue(`features.${featureId}.write`, false);
    formik.setFieldValue(`features.${featureId}.update`, false);
    formik.setFieldValue(`features.${featureId}.delete`, false);
  };

  return (
    <main className="relative p-1 overflow-x-hidden min-h-screen bg-black">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-4 sm:py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/roles")}
          className="flex items-center space-x-2 text-white hover:text-gray-300 hover:underline transition mb-4 cursor-pointer"
          type="button"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Page Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#BBA473] flex items-center justify-center">
            <Shield className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {isEditMode ? 'Edit Role' : 'Create New Role'}
          </h1>
        </div>

        {/* Form Container */}
        <div className="bg-[#1e1e1e] border border-[#BBA473] rounded-lg p-4 sm:p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6" autoComplete="off">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role Name */}
              {/* <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="roleName"
                  placeholder="e.g., Sales Manager"
                  value={formik.values.roleName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('roleName') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                />
                {getFieldError('roleName') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.roleName}</div>
                )}
              </div> */}

              {/* Role Name */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="roleName"
                  value={formik.values.roleName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border ${
                    getFieldError('roleName') ? 'border-red-500' : 'border-gray-600'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBA473] focus:border-transparent bg-[#2e2e2e] text-white`}
                >
                  <option value="">Select Role Name</option>
                  {roles.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {getFieldError('department') && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.department}</div>
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
            </div>

            {/* Features & Permissions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#BBA473]/30 pb-2">
                <Shield className="w-5 h-5 text-[#BBA473]" />
                <h3 className="text-lg font-semibold text-white">Features & Permissions</h3>
              </div>

              <p className="text-sm text-gray-400">
                Enable features and set permissions (Read, Write, Update, Delete) for this role.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuresList.map((feature) => (
                  <div
                    key={feature.id}
                    className={`border rounded-lg transition-all ${
                      formik.values.features[feature.id]?.enabled
                        ? 'border-[#BBA473] bg-[#2e2e2e] shadow-lg'
                        : 'border-gray-600 bg-[#252525] hover:border-gray-500'
                    }`}
                  >
                    {/* Feature Card */}
                    <div className="p-4">
                      {/* Feature Header */}
                      <div className="flex items-start gap-3 mb-3">
                        {/* Feature Checkbox */}
                        <input
                          type="checkbox"
                          checked={formik.values.features[feature.id]?.enabled || false}
                          onChange={() => handleFeatureToggle(feature.id)}
                          className="mt-1 h-5 w-5 accent-[#BBA473] border-gray-600 rounded focus:ring-[#BBA473] focus:outline-none cursor-pointer flex-shrink-0"
                        />
                        
                        {/* Feature Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{feature.icon}</span>
                            <h4 className="text-white font-semibold text-sm truncate">
                              {feature.name}
                            </h4>
                            {formik.values.features[feature.id]?.enabled && (
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2">{feature.description}</p>
                        </div>
                      </div>

                      {/* Permissions Section */}
                      {formik.values.features[feature.id]?.enabled && (
                        <div className="space-y-3 pt-3 border-t border-gray-600">
                          {/* Quick Actions */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSelectAll(feature.id)}
                              className="flex-1 text-xs px-2 py-1.5 bg-[#BBA473] text-black rounded hover:bg-[#d4bc89] transition-colors font-medium"
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={() => handleClearAll(feature.id)}
                              className="flex-1 text-xs px-2 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors font-medium"
                            >
                              Clear All
                            </button>
                          </div>

                          {/* Permissions Grid */}
                          <div className="grid grid-cols-2 gap-2">
                            {/* Read */}
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[#3e3e3e] transition-colors">
                              <input
                                type="checkbox"
                                checked={formik.values.features[feature.id]?.read || false}
                                onChange={() => handlePermissionToggle(feature.id, 'read')}
                                className="h-4 w-4 accent-[#BBA473] border-gray-600 rounded focus:ring-[#BBA473] focus:outline-none cursor-pointer"
                              />
                              <span className="text-xs text-gray-300 font-medium">Read</span>
                            </label>

                            {/* Write */}
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[#3e3e3e] transition-colors">
                              <input
                                type="checkbox"
                                checked={formik.values.features[feature.id]?.write || false}
                                onChange={() => handlePermissionToggle(feature.id, 'write')}
                                className="h-4 w-4 accent-[#BBA473] border-gray-600 rounded focus:ring-[#BBA473] focus:outline-none cursor-pointer"
                              />
                              <span className="text-xs text-gray-300 font-medium">Write</span>
                            </label>

                            {/* Update */}
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[#3e3e3e] transition-colors">
                              <input
                                type="checkbox"
                                checked={formik.values.features[feature.id]?.update || false}
                                onChange={() => handlePermissionToggle(feature.id, 'update')}
                                className="h-4 w-4 accent-[#BBA473] border-gray-600 rounded focus:ring-[#BBA473] focus:outline-none cursor-pointer"
                              />
                              <span className="text-xs text-gray-300 font-medium">Update</span>
                            </label>

                            {/* Delete */}
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[#3e3e3e] transition-colors">
                              <input
                                type="checkbox"
                                checked={formik.values.features[feature.id]?.delete || false}
                                onChange={() => handlePermissionToggle(feature.id, 'delete')}
                                className="h-4 w-4 accent-[#BBA473] border-gray-600 rounded focus:ring-[#BBA473] focus:outline-none cursor-pointer"
                              />
                              <span className="text-xs text-gray-300 font-medium">Delete</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="bg-[#2e2e2e] border border-[#BBA473]/30 rounded-lg p-4 mt-6">
                <h4 className="text-sm font-semibold text-white mb-3">Permission Summary</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Enabled Features:</span>
                    <span className="text-[#BBA473] font-semibold text-lg">
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
                            className="px-3 py-1 bg-[#BBA473]/20 text-[#BBA473] rounded-full text-xs font-medium flex items-center gap-1"
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
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/roles')}
                className="w-full sm:flex-1 px-4 py-3 rounded-md font-semibold bg-[#3A3A3A] text-white hover:bg-[#4A4A4A] transition-colors duration-200 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full sm:flex-1 px-4 py-3 rounded-md font-semibold transition-colors duration-200 ease-in-out bg-gradient-to-r from-[#8E7D5A] to-[#685A3D] text-white hover:from-[#a69363] hover:to-[#7a6749] disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              >
                {formik.isSubmitting 
                  ? (isEditMode ? 'Updating Role...' : 'Creating Role...') 
                  : (isEditMode ? 'Update Role' : 'Create Role')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddEditRoleForm;