import { checkMediaPermission } from "@/utils/imageHelper";
import { getPermissions } from "@/utils/locationHelper";
import { useApp } from "@realm/react";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StatusBar, Text, View } from "react-native";
import Logo from "@/assets/logo.png";
import { useNetInfo } from "@react-native-community/netinfo";
import { Button } from "@/components/Button";

export function LoadingData() {
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  const app = useApp();
  const netInfo = useNetInfo();

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
    if (!loadingPermissions && netInfo.isConnected) logInWithAnonymousUser();
  }, [loadingPermissions, netInfo]);

  return (
    <View className="flex-1 justify-center items-center px-6 py-14 bg-[#1D2274]">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Image source={Logo} className="w-[100px] h-[100px]" />
      {loadingPermissions && (
        <>
          <Text className="font-bold text-md text-white py-4">
            É necessário fornecer acesso ao aplicativo para que ele funcione de
            maneira correta.
          </Text>
          <Button
            color="bg-teal-600"
            title="Permitir acesso"
            onPress={() => checkPermissions()}
          />
        </>
      )}
      {!netInfo.isConnected && (
        <View className="mt-4 px-4">
          <Text className="font-regular text-md text-white pb-6">
            {netInfo.isConnected
              ? `Efetuando o login e criando a base de dados...`
              : `Para o primeiro uso do aplicativo você precisa estar conectado a internet...`}
          </Text>
          <ActivityIndicator size={"large"} color="white" />
        </View>
      )}
    </View>
  );
}
