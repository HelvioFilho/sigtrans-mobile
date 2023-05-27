import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Label } from "@/components/Label";
import { TitleWrapper } from "@/components/TitleWrapper";
import { EditInformation } from "@/components/EditInformation";

import { useFirstStore } from "@/stores/firstStore";
import { useGalleryStore } from "@/stores/galleryStore";
import { useSecondStore } from "@/stores/secondStore";

import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components/Button";

export function Review() {
  const { navigate } = useNavigation();
  const { firstData } = useFirstStore();
  const { secondData } = useSecondStore();
  const { galleryData } = useGalleryStore();

  return (
    <View className="flex-1 mt-5">
      <Text className="mt-[15%] mb-1 self-center font-bold text-title pb-4">
        Revisão de dados
      </Text>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 50,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <TitleWrapper title="Reboque" />
        <Label title="Placa do reboque:" type="first">
          <EditInformation
            title={firstData.plateTowTruck!}
            refName="plateTowTruck"
            id={0}
          />
        </Label>
        <Label title="Nome do motorista:" type="first">
          <EditInformation
            title={firstData.driverTowTruck!}
            refName="driverTowTruck"
            id={0}
          />
        </Label>
        <TitleWrapper title="Parque de Retenção" className="mt-10" />
        <Label title="Nome do Parque:" type="first">
          <EditInformation
            title={firstData.retentionParkName!}
            refName="retentionParkName"
            id={0}
          />
        </Label>
        <Label title="Endereço:" type="first">
          <EditInformation
            title={firstData.retentionParkAddress!}
            refName="retentionParkAddress"
            id={0}
          />
        </Label>
        <TitleWrapper title="Informações do Veículo" className="mt-10" />
        <Label title="Modelo:" type="first">
          <EditInformation title={firstData.model!} refName="model" id={0} />
        </Label>
        <Label title="Placa:" type="first">
          <EditInformation title={firstData.plate!} refName="plate" id={0} />
        </Label>
        <Label title="Chassi:" type="first">
          <EditInformation title={firstData.chassi!} refName="chassi" id={0} />
        </Label>
        <Label title="Marca:" type="first">
          <EditInformation title={firstData.brand!} refName="brand" id={0} />
        </Label>
        <Label title="UF:" type="first">
          <EditInformation title={firstData.uf!} refName="uf" id={0} />
        </Label>
        <Label title="Tipo:" type="first">
          <EditInformation title={firstData.type!} refName="type" id={0} />
        </Label>
        <Label title="Espécie:" type="first">
          <EditInformation
            title={firstData.species!}
            refName="species"
            id={0}
          />
        </Label>
        <Label title="Ano do veículo:" type="first">
          <EditInformation title={firstData.year!} refName="year" id={0} />
        </Label>
        <TitleWrapper title="Informações Adicionais" className="mt-10" />
        <Label title="Nome do motorista:" type="first">
          <EditInformation
            title={secondData.driverName}
            refName="driverName"
            id={1}
          />
        </Label>
        <Label title="CNH ou RG:" type="first">
          <EditInformation
            title={secondData.driverLicenseOrId}
            refName="driverLicenseOrId"
            id={1}
          />
        </Label>
        <Label title="E-mail:" type="first">
          <EditInformation
            title={secondData.driverEmail}
            refName="driverEmail"
            id={1}
          />
        </Label>
        <Label title="Nome do agente:" type="first">
          <EditInformation
            title={secondData.agentName}
            refName="agentName"
            id={1}
          />
        </Label>
        <Label title="Matricula do agente:" type="first">
          <EditInformation
            title={secondData.agentId}
            refName="agentId"
            id={1}
          />
        </Label>
        <TitleWrapper title="Localização" className="mt-10" />
        <Label title="Endereço da ocorrência:" type="first">
          <EditInformation
            title={secondData.address}
            refName="address"
            id={1}
          />
        </Label>
        <Label title="Latitude:" type="first">
          <EditInformation title={secondData.latitude} isEditable={false} />
        </Label>
        <Label title="Longitude:" type="first">
          <EditInformation title={secondData.longitude} isEditable={false} />
        </Label>
        <TitleWrapper title="Listagem de itens" className="mt-10" />
        {secondData.checkList.map((item) => {
          return (
            <Label key={item.id} title={item.name} type="first">
              <EditInformation
                title={`estado: ${item.damage}`}
                isEditable={false}
              />
            </Label>
          );
        })}
        <View className="mt-8 px-4">
          <Button
            title="Editar"
            className="w-[40%] self-end"
            color="bg-teal-600"
            onPress={() => navigate("New", { id: 1 })}
          />
        </View>
        <TitleWrapper title="Imagens" className="mt-10" />
        <View className="flex-row flex-wrap justify-between gap-5 px-7 mt-10">
          {galleryData.map((image) => (
            <TouchableOpacity
              key={image.id}
              activeOpacity={0.8}
              onPress={() => {}}
            >
              <View className="w-[150px] h-[150px] bg-slate-300 rounded-sm justify-center items-center">
                <Image
                  source={{ uri: image.uri }}
                  className="w-[150px] h-[150px]"
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View className="mt-8 px-4">
          <Button
            title="Editar"
            className="w-[40%] self-end"
            color="bg-teal-600"
            onPress={() => navigate("New", { id: 1 })}
          />
        </View>
        <TitleWrapper title="Observações" className="mt-10" />
        <Label title="Observações:" type="first">
          <EditInformation
            title={secondData.observations}
            refName="observations"
            id={1}
          />
        </Label>
        <View className="flex-row justify-between px-4 pt-14">
          <View className="w-[40%]">
            <Button
              title="Anterior"
              onPress={() => navigate("New", { id: 2 })}
            />
          </View>
          <View className="w-[40%]">
            <Button title="Salvar" onPress={() => {}} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
