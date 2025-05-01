
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Apple, Facebook, Mail } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email({ message: "Ungültige Email-Adresse." }),
  password: z.string().min(6, { message: "Passwort muss mindestens 6 Zeichen haben." }),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register } = useAuth();

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
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      
      toast({
        title: "Erfolgreich angemeldet",
        description: "Willkommen zurück!",
      });
      
      if (onSuccess) onSuccess();
      navigate("/profile");
    } catch (error) {
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
    setIsLoading(true);
    try {
      // For now, we'll simulate sending a verification email
      // This would be handled by Supabase in a real implementation
      
      // Mock registration - this would be replaced by actual Supabase registration
      await register(data.email, data.password);
      
      setEmailSent(data.email);
      
      toast({
        title: "Registrierung erfolgreich",
        description: "Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu verifizieren.",
      });
      
    } catch (error) {
      toast({
        title: "Fehler bei der Registrierung",
        description: "Bitte überprüfen Sie Ihre Eingaben.",
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

  const renderSocialButtons = () => (
    <div className="grid grid-cols-3 gap-2 mt-2">
      <Button 
        variant="outline" 
        className="w-full" 
        disabled={isLoading}
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
        disabled={isLoading}
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
        disabled={isLoading}
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
  );

  return (
    <Card className="w-full max-w-md mx-auto">
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
                        placeholder="name@beispiel.de" 
                        {...field} 
                        disabled={isLoading}
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
                      <Input 
                        type="password" 
                        placeholder="******" 
                        {...field} 
                        disabled={isLoading}
                      />
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
                disabled={isLoading}
              >
                Passwort vergessen?
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading}>
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
                        placeholder="name@beispiel.de" 
                        {...field} 
                        disabled={isLoading}
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
                      <Input 
                        type="password" 
                        placeholder="******" 
                        {...field} 
                        disabled={isLoading}
                      />
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
                      <Input 
                        type="password" 
                        placeholder="******" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
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
        
        {renderSocialButtons()}
      </CardContent>
      <CardFooter>
        <Button 
          variant="link" 
          className="w-full" 
          onClick={() => setIsLogin(!isLogin)}
          disabled={isLoading}
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
