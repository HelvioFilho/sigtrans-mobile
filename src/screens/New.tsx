import { SafeAreaView } from "react-native";
import { FirstInformation } from "./newScreens/FirstInformation";
import { useRoute } from "@react-navigation/native";
import { SecondInformation } from "./newScreens/SecondInformation";
import { Gallery } from "./newScreens/Gallery";
import { Review } from "./newScreens/Review";
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
      break;
    case 2:
      currentPage = <Gallery />;
      break;
    case 3:
      currentPage = <Review />;
      break;
    default:
      currentPage = <FirstInformation />;
  }
  return (
    <SafeAreaView className="flex-1 bg-slate-50">{currentPage}</SafeAreaView>
  );
}
