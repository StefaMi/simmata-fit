
import { MusicPlaylist } from "@/types";

// Sample playlists
export const samplePlaylists: MusicPlaylist[] = [
  {
    id: "pl1",
    name: "Workout Motivation",
    provider: "spotify",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP",
    imageUrl: "https://i.scdn.co/image/ab67706f00000003bfc13c78760c8fd7752f547d",
    description: "Motivierende Tracks für dein Training"
  },
  {
    id: "pl2",
    name: "Cardio Boost",
    provider: "spotify",
    url: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC",
    imageUrl: "https://i.scdn.co/image/ab67706f00000003033194083f7b5f867cc8f4c4",
    description: "Schnelle Beats für dein Cardio-Training"
  },
  {
    id: "pl3",
    name: "Workout Essentials",
    provider: "apple",
    url: "https://music.apple.com/us/playlist/pure-workout/pl.580d40f91a0a44ac916227d3434e7fd9",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a5/4d/4d/a54d4d5e-8b8b-501e-9141-c0151498b2d9/source/600x600bb.jpg",
    description: "Die besten Tracks für jedes Training"
  },
  {
    id: "pl4",
    name: "Power Workout",
    provider: "youtube",
    url: "https://www.youtube.com/playlist?list=PLChOO_ZAB22WuyDODJ3kjJiTwL7cwXd9j",
    imageUrl: "https://i.ytimg.com/vi/tAGnKpE4NCI/maxresdefault.jpg",
    description: "Energiegeladene Musik für intensives Training"
  },
  {
    id: "pl5",
    name: "Running Mix",
    provider: "amazon",
    url: "#",
    description: "Perfekt für Laufen und Joggen"
  }
];
