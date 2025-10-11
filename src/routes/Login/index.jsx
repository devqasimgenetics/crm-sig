import React, { useState } from 'react';
import EnterEmail from '../../components/login/EnterEmail';
import EnterPassword from '../../components/login/EnterPassword';
import EnterOTP from '../../components/login/EnterOTP';
import ForgetPassword from '../../components/login/ForgetPassword';

const Login = () => {
  const [currentStep, setCurrentStep] = useState('email'); // email, password, otp, forgotPassword

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
            onNext={(email) => handleNext('password', { email })}
          />
        );
      
      case 'password':
        return (
          <EnterPassword
            setCurrentStep={setCurrentStep}
            onNext={(password) => handleNext('otp', { password })}
            onBack={() => handleBack('email')}
            onForgotPassword={() => handleNext('forgotPassword')}
          />
        );
      
      case 'otp':
        return (
          <EnterOTP
            setCurrentStep={setCurrentStep}
            onNext={(otp) => {
              // setUserData((prev) => ({ ...prev, otp }));
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
        return <EnterEmail setCurrentStep={setCurrentStep} onNext={(email) => handleNext('password', { email })} />;
    }
  };

  return <>{renderScreen()}</>;
};

export default Login;