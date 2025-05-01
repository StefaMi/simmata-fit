
import React from "react";
import Layout from "@/components/Layout";
import PasswordResetForm from "@/components/auth/PasswordResetForm";

const ResetPasswordPage = () => {
  return (
    <Layout hideNav>
      <div className="container max-w-md py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Simmata Fit</h1>
        <PasswordResetForm />
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;
