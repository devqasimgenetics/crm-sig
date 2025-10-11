
import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const OTPSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .matches(/^[0-9]+$/, 'OTP must contain only numbers')
    .required('OTP is required'),
});

export default function OTPForm() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: OTPSchema,
    onSubmit: (values) => {
      console.log('OTP submitted:', values);
      alert('OTP verified successfully!');
    },
  });

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Update formik value
    const otpString = newOtp.join('');
    formik.setFieldValue('otp', otpString);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1].focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        formik.setFieldValue('otp', newOtp.join(''));
      }
    }
    // Handle left arrow
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    // Handle right arrow
    else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    // Only allow numbers
    if (!/^[0-9]+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    // Fill remaining slots with empty strings
    while (newOtp.length < 6) {
      newOtp.push('');
    }
    
    setOtp(newOtp);
    formik.setFieldValue('otp', pastedData);
    
    // Focus on the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex].focus();
    } else {
      inputRefs.current[5].focus();
    }
  };

  const handleResend = () => {
    if (canResend) {
      console.log('Resending OTP...');
      setResendTimer(60);
      setCanResend(false);
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      formik.setFieldValue('otp', '');
      inputRefs.current[0].focus();
    }
  };

  const isButtonDisabled = otp.join('').length !== 6 || !formik.isValid;

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
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Enter verification code
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-600 text-lg mb-8">
          We've sent a 6-digit code to your email
        </p>

        {/* Form */}
        <div className="space-y-6">
          {/* OTP Input Fields */}
          <div>
            <label className="block text-gray-700 font-medium text-lg mb-4">
              Verification Code
            </label>
            <div className="flex gap-3 justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl font-semibold border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
            {formik.touched.otp && formik.errors.otp && (
              <div className="text-red-500 text-sm mt-3">
                {formik.errors.otp}
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
            Verify
          </button>

          {/* Resend Code */}
          <div className="text-center">
            {!canResend ? (
              <p className="text-gray-600 text-lg">
                Resend code in <span className="font-semibold text-blue-600">{resendTimer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors"
              >
                Resend Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}