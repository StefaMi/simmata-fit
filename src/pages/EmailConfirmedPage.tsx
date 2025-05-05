
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";

const EmailConfirmedPage = () => {
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Using a ref to store the timer ID ensures we can clean it up properly
    timerRef.current = window.setTimeout(() => {
      navigate("/login");
    }, 5000);

    // Clean up function that uses the ref
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [navigate]);

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
            <Button onClick={() => navigate("/login")}>
              Zum Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default EmailConfirmedPage;
