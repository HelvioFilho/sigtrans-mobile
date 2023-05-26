import { SafeAreaView } from "react-native";
import { FirstInformation } from "./newScreens/FirstInformation";
import { useRoute } from "@react-navigation/native";
import { SecondInformation } from "./newScreens/SecondInformation";
type RouteParamsProps = {
  id: number;
};

export function New() {
  const route = useRoute();
  const params = route?.params as RouteParamsProps;

  const page = params?.id ? params.id : 0;
  let currentPage;

  switch (page) {
    case 0:
      currentPage = <FirstInformation />;
      break;
    case 1:
      currentPage = <SecondInformation />;
  }
  return (
    <SafeAreaView className="flex-1 bg-slate-50">{currentPage}</SafeAreaView>
  );
}
