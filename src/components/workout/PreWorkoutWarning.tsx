
import React from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";

type PreWorkoutWarningProps = {
  userProfile: UserProfile | null;
  step: number;
};

const PreWorkoutWarning = ({ userProfile, step }: PreWorkoutWarningProps) => {
  if (userProfile || step !== 1) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div>
          <p className="text-sm text-yellow-700">
            Du hast noch kein Profil erstellt. Für einen optimal angepassten Trainingsplan empfehlen wir dir, zuerst dein Profil zu vervollständigen.
          </p>
          <p className="mt-3">
            <Button asChild variant="outline">
              <a href="/profile">Zum Profil</a>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreWorkoutWarning;
