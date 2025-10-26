import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupAxiosInterceptor } from '../../services/authService'; // Update path as needed
import EnterEmail from '../../components/login/EnterEmail';
import EnterPassword from '../../components/login/EnterPassword';
import EnterOTP from '../../components/login/EnterOTP';
import ForgetPassword from '../../components/login/ForgetPassword';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('Salesops@saveingold.ae');
  const [currentStep, setCurrentStep] = useState('email'); // email, password, otp, forgotPassword
  const [userData, setUserData] = useState(null);

  // Setup axios interceptor on component mount
  useEffect(() => {
    setupAxiosInterceptor();
  }, []);

  // Handle successful login (after password verification)
  const handleLoginSuccess = (data) => {
    console.log('Login successful, user data:', data);
    setUserData(data);
    
    // After successful login, move to OTP verification
    // The refresh token API has already been called automatically after login
    // setCurrentStep('otp');
    navigate('/dashboard');
  };

  // Handle successful OTP verification
  const handleOTPVerifySuccess = (data) => {
    console.log('OTP verified successfully:', data);
    
    // Navigate to dashboard after successful OTP verification
    navigate('/dashboard');
    
    // Or show a success message
    // alert('Verification successful! Welcome back.');
  };

  // Navigate to next screen
  const handleNext = (step, data = {}) => {
    if (data.email) {
      setEmail(data.email);
    }
    setCurrentStep(step);
  };

  // Navigate to previous screen
  const handleBack = (step) => {
    setCurrentStep(step);
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentStep) {
      case 'email':
        return (
          <EnterEmail
            setEmail={setEmail}
            onNext={() => handleNext('password')}
          />
        );
      
      case 'password':
        return (
          <EnterPassword
            email={email}
            setCurrentStep={setCurrentStep}
            onNext={handleLoginSuccess}
            onLoginSuccess={handleLoginSuccess}
            onBack={() => handleBack('email')}
            onForgotPassword={() => handleNext('forgotPassword')}
          />
        );
      
      case 'otp':
        return (
          <EnterOTP
            email={email}
            setCurrentStep={setCurrentStep}
            onVerifySuccess={handleOTPVerifySuccess}
            onBack={() => handleBack('password')}
          />
        );
      
      case 'forgotPassword':
        return (
          <ForgetPassword
            setCurrentStep={setCurrentStep}
            onNext={() => handleNext('otp')}
            onBack={() => handleBack('password')}
          />
        );
      
      default:
        return (
          <EnterEmail 
            setEmail={setEmail}
            setCurrentStep={setCurrentStep} 
            onNext={() => handleNext('password')} 
          />
        );
    }
  };

  return <>{renderScreen()}</>;
};

export default Login;