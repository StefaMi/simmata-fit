import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Apple, Facebook, Mail, Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email({ message: "Ungültige Email-Adresse." }),
  password: z.string().min(6, { message: "Passwort muss mindestens 6 Zeichen haben." }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Ungültige Email-Adresse." }),
  password: z.string().min(6, { message: "Passwort muss mindestens 6 Zeichen haben." }),
  confirmPassword: z.string().min(6, { message: "Passwort muss mindestens 6 Zeichen haben." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

type AuthFormProps = {
  onSuccess?: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register, isSupabaseReady } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLoginSubmit = async (data: LoginFormValues) => {
    if (!isSupabaseReady) {
      toast({
        title: "Supabase nicht konfiguriert",
        description: "Bitte konfigurieren Sie Supabase für die Authentifizierung.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      await login(data.email, data.password);
      
      toast({
        title: "Erfolgreich angemeldet",
        description: "Willkommen zurück!",
      });
      
      if (onSuccess) onSuccess();
      navigate("/profile");
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error?.message || "Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.");
      toast({
        title: "Fehler bei der Anmeldung",
        description: "Bitte überprüfen Sie Ihre Eingaben.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormValues) => {
    if (!isSupabaseReady) {
      toast({
        title: "Supabase nicht konfiguriert",
        description: "Bitte konfigurieren Sie Supabase für die Authentifizierung.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Starting registration with:", data.email);
      const result = await register(data.email, data.password);
      console.log("Registration result:", result);
      
      // Since registration was successful, show success message
      setEmailSent(data.email);
      
      toast({
        title: "Registrierung erfolgreich",
        description: "Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu verifizieren.",
      });
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrorMessage(error?.message || "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
      toast({
        title: "Fehler bei der Registrierung",
        description: error?.message || "Bitte überprüfen Sie Ihre Eingaben.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    navigate("/reset-password");
  };

  // If verification email has been sent, show verification instructions
  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            E-Mail Verifizierung
          </CardTitle>
          <CardDescription className="text-center">
            Wir haben eine Bestätigungs-E-Mail an {emailSent} gesendet
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Bitte überprüfen Sie Ihren Posteingang und klicken Sie auf den Bestätigungslink, um Ihre E-Mail-Adresse zu verifizieren.</p>
          <p className="text-sm text-muted-foreground">Wenn Sie keine E-Mail erhalten haben, überprüfen Sie bitte Ihren Spam-Ordner.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={() => {
              setEmailSent(null);
              setIsLogin(true);
            }}
          >
            Zurück zur Anmeldung
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      {!isSupabaseReady && (
        <CardHeader className="pb-0">
          <Alert variant="destructive">
            <AlertTitle>Supabase nicht konfiguriert</AlertTitle>
            <AlertDescription>
              Die Authentifizierungsfunktionen sind nicht verfügbar, da Supabase nicht konfiguriert ist. 
              Bitte stellen Sie sicher, dass die VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY Umgebungsvariablen gesetzt sind.
            </AlertDescription>
          </Alert>
        </CardHeader>
      )}
      {errorMessage && (
        <CardHeader className="pb-0">
          <Alert variant="destructive">
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </CardHeader>
      )}
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isLogin ? "Anmelden" : "Registrieren"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin 
            ? "Melden Sie sich mit Ihrem Account an" 
            : "Erstellen Sie einen neuen Account"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLogin ? (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="name@beispiel.de" 
                        {...field} 
                        disabled={isLoading || !isSupabaseReady}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passwort</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="******" 
                          {...field} 
                          disabled={isLoading || !isSupabaseReady}
                          className="pr-10"
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? 
                            <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          }
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="link" 
                className="p-0 h-auto font-normal text-sm"
                onClick={handleResetPassword}
                disabled={isLoading || !isSupabaseReady}
              >
                Passwort vergessen?
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading || !isSupabaseReady}>
                <Mail className="mr-2 h-4 w-4" />
                Anmelden
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="name@beispiel.de" 
                        {...field} 
                        disabled={isLoading || !isSupabaseReady}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passwort</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="******" 
                          {...field} 
                          disabled={isLoading || !isSupabaseReady}
                          className="pr-10"
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? 
                            <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          }
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passwort bestätigen</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="******" 
                          {...field} 
                          disabled={isLoading || !isSupabaseReady}
                          className="pr-10"
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? 
                            <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          }
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !isSupabaseReady}
              >
                <Mail className="mr-2 h-4 w-4" />
                Registrieren
              </Button>
            </form>
          </Form>
        )}
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Oder mit
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Button 
            variant="outline" 
            className="w-full" 
            disabled={isLoading || !isSupabaseReady}
            onClick={() => {
              toast({
                description: "Apple-Anmeldung wird vorbereitet...",
              });
            }}
          >
            <Apple className="mr-2 h-4 w-4" />
            Apple
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            disabled={isLoading || !isSupabaseReady}
            onClick={() => {
              toast({
                description: "Facebook-Anmeldung wird vorbereitet...",
              });
            }}
          >
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            disabled={isLoading || !isSupabaseReady}
            onClick={() => {
              toast({
                description: "Mail-Anmeldung wird vorbereitet...",
              });
            }}
          >
            <Mail className="mr-2 h-4 w-4" />
            Mail
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="link" 
          className="w-full" 
          onClick={() => setIsLogin(!isLogin)}
          disabled={isLoading || !isSupabaseReady}
        >
          {isLogin 
            ? "Noch kein Konto? Registrieren" 
            : "Bereits registriert? Anmelden"
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
