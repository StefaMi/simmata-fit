
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabaseClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const VerifyEmailPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log("Starting email verification process");
        console.log("Current URL:", window.location.href);
        console.log("Search params:", location.search);
        
        // Check if there's an error description in the URL
        const params = new URLSearchParams(location.search);
        if (params.get("error_description")) {
          const errorMsg = params.get("error_description");
          console.error("Verification error from URL:", errorMsg);
          setVerificationStatus("error");
          setErrorMessage(errorMsg || "Der Verifizierungslink ist ungültig oder abgelaufen.");
          
          toast({
            title: "Verifizierung fehlgeschlagen",
            description: errorMsg || "Der Verifizierungslink ist ungültig oder abgelaufen.",
            variant: "destructive",
          });
          return;
        }
        
        // Check authentication status
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (session?.user) {
          // User is authenticated and email is confirmed
          console.log("User authenticated successfully:", session.user);
          setVerificationStatus("success");
          
          toast({
            title: "E-Mail verifiziert",
            description: "Deine E-Mail wurde erfolgreich bestätigt.",
          });
          
          // Redirect to profile page after short delay
          setTimeout(() => {
            navigate("/profile", { replace: true });
          }, 2000);
        } else {
          // No active session - check if token is in the URL
          const token = params.get("token_hash") || params.get("token");
          
          if (token) {
            console.log("Token found in URL:", token);
            
            // For Supabase, verification is automatic when clicking the link
            // We just need to inform the user that the process is complete
            setVerificationStatus("success");
            
            toast({
              title: "E-Mail-Prüfung abgeschlossen",
              description: "Bitte melde dich jetzt an, um fortzufahren.",
            });
            
            // Redirect to login page after short delay
            setTimeout(() => {
              navigate("/login", { replace: true });
            }, 3000);
          } else {
            // No session and no token - just show verification instructions
            console.log("No token found in URL and user not authenticated");
            setVerificationStatus("error");
            setErrorMessage("Kein Bestätigungstoken gefunden. Bitte klicke auf den Link in deiner E-Mail.");
          }
        }
      } catch (error) {
        console.error("Verification check error:", error);
        setVerificationStatus("error");
        setErrorMessage("Bei der Verifizierung ist ein Fehler aufgetreten. Bitte versuche es erneut.");
        
        toast({
          title: "Verifizierung fehlgeschlagen",
          description: "Bitte versuche es erneut oder fordere einen neuen Verifizierungslink an.",
          variant: "destructive",
        });
      }
    };

    handleEmailConfirmation();
  }, [toast, navigate, location]);

  return (
    <Layout hideNav>
      <div className="container max-w-md py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Rush</h1>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              E-Mail Verifizierung
            </CardTitle>
            <CardDescription className="text-center">
              {verificationStatus === "pending" && "Deine E-Mail wird verifiziert..."}
              {verificationStatus === "success" && "Deine E-Mail wurde erfolgreich verifiziert!"}
              {verificationStatus === "error" && "Verifizierung fehlgeschlagen"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {verificationStatus === "pending" && (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-fitness-primary mb-4" />
                <p>Bitte warte einen Moment, während wir deine E-Mail verifizieren.</p>
              </div>
            )}
            {verificationStatus === "success" && (
              <p>Du wirst automatisch {!supabaseClient.auth.getSession ? "zur Anmeldeseite" : "zur Profilseite"} weitergeleitet.</p>
            )}
            {verificationStatus === "error" && (
              <p className="text-red-500">{errorMessage || "Der Verifizierungslink ist ungültig oder abgelaufen. Bitte versuche es erneut."}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center gap-4 flex-wrap">
            {verificationStatus !== "pending" && (
              <Button onClick={() => navigate("/login")}>
                Zur Anmeldeseite
              </Button>
            )}
            {verificationStatus === "error" && (
              <Button variant="outline" onClick={() => navigate("/")}>
                Zur Startseite
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyEmailPage;
