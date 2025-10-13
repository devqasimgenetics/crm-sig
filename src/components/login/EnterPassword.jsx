import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Edit2 } from 'lucide-react';

const LoginSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export default function LoginForm({ onNext, setCurrentStep }) {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: 'Salesops@saveingold.ae',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      onNext()
    },
  });

  const isButtonDisabled = !formik.isValid || formik.values.password.length < 8;

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex items-center gap-1">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-[#BBA473] rounded"></div>
              <div className="absolute bottom-0 left-0 w-5 h-5 bg-[#1A1A1A] rounded-tl-lg"></div>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-light text-white">Save In GOLD</span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-white mb-8">
          Glad to see you!
        </h1>

        {/* Form */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <div
              onClick={() => setCurrentStep('email')}
              className="flex items-center gap-2 text-[#E8D5A3] text-lg mb-6 cursor-pointer hover:text-[#BBA473] hover:underline transition-colors"
            >
              <span>{formik.values.email}</span>
              <button
                type="button"
                className="text-gray-400 hover:text-[#BBA473] transition-colors decoration-0"
                aria-label="Edit email"
              >
                <Edit2 size={18} />
              </button>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-[#E8D5A3] font-medium text-lg mb-3">
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
                className="w-full px-4 py-4 pr-12 border-2 border-[#BBA473] bg-[#2e2e2e] text-white rounded-lg focus:outline-none focus:border-[#d4bc89] focus:ring-2 focus:ring-[#BBA473]/50 text-lg transition-colors placeholder-gray-500"
                placeholder="••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#BBA473] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-400 text-sm mt-2">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={formik.handleSubmit}
            disabled={isButtonDisabled}
            className="w-full bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] text-black font-semibold text-lg py-4 rounded-lg hover:from-[#d4bc89] hover:to-[#a69363] disabled:from-[#6b6354] disabled:to-[#5a5447] disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            Continue
          </button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <p
              onClick={() => setCurrentStep('forgotPassword')}
              className="text-[#BBA473] hover:text-[#d4bc89] font-medium text-lg transition-colors cursor-pointer"
            >
              Forgot Password?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}