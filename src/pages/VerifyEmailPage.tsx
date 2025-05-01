
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setVerificationStatus("error");
        toast({
          title: "Verifizierung fehlgeschlagen",
          description: "Kein Verifizierungstoken gefunden.",
          variant: "destructive",
        });
        return;
      }

      setIsVerifying(true);
      try {
        // In a real implementation, this would verify the token with Supabase
        await verifyEmail(token);
        setVerificationStatus("success");
        toast({
          title: "E-Mail verifiziert",
          description: "Ihre E-Mail wurde erfolgreich bestätigt.",
        });
        
        // Wait a moment before redirecting
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
        toast({
          title: "Verifizierung fehlgeschlagen",
          description: "Bitte versuchen Sie es erneut oder fordern Sie einen neuen Verifizierungslink an.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, verifyEmail, toast, navigate]);

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
