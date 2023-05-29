import { Image, SectionList, Text, View } from "react-native";

import Logo from "@/assets/logo.png";
import { useCallback, useEffect, useState } from "react";
import { DocumentsList } from "@/components/DocumentsList";
import { isToday } from "@/utils/isToday";
import { useRealm } from "@/database";
import { VehicleInspection } from "@/database/schemas/VehicleInspection";
import { useFocusEffect } from "@react-navigation/native";

export type DocumentsProps = {
  id: string;
  name: string;
  model: string;
  plate: string;
  retentionPark: string;
};

type DocumentsListProps = {
  date: string;
  data: DocumentsProps[];
};

export function Home() {
  const [documents, setDocuments] = useState<DocumentsListProps[]>([]);

  const realm = useRealm();

  function getDocuments() {
    const data = realm.objects<VehicleInspection>("VehicleInspection");

    const dataGroup = data.sorted("date", true).reduce((acc, curr) => {
      const date = curr.date.toLocaleDateString("pt-BR");
      const find = acc.find((item) => item.date === date);
      if (!find) {
        acc.push({
          date,
          data: [
            {
              id: curr.documentId,
              name: curr.agentName,
              model: curr.model,
              plate: curr.plate,
              retentionPark: curr.retentionParkName,
            },
          ],
        });
      } else {
        find.data.push({
          id: curr.documentId,
          name: curr.agentName,
          model: curr.model,
          plate: curr.plate,
          retentionPark: curr.retentionParkName,
        });
      }
      return acc;
    }, [] as DocumentsListProps[]);
    setDocuments(dataGroup);
  }

  useFocusEffect(
    useCallback(() => {
      getDocuments();
    }, [])
  );

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName("VehicleInspection");
      mutableSubs.add(realm.objects(VehicleInspection), {
        name: "VehicleInspection",
      });
    });
  }, [realm]);

  return (
    <View className="flex-1 px-4 pt-5 bg-slate-50">
      <View className="flex-row mt-[10%] items-end">
        <Image className="h-[50px] w-[50px] rounded-md" source={Logo} />
        <Text className="font-bold text-title ml-4">Lista de Documentos</Text>
      </View>
      <SectionList
        sections={documents}
        keyExtractor={(item) => item.id}
        className="my-5"
        renderItem={({ item }) => <DocumentsList data={item} />}
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
