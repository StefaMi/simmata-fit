
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { UserProfile, ProgressEntry, WorkoutPlan } from "@/types";
import UserDashboard from "@/components/dashboard/UserDashboard";

const DashboardPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  
  useEffect(() => {
    // Lade Benutzerprofil aus localStorage
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error("Fehler beim Laden des Profils:", error);
      }
    }
    
    // Lade Fortschrittsdaten aus localStorage
    const savedEntries = localStorage.getItem("progressEntries");
    if (savedEntries) {
      try {
        setProgressEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error("Fehler beim Laden der Fortschrittsdaten:", error);
      }
    }
    
    // Lade Trainingsplan aus localStorage
    const savedWorkoutPlan = localStorage.getItem("workoutPlan");
    if (savedWorkoutPlan) {
      try {
        setWorkoutPlan(JSON.parse(savedWorkoutPlan));
      } catch (error) {
        console.error("Fehler beim Laden des Trainingsplans:", error);
      }
    }
  }, []);
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <UserDashboard 
          userProfile={userProfile}
          progressEntries={progressEntries}
          workoutPlan={workoutPlan}
        />
      </div>
    </Layout>
  );
};

export default DashboardPage;
