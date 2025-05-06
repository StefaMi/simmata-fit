
import React from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { Link } from "react-router-dom";

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
              <Link to="/profile">Zum Profil</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreWorkoutWarning;
