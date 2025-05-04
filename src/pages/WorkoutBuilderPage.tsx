
import React from "react";
import Layout from "@/components/Layout";
import CustomWorkoutBuilder from "@/components/workout/CustomWorkoutBuilder";

const WorkoutBuilderPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <CustomWorkoutBuilder />
      </div>
    </Layout>
  );
};

export default WorkoutBuilderPage;
