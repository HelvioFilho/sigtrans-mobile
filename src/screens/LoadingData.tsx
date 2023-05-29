import { checkMediaPermission } from "@/utils/imageHelper";
import { getPermissions } from "@/utils/locationHelper";
import { useApp } from "@realm/react";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StatusBar, Text, View } from "react-native";
import Logo from "@/assets/logo.png";

export function LoadingData() {
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const app = useApp();

  async function checkPermissions() {
    try {
      await getPermissions();
      await checkMediaPermission();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPermissions(false);
    }
  }

  async function logInWithAnonymousUser() {
    try {
      await app.logIn(Realm.Credentials.anonymous());
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkPermissions();
    if (!loadingPermissions) logInWithAnonymousUser();
  }, [loadingPermissions]);

  return (
    <View className="flex-1 justify-center items-center px-6 py-14 bg-[#1D2274]">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Image source={Logo} className="w-[100px] h-[100px]" />
      <Text className="font-bold text-md text-white py-4">
        É necessário fornecer acesso ao aplicativo para que ele funcione de
        maneira correta.
      </Text>
      <Text className="font-regular text-md text-white pb-16">
        Enquanto isso estamos carregando seus dados...
      </Text>

      <ActivityIndicator size={"large"} color="white" />
    </View>
  );
}
