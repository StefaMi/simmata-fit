
import React from "react";
import { Apple, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type SocialLoginButtonsProps = {
  isLoading: boolean;
  isSupabaseReady: boolean;
};

const SocialLoginButtons = ({ isLoading, isSupabaseReady }: SocialLoginButtonsProps) => {
  const { toast } = useToast();
  
  return (
    <>
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
    </>
  );
};

export default SocialLoginButtons;
