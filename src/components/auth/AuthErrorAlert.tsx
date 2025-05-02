
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AuthErrorAlertProps = {
  message: string | null;
};

const AuthErrorAlert = ({ message }: AuthErrorAlertProps) => {
  if (!message) return null;
  
  return (
    <Alert variant="destructive">
      <AlertTitle>Fehler</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default AuthErrorAlert;
