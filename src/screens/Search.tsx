import { useState } from "react";
import { SectionList, Text, View } from "react-native";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "@/components/InputField";
import { IconButton } from "@/components/IconButton";
import { useRealm } from "@/database";
import { VehicleInspection } from "@/database/schemas/VehicleInspection";
import { DocumentsList } from "@/components/DocumentsList";
import { isToday } from "@/utils/isToday";
import { DocumentsListProps } from "./Home";
import { sortedDate } from "@/utils/sortedDate";

type FormData = {
  search: string;
};

const schema = Yup.object().shape({
  search: Yup.string()
    .min(4, "Precisa ter no mínimo 4 caracteres")
    .required("A busca não pode ser vazia"),
});

export function Search() {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentsListProps[]>([]);
  const [startSearch, setStartSearch] = useState(false);
  const realm = useRealm();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleSearch({ search }: Partial<FormData>) {
    setIsLoading(true);
    setStartSearch(true);
    const isDate = search ? new Date(search).getTime() : 0;
    const searchValue = search ? search : "";
    let data;

    if (!isNaN(isDate) && isDate > 0) {
      const date = new Date(searchValue).toLocaleDateString("pt-BR");
      data = realm
        .objects<VehicleInspection>("VehicleInspection")
        .filtered(`date = "${date}"`);
    } else {
      data = realm.objects<VehicleInspection>("VehicleInspection").filtered(
        `driverLicenseOrId CONTAINS[c] "${searchValue}" 
        OR driverName CONTAINS[c] "${searchValue}"
        OR agentName CONTAINS[c] "${searchValue}"
        OR plate CONTAINS[c] "${searchValue}"
        OR chassi CONTAINS[c] "${searchValue}"
        OR agentId CONTAINS[c] "${searchValue}"
        `
      );
    }

    const dataGroup = sortedDate(data);
    setDocuments(dataGroup);
    setIsLoading(false);
  }

  return (
    <View className="flex-1 pt-[20%] px-4 bg-slate-50">
      <Text className="font-bold text-md">Faça sua pesquisa</Text>
      <InputField
        name="search"
        control={control}
        error={errors && (errors.search?.message as string)}
        placeholder="Exemplo de busca: 23/02/2023"
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
