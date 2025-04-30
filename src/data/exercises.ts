
import { BodyPart, Exercise } from "@/types";

export const exercises: Exercise[] = [
  // Brust
  {
    id: "ex1",
    name: "Bankdrücken",
    bodyPart: "chest",
    description: "Grundübung für die Brustmuskulatur mit Langhantel auf der Flachbank.",
    videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
    sets: 4,
    reps: 10,
    restTime: 90
  },
  {
    id: "ex2",
    name: "Fliegende",
    bodyPart: "chest",
    description: "Isolationsübung für die Brustmuskulatur mit Kurzhanteln.",
    videoUrl: "https://www.youtube.com/watch?v=eozdVDA78K0",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    id: "ex2b",
    name: "Schrägbankdrücken",
    bodyPart: "chest",
    description: "Brustübung mit Fokus auf den oberen Brustbereich.",
    videoUrl: "https://www.youtube.com/watch?v=jPLdzuHckI8",
    sets: 3,
    reps: 10,
    restTime: 60
  },
  {
    id: "ex2c",
    name: "Kabelzug-Fliegende",
    bodyPart: "chest",
    description: "Isolationsübung für die Brustmuskulatur am Kabelzug.",
    videoUrl: "https://www.youtube.com/watch?v=Iwe6AmxVf7o",
    sets: 3,
    reps: 15,
    restTime: 60
  },
  // Rücken
  {
    id: "ex3",
    name: "Klimmzüge",
    bodyPart: "back",
    description: "Grundübung für den oberen Rücken mit Eigengewicht.",
    videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    sets: 4,
    reps: 8,
    restTime: 90
  },
  {
    id: "ex4",
    name: "Rudern mit Langhantel",
    bodyPart: "back",
    description: "Grundübung für den mittleren Rücken mit Langhantel.",
    videoUrl: "https://www.youtube.com/watch?v=G8l_8chR5BE",
    sets: 4,
    reps: 10,
    restTime: 90
  },
  {
    id: "ex4b",
    name: "Latziehen",
    bodyPart: "back",
    description: "Übung für den breiten Rückenmuskel (Latissimus) am Kabelzug.",
    videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
    sets: 3,
    reps: 12,
    restTime: 75
  },
  {
    id: "ex4c",
    name: "Einarmiges Rudern",
    bodyPart: "back",
    description: "Einseitige Rückenübung mit Kurzhantel.",
    videoUrl: "https://www.youtube.com/watch?v=pYcpY20QaE8",
    sets: 3,
    reps: 10,
    restTime: 60
  },
  // Schultern
  {
    id: "ex5",
    name: "Schulterdrücken",
    bodyPart: "shoulders",
    description: "Grundübung für die Schultermuskulatur im Sitzen oder Stehen.",
    videoUrl: "https://www.youtube.com/watch?v=qEwKCR5JCog",
    sets: 4,
    reps: 10,
    restTime: 90
  },
  {
    id: "ex6",
    name: "Seitheben",
    bodyPart: "shoulders",
    description: "Isolationsübung für die seitliche Schultermuskulatur.",
    videoUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo",
    sets: 3,
    reps: 15,
    restTime: 60
  },
  {
    id: "ex6b",
    name: "Vorgebeugtes Seitheben",
    bodyPart: "shoulders",
    description: "Isolationsübung für den hinteren Deltamuskel.",
    videoUrl: "https://www.youtube.com/watch?v=ttvfGg9d76c",
    sets: 3,
    reps: 15,
    restTime: 60
  },
  {
    id: "ex6c",
    name: "Frontheben",
    bodyPart: "shoulders",
    description: "Isolationsübung für den vorderen Deltamuskel.",
    videoUrl: "https://www.youtube.com/watch?v=sxeMWa7ZQNc",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  // Bizeps
  {
    id: "ex7",
    name: "Bizepscurls mit Langhantel",
    bodyPart: "biceps",
    description: "Grundübung für den Bizeps mit Langhantel.",
    videoUrl: "https://www.youtube.com/watch?v=kwG2ipFRgfo",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    id: "ex8",
    name: "Hammercurls",
    bodyPart: "biceps",
    description: "Übung für den Bizeps mit Kurzhanteln in neutraler Griffposition.",
    videoUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    id: "ex8b",
    name: "Konzentrationscurls",
    bodyPart: "biceps",
    description: "Isolationsübung für den Bizeps im Sitzen.",
    videoUrl: "https://www.youtube.com/watch?v=Jvj2wV0vOYU",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    id: "ex8c",
    name: "Kabelzug Curls",
    bodyPart: "biceps",
    description: "Bizepsübung am Kabelzug mit konstantem Widerstand.",
    videoUrl: "https://www.youtube.com/watch?v=3qUJMeZgArY",
    sets: 3,
    reps: 15,
    restTime: 60
  },
  // Trizeps
  {
    id: "ex9",
    name: "Trizepsdrücken am Kabelzug",
    bodyPart: "triceps",
    description: "Isolationsübung für den Trizeps am Kabelzug.",
    videoUrl: "https://www.youtube.com/watch?v=2-LAMcpzODU",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    id: "ex10",
    name: "Dips",
    bodyPart: "triceps",
    description: "Grundübung für den Trizeps mit Eigengewicht.",
    videoUrl: "https://www.youtube.com/watch?v=2z8JmcrW-As",
    sets: 3,
    reps: 10,
    restTime: 60
  },
  {
    id: "ex10b",
    name: "Trizeps Kickbacks",
    bodyPart: "triceps",
    description: "Isolationsübung für den Trizeps mit Kurzhantel.",
    videoUrl: "https://www.youtube.com/watch?v=m9me06UBPKc",
    sets: 3,
    reps: 15,
    restTime: 60
  },
  {
    id: "ex10c",
    name: "Liegende Trizepsstreckung",
    bodyPart: "triceps",
    description: "Isolationsübung für den Trizeps im Liegen mit Kurzhantel oder Langhantel.",
    videoUrl: "https://www.youtube.com/watch?v=d_KZxkY_0cM",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  // Beine
  {
    id: "ex11",
    name: "Kniebeugen",
    bodyPart: "legs",
    description: "Grundübung für die Beinmuskulatur mit Langhantel.",
    videoUrl: "https://www.youtube.com/watch?v=U3HlEF_E9fo",
    sets: 4,
    reps: 10,
    restTime: 120
  },
  {
    id: "ex12",
    name: "Beinpresse",
    bodyPart: "legs",
    description: "Grundübung für die Beinmuskulatur an der Maschine.",
    videoUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
    sets: 4,
    reps: 12,
    restTime: 90
  },
  {
    id: "ex12b",
    name: "Beinstrecker",
    bodyPart: "legs",
    description: "Isolationsübung für den vorderen Oberschenkel (Quadrizeps).",
    videoUrl: "https://www.youtube.com/watch?v=YyvSfVjQeL0",
    sets: 3,
    reps: 15,
    restTime: 60
  },
  {
    id: "ex12c",
    name: "Beinbeuger",
    bodyPart: "legs",
    description: "Isolationsübung für den hinteren Oberschenkel (Hamstrings).",
    videoUrl: "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  {
    id: "ex12d",
    name: "Ausfallschritte",
    bodyPart: "legs",
    description: "Dynamische Übung für Beine und Gesäß.",
    videoUrl: "https://www.youtube.com/watch?v=D7KaRcUTQeE",
    sets: 3,
    reps: 12,
    restTime: 60
  },
  // Bauchmuskeln
  {
    id: "ex13",
    name: "Crunches",
    bodyPart: "abs",
    description: "Grundübung für die oberen Bauchmuskeln.",
    videoUrl: "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
    sets: 3,
    reps: 20,
    restTime: 45
  },
  {
    id: "ex14",
    name: "Beinheben",
    bodyPart: "abs",
    description: "Übung für die unteren Bauchmuskeln im Hängen oder Liegen.",
    videoUrl: "https://www.youtube.com/watch?v=JB2oyawG9KI",
    sets: 3,
    reps: 15,
    restTime: 45
  },
  {
    id: "ex14b",
    name: "Russian Twists",
    bodyPart: "abs",
    description: "Übung für die seitlichen Bauchmuskeln (Obliques).",
    videoUrl: "https://www.youtube.com/watch?v=wkD8rjkodUI",
    sets: 3,
    reps: 20,
    restTime: 45
  },
  {
    id: "ex14c",
    name: "Planke",
    bodyPart: "abs",
    description: "Statische Übung für die Körpermitte.",
    videoUrl: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
    sets: 3,
    reps: 1,
    restTime: 60
  },
  // Kardio
  {
    id: "ex15",
    name: "Laufen",
    bodyPart: "cardio",
    description: "Ausdauertraining durch Joggen oder Laufen.",
    videoUrl: "https://www.youtube.com/watch?v=kpS5PQFRpK8",
    sets: 1,
    reps: 1,
    restTime: 0
  },
  {
    id: "ex16",
    name: "HIIT-Training",
    bodyPart: "cardio",
    description: "Hochintensives Intervalltraining für Ausdauer und Fettverbrennung.",
    videoUrl: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
    sets: 1,
    reps: 1,
    restTime: 0
  },
  {
    id: "ex16b",
    name: "Seilspringen",
    bodyPart: "cardio",
    description: "Effektives Kardiotraining mit Springseil.",
    videoUrl: "https://www.youtube.com/watch?v=u3zgHI8QnqE",
    sets: 1,
    reps: 1,
    restTime: 0
  },
  {
    id: "ex16c",
    name: "Burpees",
    bodyPart: "cardio",
    description: "Ganzkörperübung für Kraft und Ausdauer.",
    videoUrl: "https://www.youtube.com/watch?v=TU8QYVW0gDU",
    sets: 3,
    reps: 15,
    restTime: 45
  }
];

export const getExercisesByBodyPart = (bodyPart: BodyPart): Exercise[] => {
  return exercises.filter(exercise => exercise.bodyPart === bodyPart);
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(exercise => exercise.id === id);
};
