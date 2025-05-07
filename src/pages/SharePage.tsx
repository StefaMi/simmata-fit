
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Share2, Check, Copy, Mail, MessageSquare } from "lucide-react";

const SharePage = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [message, setMessage] = useState("Hey, ich benutze Rush für mein Fitnesstraining und dachte, es könnte dich auch interessieren! Schau es dir an!");

  const handleShare = (type: string) => {
    if (type === "email" && !emailAddress) {
      toast({
        title: "E-Mail-Adresse fehlt",
        description: "Bitte gib eine E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, these would interact with actual sharing APIs
    switch (type) {
      case "copy":
        navigator.clipboard.writeText(
          `Check out Rush, die beste Fitness-App! ${window.location.origin}`
        ).then(() => {
          toast({
            title: "Link kopiert!",
            description: "Der Link wurde in die Zwischenablage kopiert.",
          });
        });
        break;
      case "email":
        // This would normally open the default email client
        const emailSubject = "Entdecke Rush - Die ultimative Fitness-App";
        window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(message)}`;
        toast({
          title: "E-Mail vorbereitet",
          description: "Deine E-Mail-App sollte sich jetzt öffnen.",
        });
        break;
      case "sms":
        // This would normally open the default messaging app
        window.location.href = `sms:?&body=${encodeURIComponent(message + " " + window.location.origin)}`;
        toast({
          title: "SMS vorbereitet",
          description: "Deine Messaging-App sollte sich jetzt öffnen.",
        });
        break;
      default:
        toast({
          title: "Teilen",
          description: `Teilen über ${type} wäre hier implementiert.`,
        });
    }
  };

  return (
    <Layout hideNav={false} showHeader={true} title="Rush teilen">
      <div className="space-y-6">
        <Card className="backdrop-blur-md bg-background/80 border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Rush mit Freunden teilen
            </CardTitle>
            <CardDescription>
              Teile Rush mit deinen Freunden und motiviert euch gegenseitig.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center pb-4">
              <div className="inline-block p-6 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 mb-4">
                <Share2 className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold">Rush mit Freunden teilen</h2>
              <p className="text-muted-foreground mt-2">
                Trainiere gemeinsam mit Freunden und steigert eure Motivation!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="flex items-center justify-center gap-3" 
                variant="outline"
                onClick={() => handleShare("copy")}
              >
                <Copy className="h-4 w-4" />
                Link kopieren
              </Button>
              <Button 
                className="flex items-center justify-center gap-3" 
                variant="outline"
                onClick={() => handleShare("sms")}
              >
                <MessageSquare className="h-4 w-4" />
                Per SMS teilen
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-md bg-background/80 border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Per E-Mail teilen</CardTitle>
            <CardDescription>
              Sende eine Einladung per E-Mail an deine Freunde.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                E-Mail-Adresse
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@beispiel.de"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="message">
                Nachricht
              </label>
              <Textarea
                id="message"
                placeholder="Deine persönliche Nachricht"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button 
              className="w-full"
              onClick={() => handleShare("email")}
              disabled={!emailAddress}
            >
              <Mail className="h-4 w-4 mr-2" />
              E-Mail senden
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SharePage;
