
import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "lucide-react";

const LoginPage = () => {
  const { user, isLoading, isSupabaseReady } = useAuth();
  
  // Wenn Supabase nicht konfiguriert ist, zeigen wir trotzdem das Login-Formular an
  if (isLoading && isSupabaseReady) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Einen Moment bitte...</p>
      </div>
    );
  }
  
  // Redirect to workout page if the user is already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout hideNav>
      <div className="container max-w-md py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Rush</h1>
        <AuthForm />
      </div>
    </Layout>
  );
};

export default LoginPage;
