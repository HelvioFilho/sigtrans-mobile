import { useState } from "react";
import { SectionList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { InputField } from "@/components/InputField";
import { IconButton } from "@/components/IconButton";
import { DocumentsList } from "@/components/DocumentsList";

import { useRealm } from "@/database";
import { VehicleInspection } from "@/database/schemas/VehicleInspection";

import { isToday } from "@/utils/isToday";
import { sortedDate } from "@/utils/sortedDate";

import { DocumentsListProps } from "./Home";
import { useDocumentStore } from "@/stores/documentStore";

type FormData = {
  search: string;
};

const schema = Yup.object().shape({
  search: Yup.string()
    .trim()
    .min(4, "Precisa ter no mínimo 4 caracteres")
    .required("A busca não pode ser vazia"),
});

export function Search() {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentsListProps[]>([]);
  const [startSearch, setStartSearch] = useState(false);

  const { setIdData } = useDocumentStore();
  const { navigate } = useNavigation();
  const realm = useRealm();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleSelectDocument(id: string) {
    setIdData(id);
    navigate("Document");
  }

  function handleSearch({ search }: Partial<FormData>) {
    try {
      setIsLoading(true);
      setStartSearch(true);

      const searchValue = search ? search : "";

      const data = realm
        .objects<VehicleInspection>("VehicleInspection")
        .filtered(
          `driverLicenseOrId CONTAINS[c] "${searchValue}" 
          OR driverName CONTAINS[c] "${searchValue}"
          OR agentName CONTAINS[c] "${searchValue}"
          OR plate CONTAINS[c] "${searchValue}"
          OR chassi CONTAINS[c] "${searchValue}"
          OR agentId CONTAINS[c] "${searchValue}"
          OR dateString CONTAINS[c] "${searchValue}"
          `
        );

      const dataGroup = sortedDate(data);
      setDocuments(dataGroup);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 pt-[10%] px-4 bg-slate-50">
      <Text className="font-bold text-md">Faça sua pesquisa</Text>
      <InputField
        name="search"
        control={control}
        error={errors && (errors.search?.message as string)}
        placeholder="Exemplo de busca: 29/05/2023"
        onBlur={() => setStartSearch(false)}
        icon={
          <IconButton
            iconName="search"
            isLoading={isLoading}
            onSubmit={handleSubmit(handleSearch)}
          />
        }
      />
      {(documents.length > 0 || startSearch) && (
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
                Não foi encontrado nenhum documento que corresponde a sua
                pesquisa!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
