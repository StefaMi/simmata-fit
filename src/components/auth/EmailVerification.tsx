
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

type EmailVerificationProps = {
  email: string;
  onBackToLogin: () => void;
};

const EmailVerification = ({ email, onBackToLogin }: EmailVerificationProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          E-Mail Verifizierung
        </CardTitle>
        <CardDescription className="text-center">
          Wir haben eine Bestätigungs-E-Mail an {email} gesendet
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4">Bitte überprüfen Sie Ihren Posteingang und klicken Sie auf den Bestätigungslink, um Ihre E-Mail-Adresse zu verifizieren.</p>
        <p className="text-sm text-muted-foreground">Wenn Sie keine E-Mail erhalten haben, überprüfen Sie bitte Ihren Spam-Ordner.</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="link" 
          onClick={onBackToLogin}
        >
          Zurück zur Anmeldung
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailVerification;
