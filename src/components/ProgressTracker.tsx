
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProgressEntry, UserProfile } from "@/types";
import { Scale, TrendingUp, LineChart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

type ProgressTrackerProps = {
  userProfile: UserProfile | null;
  onProgressUpdate: (entry: ProgressEntry) => void;
  latestEntry?: ProgressEntry;
};

const progressSchema = z.object({
  weight: z.coerce.number().min(20, "Gewicht muss mindestens 20kg sein").max(300, "Gewicht muss unter 300kg sein"),
  chest: z.coerce.number().min(0).optional(),
  waist: z.coerce.number().min(0).optional(),
  hips: z.coerce.number().min(0).optional(),
  thighs: z.coerce.number().min(0).optional(),
  arms: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

const ProgressTracker = ({ userProfile, onProgressUpdate, latestEntry }: ProgressTrackerProps) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  
  // Calculate weight progress
  const startWeight = userProfile?.currentWeight || 0;
  const targetWeight = userProfile?.targetWeight || 0;
  const currentWeight = latestEntry?.weight || startWeight;
  const weightDiff = targetWeight - startWeight;
  const achievedDiff = currentWeight - startWeight;
  
  // Calculate progress percentage
  let progressPercentage = 0;
  if (weightDiff !== 0) {
    progressPercentage = Math.min(100, Math.max(0, (achievedDiff / weightDiff) * 100));
  }
  
  // Determine if goal is weight loss or gain
  const isWeightLoss = targetWeight < startWeight;
  
  // Form setup
  const form = useForm<z.infer<typeof progressSchema>>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      weight: latestEntry?.weight || startWeight,
      chest: latestEntry?.measurements?.chest,
      waist: latestEntry?.measurements?.waist,
      hips: latestEntry?.measurements?.hips,
      thighs: latestEntry?.measurements?.thighs,
      arms: latestEntry?.measurements?.arms,
      notes: latestEntry?.notes || "",
    },
  });
  
  function onSubmit(values: z.infer<typeof progressSchema>) {
    const entry: ProgressEntry = {
      id: `progress-${Date.now()}`,
      date: format(new Date(), "yyyy-MM-dd"),
      weight: values.weight,
      measurements: {
        chest: values.chest,
        waist: values.waist,
        hips: values.hips,
        thighs: values.thighs,
        arms: values.arms,
      },
      notes: values.notes,
      workoutCompleted: true,
    };
    
    onProgressUpdate(entry);
    setShowForm(false);
    
    toast({
      title: "Fortschritt gespeichert",
      description: "Deine Fortschrittsdaten wurden erfolgreich gespeichert.",
    });
  }
  
  if (!userProfile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Bitte erstelle zuerst ein Profil, um deinen Fortschritt zu verfolgen.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-fitness-primary" />
          Dein Fortschritt
        </CardTitle>
        <CardDescription>
          {isWeightLoss ? 'Gewichtsabnahme' : 'Gewichtszunahme'} Fortschritt
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progressPercentage)}% erreicht
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {currentWeight} kg / {targetWeight} kg
                </span>
              </div>
              <Progress
                value={progressPercentage}
                indicatorClassName={isWeightLoss ? "bg-fitness-success" : "bg-fitness-primary"}
              />
            </div>
            
            {latestEntry && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-2">Letzte Aktualisierung: {latestEntry.date}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {latestEntry.measurements?.chest && (
                    <div><span className="font-medium">Brust:</span> {latestEntry.measurements.chest} cm</div>
                  )}
                  {latestEntry.measurements?.waist && (
                    <div><span className="font-medium">Taille:</span> {latestEntry.measurements.waist} cm</div>
                  )}
                  {latestEntry.measurements?.hips && (
                    <div><span className="font-medium">Hüfte:</span> {latestEntry.measurements.hips} cm</div>
                  )}
                  {latestEntry.measurements?.thighs && (
                    <div><span className="font-medium">Oberschenkel:</span> {latestEntry.measurements.thighs} cm</div>
                  )}
                  {latestEntry.measurements?.arms && (
                    <div><span className="font-medium">Arme:</span> {latestEntry.measurements.arms} cm</div>
                  )}
                </div>
                {latestEntry.notes && (
                  <p className="mt-2 text-sm text-muted-foreground">{latestEntry.notes}</p>
                )}
              </div>
            )}
            
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full"
            >
              Fortschritt aktualisieren
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aktuelles Gewicht (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="chest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brust (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="waist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taille (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hips"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hüfte (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="thighs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Oberschenkel (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="arms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arme (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notizen</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Abbrechen
                </Button>
                <Button type="submit">
                  Fortschritt speichern
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
