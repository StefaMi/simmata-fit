
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabaseClient } from "@/lib/supabase";

const VerifyEmailPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Überprüfe, ob ein Bestätigungstoken in der URL vorhanden ist
        const params = new URLSearchParams(location.search);
        if (params.get("error_description")) {
          const errorMsg = params.get("error_description");
          console.error("Verification error:", errorMsg);
          setVerificationStatus("error");
          toast({
            title: "Verifizierung fehlgeschlagen",
            description: errorMsg || "Der Verifizierungslink ist ungültig oder abgelaufen.",
            variant: "destructive",
          });
          return;
        }
        
        // Überprüfe den Authentifizierungsstatus
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (session?.user) {
          // Benutzer ist angemeldet und E-Mail ist bestätigt
          console.log("User is authenticated:", session.user);
          setVerificationStatus("success");
          toast({
            title: "E-Mail verifiziert",
            description: "Deine E-Mail wurde erfolgreich bestätigt.",
          });
          
          // Nach kurzer Zeit zur Profilseite weiterleiten
          setTimeout(() => {
            navigate("/profile");
          }, 2000);
        } else {
          // Kein aktiver Session - überprüfe, ob ein Token in der URL ist
          const token = params.get("token_hash") || params.get("token");
          
          if (token) {
            console.log("Token found in URL, attempting verification...");
            setVerificationStatus("pending");
            
            // In der neuesten Version von Supabase wird die Bestätigung automatisch verarbeitet
            // Wir müssen nur auf den Abschluss des Prozesses warten
            setTimeout(() => {
              navigate("/login", { replace: true });
            }, 3000);
          } else {
            // Keine Session und kein Token - zeige Hilfeinformationen an
            setVerificationStatus("error");
          }
        }
      } catch (error) {
        console.error("Verification check error:", error);
        setVerificationStatus("error");
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
              <p>Bitte warte einen Moment, während wir deine E-Mail verifizieren.</p>
            )}
            {verificationStatus === "success" && (
              <p>Du wirst automatisch zur Profilseite weitergeleitet.</p>
            )}
            {verificationStatus === "error" && (
              <p>Der Verifizierungslink ist ungültig oder abgelaufen. Bitte versuche es erneut.</p>
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
