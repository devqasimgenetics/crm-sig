import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Edit2 } from 'lucide-react';

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: 'Salesops@saveingold.ae',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      alert('Login successful!');
    },
  });

  const isButtonDisabled = !formik.isValid || formik.values.password.length < 8;

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
              <span className="text-3xl font-light text-gray-800">lead</span>
              <span className="text-3xl font-light text-blue-500">squared</span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Glad to see you!
        </h1>

        {/* Form */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <div className="flex items-center gap-2 text-gray-700 text-lg mb-6">
              <span>{formik.values.email}</span>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Edit email"
              >
                <Edit2 size={18} />
              </button>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium text-lg mb-3">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-4 pr-12 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600 text-lg transition-colors"
                placeholder="••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-2">
                {formik.errors.password}
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
            Continue
          </button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors"
            >
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}