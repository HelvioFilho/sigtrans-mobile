import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import { AppRoutes } from "./app.routes";
import { SyncMessage } from "@/components/SyncMessage";
import { useRealm } from "@/database";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { getStorage, saveStorage } from "@/utils/storageHelper";
import { uploadImageToDatabase } from "@/utils/imageHelper";
import { ExternalImageProps } from "@/screens/newScreens/Review";
import { VehicleInspection } from "@/database/schemas/VehicleInspection";

type ImageSyncLaterProps = {
  [id: string]: string[];
};

export function Routes() {
  const [percentageToSync, setPercentageToSync] = useState<string | null>(null);

  const realm = useRealm();

  function saveRealmDb(
    id: string,
    uploadImage: ExternalImageProps[] | undefined
  ) {
    try {
      if (uploadImage) {
        realm.write(() => {
          const document = realm
            .objects<VehicleInspection>("VehicleInspection")
            .filtered(`documentId == "${id}" `);
          if (document.length > 0) {
            let obj = document[0];
            obj.gallery = JSON.stringify(uploadImage);
          }
        });
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      let ImagesToSyncLater = getStorage("syncLaterImages");
      let obj: ImageSyncLaterProps = ImagesToSyncLater
        ? JSON.parse(ImagesToSyncLater)
        : {};
      delete obj[id];
      saveStorage("syncLaterImages", JSON.stringify(obj));
    }
  }

  async function uploadImageToSyncLater(obj: ImageSyncLaterProps) {
    for (let id in obj) {
      let arrayImages = obj[id];
      let resultUploadImage = await uploadImageToDatabase(arrayImages);
      saveRealmDb(id, resultUploadImage);
    }
  }

  async function checkImagesToSyncLater() {
    try {
      const existingImages = getStorage("syncLaterImages");
      const images: ImageSyncLaterProps = existingImages
        ? JSON.parse(existingImages)
        : {};
      if (images) {
        await uploadImageToSyncLater(images);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function progressNotification(
    transferred: number,
    transferable: number
  ) {
    const percentage = (transferred / transferable) * 100;
    if (percentage === 100) {
      setPercentageToSync(null);
    }
    if (percentage < 100) {
      setPercentageToSync(`${percentage.toFixed(0)}% sincronizados`);
    }
  }

  useEffect(() => {
    const syncSession = realm.syncSession;

    if (!syncSession) return;

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification
    );

    return () => {
      syncSession.removeProgressNotification(progressNotification);
    };
  }, []);

  useEffect(() => {
    const unSubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        checkImagesToSyncLater();
      }
    });

    return () => {
      unSubscribe();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <NavigationContainer>
        {percentageToSync && <SyncMessage message={percentageToSync} />}
        <AppRoutes />
      </NavigationContainer>
    </SafeAreaView>
  );
}
