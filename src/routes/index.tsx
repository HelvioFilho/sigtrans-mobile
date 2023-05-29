import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import { AppRoutes } from "./app.routes";
import { SyncMessage } from "@/components/SyncMessage";
import { useRealm } from "@/database";
import { useEffect, useState } from "react";

export function Routes() {
  const [percentageToSync, setPercentageToSync] = useState<string | null>(null);

  const realm = useRealm();

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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <NavigationContainer>
        {percentageToSync && <SyncMessage message={percentageToSync} />}
        <AppRoutes />
      </NavigationContainer>
    </SafeAreaView>
  );
}
