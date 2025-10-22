import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router
import EnterEmail from '../../components/login/EnterEmail';
import EnterPassword from '../../components/login/EnterPassword';
import EnterOTP from '../../components/login/EnterOTP';
import ForgetPassword from '../../components/login/ForgetPassword';

const Login = () => {
  const navigate = useNavigate(); // If using React Router
  const [email, setEmail] = useState('Salesops@saveingold.ae');
  const [currentStep, setCurrentStep] = useState('email'); // email, password, otp, forgotPassword
  const [userData, setUserData] = useState(null);

  // Handle successful login
  const handleLoginSuccess = (data) => {
    console.log('Login successful, user data:', data);
    setUserData(data);
    
    // Store user data if needed
    // You can also redirect to dashboard or home page
    // navigate('/dashboard'); // Uncomment if using React Router
    
    // Or show a success message
    alert('Login successful!');
  };

  // Navigate to next screen
  const handleNext = (step, data = {}) => {
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
            onNext={(email) => handleNext('password', { email })}
          />
        );
      
      case 'password':
        return (
          <EnterPassword
            email={email}
            setCurrentStep={setCurrentStep}
            onNext={(data) => {
              // After successful login, you can navigate to dashboard
              // or show success message
              handleLoginSuccess(data);
            }}
            onLoginSuccess={handleLoginSuccess}
            onBack={() => handleBack('email')}
            onForgotPassword={() => handleNext('forgotPassword')}
          />
        );
      
      case 'otp':
        return (
          <EnterOTP
            setCurrentStep={setCurrentStep}
            onNext={(otp) => {
              // Handle OTP verification if needed
              setUserData((prev) => ({ ...prev, otp }));
            }}
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
            onNext={(email) => handleNext('password', { email })} 
          />
        );
    }
  };

  return <>{renderScreen()}</>;
};

export default Login;