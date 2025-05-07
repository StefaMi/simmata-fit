
export interface Slide {
  title: string;
  description: string;
  image?: string;
  background?: string;
}

export const slides: Slide[] = [
  {
    title: "Willkommen bei Rush",
    description: "Deine neue persönliche Fitness-App, die dich auf deinem Weg zu einem gesünderen Leben begleitet.",
    background: "bg-gradient-to-br from-blue-600 to-indigo-800",
  },
  {
    title: "Persönlicher Trainingsplan",
    description: "Erstelle deinen individuellen Trainingsplan, angepasst an deine Ziele und deinen Zeitplan.",
    image: "/lovable-uploads/8544a0ed-1e92-42c6-bda4-3976577399cc.png",
  },
  {
    title: "Fokusübungen",
    description: "Verbessere deine Konzentration und Atmung mit speziellen Übungen für Körper und Geist.",
    image: "/lovable-uploads/e395198b-0c17-4067-a3eb-b5f0173ccfc5.png",
  },
  {
    title: "Verbinde dich mit Spotify",
    description: "Höre deine Lieblingsmusik während des Trainings durch die Integration mit Spotify.",
    image: "/lovable-uploads/d27d3ec4-26d7-4e43-b940-bd39a9cceca9.png",
  },
  {
    title: "Fortschritt verfolgen",
    description: "Verfolge deinen Fortschritt und bleibe motiviert mit Auszeichnungen und Statistiken.",
    background: "bg-gradient-to-br from-green-500 to-emerald-700",
  },
];

export const TOTAL_SLIDESHOW_DURATION = 8000; // 8 seconds total duration
