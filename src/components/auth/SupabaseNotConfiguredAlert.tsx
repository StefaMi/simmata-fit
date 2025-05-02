
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SupabaseNotConfiguredAlert = () => {
  return (
    <Alert variant="destructive">
      <AlertTitle>Supabase nicht konfiguriert</AlertTitle>
      <AlertDescription>
        Die Authentifizierungsfunktionen sind nicht verfügbar, da Supabase nicht konfiguriert ist. 
        Bitte stellen Sie sicher, dass die VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY Umgebungsvariablen gesetzt sind.
      </AlertDescription>
    </Alert>
  );
};

export default SupabaseNotConfiguredAlert;
