
import React, { useState } from "react";
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

const registerSchema = z.object({
  email: z.string().email({ message: "Ungültige Email-Adresse." }),
  password: z.string().min(6, { message: "Passwort muss mindestens 6 Zeichen haben." }),
  confirmPassword: z.string().min(6, { message: "Passwort muss mindestens 6 Zeichen haben." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterFormProps = {
  onSuccess: (email: string) => void;
  onToggleForm: () => void;
};

const RegisterForm = ({ onSuccess, onToggleForm }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { register, isSupabaseReady } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: RegisterFormValues) => {
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
      onSuccess(data.email);
      
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
          <FormField
            control={form.control}
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
      <div className="mt-4">
        <Button 
          variant="link" 
          className="w-full" 
          onClick={onToggleForm}
          disabled={isLoading || !isSupabaseReady}
        >
          Bereits registriert? Anmelden
        </Button>
      </div>
    </>
  );
};

export default RegisterForm;
