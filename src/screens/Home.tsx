import { useCallback, useEffect, useState } from "react";
import { Image, SectionList, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { DocumentsList } from "@/components/DocumentsList";

import { useRealm } from "@/database";
import { VehicleInspection } from "@/database/schemas/VehicleInspection";

import { isToday } from "@/utils/isToday";
import { sortedDate } from "@/utils/sortedDate";

import Logo from "@/assets/logo.png";
import { useDocumentStore } from "@/stores/documentStore";
import { Accessory } from "@/database/schemas/Accessory";
import { Damage } from "@/database/schemas/Damage";
import { VehicleType } from "@/database/schemas/VehicleType";
import { Species } from "@/database/schemas/Species";
import { RetentionPark } from "@/database/schemas/RetentionPark";

export type DocumentsProps = {
  id: string;
  name: string;
  model: string;
  plate: string;
  chassi: string;
};

export type DocumentsListProps = {
  date: string;
  data: DocumentsProps[];
};

export function Home() {
  const [documents, setDocuments] = useState<DocumentsListProps[]>([]);

  const { navigate } = useNavigation();
  const realm = useRealm();
  const { setIdData } = useDocumentStore();

  function getDocuments() {
    const data = realm.objects<VehicleInspection>("VehicleInspection");

    const dataGroup = sortedDate(data);
    setDocuments(dataGroup);
  }

  function handleSelectDocument(id: string) {
    setIdData(id);
    navigate("Document");
  }

  useFocusEffect(
    useCallback(() => {
      getDocuments();
    }, [realm])
  );

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName("VehicleInspection");
      mutableSubs.removeByName("accessory");
      mutableSubs.removeByName("damage");
      mutableSubs.removeByName("vehicleType");
      mutableSubs.removeByName("species");
      mutableSubs.removeByName("retentionPark");
      mutableSubs.add(realm.objects(VehicleInspection), {
        name: "VehicleInspection",
      });
      mutableSubs.add(realm.objects(Accessory), {
        name: "accessory",
      });
      mutableSubs.add(realm.objects(Damage), {
        name: "damage",
      });
      mutableSubs.add(realm.objects(VehicleType), {
        name: "vehicleType",
      });
      mutableSubs.add(realm.objects(Species), {
        name: "species",
      });
      mutableSubs.add(realm.objects(RetentionPark), {
        name: "retentionPark",
      });
    });
  }, [realm]);

  return (
    <View className="flex-1 px-4 bg-slate-50">
      <View className="flex-row mt-[10%] items-end">
        <Image className="h-[50px] w-[50px] rounded-md" source={Logo} />
        <Text className="font-bold text-title ml-4">Lista de Documentos</Text>
      </View>
      <SectionList
        sections={documents}
        keyExtractor={(item) => item.id}
        className="my-5"
        renderItem={({ item }) => (
          <DocumentsList
            data={item}
            onPress={() => handleSelectDocument(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section: { date } }) => (
          <View className="py-3 justify-center items-center">
            <Text className="font-bold tracking-widest text-base">
              {isToday(date)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View className="mt-12 px-4">
            <Text className="font-regular text-md text-center">
              Ainda não há documentos cadastrados
            </Text>
          </View>
        }
      />
    </View>
  );
}
