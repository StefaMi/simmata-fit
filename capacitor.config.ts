
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f2574aca36244964a286edbcbf4c2b4a',
  appName: 'well-being-workout-web',
  webDir: 'dist',
  server: {
    url: "https://f2574aca-3624-4964-a286-edbcbf4c2b4a.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffffff",
      showSpinner: true,
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
