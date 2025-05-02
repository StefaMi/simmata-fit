
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Eye, EyeOff } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email({ message: "Ungültige Email-Adresse." }),
  password: z.string().min(6, { message: "Passwort muss mindestens 6 Zeichen haben." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSuccess?: () => void;
  onToggleForm: () => void;
};

const LoginForm = ({ onSuccess, onToggleForm }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isSupabaseReady } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormValues) => {
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

  const handleResetPassword = () => {
    navigate("/reset-password");
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
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
            control={form.control}
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
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isSupabaseReady}
          >
            <Mail className="mr-2 h-4 w-4" />
            Anmelden
          </Button>
        </form>
      </Form>
      <div className="mt-4">
        <Button 
          variant="link" 
          className="w-full" 
          onClick={onToggleForm}
          disabled={isLoading || !isSupabaseReady}
        >
          Noch kein Konto? Registrieren
        </Button>
      </div>
    </>
  );
};

export default LoginForm;
