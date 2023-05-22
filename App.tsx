import { StatusBar, Text, View } from "react-native";

export default function App() {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View className="flex-1 justify-center items-center ">
        <Text className="text-teal-700">Run!</Text>
      </View>
    </>
  );
}
