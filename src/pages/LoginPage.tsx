
import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const { user } = useAuth();
  
  // Redirect to profile if the user is already logged in
  if (user) {
    return <Navigate to="/profile" replace />;
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
