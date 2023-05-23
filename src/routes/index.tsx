import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import { AppRoutes } from "./app.routes";

export function Routes() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </SafeAreaView>
  );
}
