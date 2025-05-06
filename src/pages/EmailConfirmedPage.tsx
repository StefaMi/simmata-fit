
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";

const EmailConfirmedPage = () => {
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    // Clear any existing timer first
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    // Set a new timer
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null; // Clear the reference
      if (isMounted.current) {
        navigate("/login");
      }
    }, 5000);

    // Clean up function
    return () => {
      isMounted.current = false;
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [navigate]);

  const handleLoginClick = () => {
    // Clear the timer when manually navigating
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    navigate("/login");
  };

  return (
    <Layout hideNav>
      <div className="container max-w-md py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Rush</h1>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 p-2 dark:bg-green-900/20">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">
              E-Mail erfolgreich bestätigt ✅
            </CardTitle>
            <CardDescription>
              Du kannst dich jetzt einloggen und mit dem Training starten.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Du wirst automatisch in 5 Sekunden zur Anmeldeseite weitergeleitet.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleLoginClick}>
              Zum Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default EmailConfirmedPage;
