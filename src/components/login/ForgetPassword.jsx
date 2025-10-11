
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail } from 'lucide-react';

const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

export default function LoginForm({ setCurrentStep }) {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: EmailSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
    },
  });

  const isButtonDisabled = !formik.isValid || !formik.values.email;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex items-center gap-1">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-blue-500 rounded"></div>
              <div className="absolute bottom-0 left-0 w-5 h-5 bg-white rounded-tl-lg"></div>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-light text-gray-800">Save In GOLD</span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Forgot Password
        </h1>
        <p className="text-lg font-normal text-gray-700 mb-8">
            A password reset link will be sent to your email
        </p>

        {/* Form */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium text-lg mb-3">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-4 pr-12 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600 text-lg transition-colors"
                placeholder="Enter your email"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={22} />
              </div>
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-2">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={formik.handleSubmit}
            disabled={isButtonDisabled}
            className="w-full bg-blue-600 text-white font-semibold text-lg py-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Send Link
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-gray-600 text-lg">Back to </span>
            <span
              onClick={() => setCurrentStep('email')}
              className="text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors cursor-pointer"
            >
            Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}