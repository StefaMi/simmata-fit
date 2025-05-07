
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FeedbackOption {
  id: string;
  label: string;
}

const feedbackOptions: FeedbackOption[] = [
  { id: "too-easy", label: "Zu leicht" },
  { id: "just-right", label: "Genau richtig" },
  { id: "too-hard", label: "Zu schwer" },
  { id: "needs-variety", label: "Braucht mehr Abwechslung" },
  { id: "other", label: "Anderes" }
];

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<string>("just-right");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    // Here we would save the feedback to the database
    // For now, we'll just show a toast
    console.log("Feedback submitted:", { feedbackType, feedback });
    
    toast({
      title: "Feedback gesendet",
      description: "Vielen Dank für dein Feedback!",
    });
    
    setFeedback("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Feedback geben
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-md bg-background/80">
        <DialogHeader>
          <DialogTitle>Trainingsplan Feedback</DialogTitle>
          <DialogDescription>
            Wie gefällt dir dein aktueller Trainingsplan? Dein Feedback hilft uns, 
            deine Trainingserfahrung zu verbessern.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Wie findest du deinen Plan?</Label>
            <RadioGroup 
              value={feedbackType} 
              onValueChange={setFeedbackType}
              className="space-y-2"
            >
              {feedbackOptions.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback">Dein Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Schreibe dein Feedback hier..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Abbrechen</Button>
          <Button onClick={handleSubmit} disabled={feedbackType === "other" && !feedback.trim()}>
            Senden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
