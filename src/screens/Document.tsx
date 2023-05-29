import { EditInformation } from "@/components/EditInformation";
import { Label } from "@/components/Label";
import { TitleWrapper } from "@/components/TitleWrapper";
import { useRealm } from "@/database";
import { VehicleInspection } from "@/database/schemas/VehicleInspection";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type RouteParamsProps = {
  id: string;
};

type CheckListProps = {
  id: string;
  name: string;
  damage: string;
};

type GalleryProps = {
  id: string;
  uri: string;
};

export function Document() {
  const [document, setDocument] = useState({} as VehicleInspection);
  const [checkList, setCheckList] = useState<CheckListProps[]>([]);
  const [gallery, setGallery] = useState<GalleryProps[]>([]);
  const route = useRoute();
  const params = route?.params as RouteParamsProps;
  const id = params?.id;

  const realm = useRealm();

  function loadData() {
    const data = realm
      .objects("VehicleInspection")
      .filtered(`documentId = "${id}"`)[0];
    const result = data as VehicleInspection;
    setDocument(result);
    setCheckList(JSON.parse(result.checkList));
    setGallery(JSON.parse(result.gallery));
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View className="flex-1">
      <Text className="mt-[10%] mb-1 self-center font-bold text-title pb-4">
        Informações do Documento
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
          <EditInformation title={document.plateTowTruck} isEditable={false} />
        </Label>
        <Label title="Nome do motorista:" type="first">
          <EditInformation title={document.driverTowTruck} isEditable={false} />
        </Label>
        <TitleWrapper title="Parque de Retenção" className="mt-10" />
        <Label title="Nome do Parque:" type="first">
          <EditInformation
            title={document.retentionParkName}
            isEditable={false}
          />
        </Label>
        <Label title="Endereço:" type="first">
          <EditInformation
            title={document.retentionParkAddress}
            isEditable={false}
          />
        </Label>
        <TitleWrapper title="Informações do Veículo" className="mt-10" />
        <Label title="Modelo:" type="first">
          <EditInformation title={document.model} isEditable={false} />
        </Label>
        <Label title="Placa:" type="first">
          <EditInformation title={document.plate} isEditable={false} />
        </Label>
        <Label title="Chassi:" type="first">
          <EditInformation title={document.chassi} isEditable={false} />
        </Label>
        <Label title="Marca:" type="first">
          <EditInformation title={document.brand} isEditable={false} />
        </Label>
        <Label title="UF:" type="first">
          <EditInformation title={document.uf} isEditable={false} />
        </Label>
        <Label title="Tipo:" type="first">
          <EditInformation title={document.type} isEditable={false} />
        </Label>
        <Label title="Espécie:" type="first">
          <EditInformation title={document.species} isEditable={false} />
        </Label>
        <Label title="Ano do veículo:" type="first">
          <EditInformation title={document.year} isEditable={false} />
        </Label>
        <TitleWrapper title="Informações Adicionais" className="mt-10" />
        <Label title="Nome do motorista:" type="first">
          <EditInformation title={document.driverName} isEditable={false} />
        </Label>
        <Label title="CNH ou RG:" type="first">
          <EditInformation
            title={document.driverLicenseOrId}
            isEditable={false}
          />
        </Label>
        <Label title="E-mail:" type="first">
          <EditInformation title={document.driverEmail} isEditable={false} />
        </Label>
        <Label title="Nome do agente:" type="first">
          <EditInformation title={document.agentName} isEditable={false} />
        </Label>
        <Label title="Matricula do agente:" type="first">
          <EditInformation title={document.agentId} isEditable={false} />
        </Label>
        <TitleWrapper title="Localização" className="mt-10" />
        <Label title="Endereço da ocorrência:" type="first">
          <EditInformation title={document.address} isEditable={false} />
        </Label>
        <Label title="Latitude:" type="first">
          <EditInformation title={document.latitude} isEditable={false} />
        </Label>
        <Label title="Longitude:" type="first">
          <EditInformation title={document.longitude} isEditable={false} />
        </Label>
        <TitleWrapper title="Listagem de itens" className="mt-10" />
        {checkList.length > 0 ? (
          checkList.map((item) => {
            return (
              <Label key={item.id} title={item.name} type="first">
                <EditInformation
                  title={`estado: ${item.damage}`}
                  isEditable={false}
                />
              </Label>
            );
          })
        ) : (
          <Text className="text-center font-regular text-md mb-4">
            Nenhum item adicionado
          </Text>
        )}
        <TitleWrapper title="Imagens" className="mt-10" />
        <View className="flex-row flex-wrap justify-between gap-5 px-7 mt-10">
          {gallery.length > 0 ? (
            gallery.map((image) => (
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
            ))
          ) : (
            <Text className="text-center font-regular text-md mb-4">
              Nenhuma imagem adicionada
            </Text>
          )}
        </View>
        <TitleWrapper title="Observações" className="mt-10" />
        <Label title="Observações:" type="first">
          <EditInformation title={document.observations} isEditable={false} />
        </Label>
      </ScrollView>
    </View>
  );
}
