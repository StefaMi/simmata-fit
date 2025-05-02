
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import EmailVerification from "./EmailVerification";
import SocialLoginButtons from "./SocialLoginButtons";
import AuthErrorAlert from "./AuthErrorAlert";
import SupabaseNotConfiguredAlert from "./SupabaseNotConfiguredAlert";

type AuthFormProps = {
  onSuccess?: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isSupabaseReady } = useAuth();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage(null);
  };

  const handleRegistrationSuccess = (email: string) => {
    setEmailSent(email);
  };

  const handleBackToLogin = () => {
    setEmailSent(null);
    setIsLogin(true);
  };

  // If verification email has been sent, show verification instructions
  if (emailSent) {
    return <EmailVerification email={emailSent} onBackToLogin={handleBackToLogin} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      {!isSupabaseReady && (
        <CardHeader className="pb-0">
          <SupabaseNotConfiguredAlert />
        </CardHeader>
      )}
      
      {errorMessage && (
        <CardHeader className="pb-0">
          <AuthErrorAlert message={errorMessage} />
        </CardHeader>
      )}
      
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isLogin ? "Anmelden" : "Registrieren"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin 
            ? "Melden Sie sich mit Ihrem Account an" 
            : "Erstellen Sie einen neuen Account"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLogin ? (
          <LoginForm 
            onSuccess={onSuccess} 
            onToggleForm={toggleForm} 
          />
        ) : (
          <RegisterForm 
            onSuccess={handleRegistrationSuccess} 
            onToggleForm={toggleForm} 
          />
        )}
        
        <SocialLoginButtons 
          isLoading={isLoading} 
          isSupabaseReady={isSupabaseReady} 
        />
      </CardContent>
    </Card>
  );
};

export default AuthForm;
