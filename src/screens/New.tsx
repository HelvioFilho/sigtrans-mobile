import { SafeAreaView } from "react-native";
import { FirstInformation } from "./newScreens/FirstInformation";

export function New() {
  let currentPage = <FirstInformation />;
  return (
    <SafeAreaView className="flex-1 bg-slate-50">{currentPage}</SafeAreaView>
  );
}
