
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabaseClient } from "@/lib/supabase";

const VerifyEmailPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Check if user is already signed in after email confirmation
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (session?.user) {
          // User is signed in and email is confirmed
          setVerificationStatus("success");
          toast({
            title: "E-Mail verifiziert",
            description: "Ihre E-Mail wurde erfolgreich bestätigt.",
          });
          
          // Wait a moment before redirecting
          setTimeout(() => {
            navigate("/profile");
          }, 2000);
        } else {
          // User is not signed in yet, or email is not confirmed
          setVerificationStatus("pending");
        }
      } catch (error) {
        console.error("Verification check error:", error);
        setVerificationStatus("error");
        toast({
          title: "Verifizierung fehlgeschlagen",
          description: "Bitte versuchen Sie es erneut oder fordern Sie einen neuen Verifizierungslink an.",
          variant: "destructive",
        });
      }
    };

    handleEmailConfirmation();
  }, [toast, navigate]);

  return (
    <Layout hideNav>
      <div className="container max-w-md py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Simmata Fit</h1>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              E-Mail Verifizierung
            </CardTitle>
            <CardDescription className="text-center">
              {verificationStatus === "pending" && "Ihre E-Mail wird verifiziert..."}
              {verificationStatus === "success" && "Ihre E-Mail wurde erfolgreich verifiziert!"}
              {verificationStatus === "error" && "Verifizierung fehlgeschlagen"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {verificationStatus === "pending" && (
              <p>Bitte warten Sie einen Moment, während wir Ihre E-Mail verifizieren.</p>
            )}
            {verificationStatus === "success" && (
              <p>Sie werden automatisch zur Profilseite weitergeleitet.</p>
            )}
            {verificationStatus === "error" && (
              <p>Der Verifizierungslink ist ungültig oder abgelaufen. Bitte versuchen Sie es erneut.</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {verificationStatus !== "pending" && (
              <Button onClick={() => navigate("/login")}>
                Zur Anmeldeseite
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyEmailPage;
