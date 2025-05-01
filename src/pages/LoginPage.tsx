
import React from "react";
import Layout from "@/components/Layout";
import AuthForm from "@/components/auth/AuthForm";

const LoginPage = () => {
  return (
    <Layout hideNav>
      <div className="container max-w-md py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Simmata Fit</h1>
        <AuthForm />
      </div>
    </Layout>
  );
};

export default LoginPage;
