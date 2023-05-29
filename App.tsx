import "react-native-gesture-handler";
import "react-native-get-random-values";
import { StatusBar } from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { Routes } from "@/routes";
import { RealmProvider, syncConfig } from "@/database";
import { AppProvider, UserProvider } from "@realm/react";
import { Loading } from "@/components/Loading";
import { LoadingData } from "@/screens/LoadingData";

const { APP_ID } = process.env;

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <AppProvider id={APP_ID as string}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <UserProvider fallback={LoadingData}>
        <RealmProvider sync={syncConfig} fallback={Loading}>
          {fontsLoaded ? <Routes /> : <Loading />}
        </RealmProvider>
      </UserProvider>
    </AppProvider>
  );
}
