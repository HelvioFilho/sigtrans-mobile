import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useNetInfo } from "@react-native-community/netinfo";

import { Label } from "@/components/Label";
import { Button } from "@/components/Button";
import { TitleWrapper } from "@/components/TitleWrapper";
import { EditInformation } from "@/components/EditInformation";
import { OpenImage } from "@/components/Gallery/OpenImage";

import { useFirstStore } from "@/stores/firstStore";
import { useGalleryStore } from "@/stores/galleryStore";
import { useSecondStore } from "@/stores/secondStore";

import { useRealm } from "@/database";
import { VehicleInspection } from "@/database/schemas/VehicleInspection";

import {
  generateId,
  removeStorage,
  saveImageToSyncLater,
} from "@/utils/storageHelper";
import { uploadImageToDatabase } from "@/utils/imageHelper";

import { ImageSelectedProps } from "./Gallery";
import { SelectItemProps } from "./SecondInformation";

export type ExternalImageProps = {
  uri: string;
};

export function Review() {
  const [gallery, setGallery] = useState<ImageSelectedProps[]>([]);
  const [checkList, setCheckList] = useState<SelectItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSelected, setImageSelected] = useState("");

  const { firstData, deleteFirstData } = useFirstStore();
  const { secondData, deleteSecondData } = useSecondStore();
  const { galleryData, cleanGalleryData } = useGalleryStore();

  const { navigate, reset } = useNavigation();
  const realm = useRealm();
  const documentId = generateId();
  const netInfo = useNetInfo();

  async function checkAndUploadImages() {
    try {
      let uris: ExternalImageProps[] = [];
      if (galleryData.length > 0) {
        const images = galleryData.map((image) => image.uri);
        if (netInfo.isConnected) {
          const resultUploadImage = await uploadImageToDatabase(images);
          uris = resultUploadImage ? resultUploadImage : [];
        } else {
          const saveImagesOffline = {
            [documentId]: images,
          };
          saveImageToSyncLater(saveImagesOffline);
        }
      }
      return uris;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async function saveVehicleInspection() {
    try {
      setIsLoading(true);
      const uris = await checkAndUploadImages();
      realm.write(() => {
        return new VehicleInspection(realm, {
          _id: new Realm.BSON.ObjectId(),
          documentId,
          date: new Date(),
          ...firstData,
          driverName: secondData.driverName,
          driverLicenseOrId: secondData.driverLicenseOrId,
          driverEmail: secondData.driverEmail || "",
          agentName: secondData.agentName,
          agentId: secondData.agentId,
          address: secondData.address,
          latitude: secondData.latitude || "",
          longitude: secondData.longitude || "",
          checkList: JSON.stringify(secondData.checkList),
          dateString: new Date().toLocaleString("pt-BR"),
          gallery: JSON.stringify(uris),
          observations: secondData.observations,
        });
      });
      removeStorage("id");
      deleteFirstData();
      deleteSecondData();
      cleanGalleryData();
    } catch (error) {
      Alert.alert(
        "Aviso",
        "Algo deu errado ao tentar salvar os dados! Tente novamente mais tarde ou entre em contato com o suporte."
      );
      console.log(error);
    } finally {
      reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      setIsLoading(false);
    }
  }

  function ShowAlert() {
    Alert.alert(
      "Aviso",
      "Deseja salvar as informações?\nUma vez salvo não será possível alterar.",
      [
        { text: "Revisar", style: "cancel" },
        { text: "Salvar", onPress: () => saveVehicleInspection() },
      ],
      { cancelable: false }
    );
  }

  function loadData() {
    setGallery(galleryData ? galleryData : []);
    setCheckList(secondData ? secondData.checkList : []);
  }

  useEffect(() => {
    loadData();
  }, [galleryData, secondData]);

  return (
    <View className="flex-1">
      <Text className="mt-[10%] mb-1 self-center font-bold text-title pb-4">
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
          <EditInformation title={firstData.plateTowTruck!} id={0} />
        </Label>
        <Label title="Nome do motorista:" type="first">
          <EditInformation title={firstData.driverTowTruck!} id={0} />
        </Label>
        <TitleWrapper title="Parque de Retenção" className="mt-10" />
        <Label title="Nome do Parque:" type="first">
          <EditInformation title={firstData.retentionParkName!} id={0} />
        </Label>
        <Label title="Endereço:" type="first">
          <EditInformation title={firstData.retentionParkAddress!} id={0} />
        </Label>
        <TitleWrapper title="Informações do Veículo" className="mt-10" />
        <Label title="Modelo:" type="first">
          <EditInformation title={firstData.model!} id={0} />
        </Label>
        <Label title="Placa:" type="first">
          <EditInformation title={firstData.plate!} id={0} />
        </Label>
        <Label title="Chassi:" type="first">
          <EditInformation title={firstData.chassi!} id={0} />
        </Label>
        <Label title="Marca:" type="first">
          <EditInformation title={firstData.brand!} id={0} />
        </Label>
        <Label title="UF:" type="first">
          <EditInformation title={firstData.uf!} id={0} />
        </Label>
        <Label title="Tipo:" type="first">
          <EditInformation title={firstData.type!} id={0} />
        </Label>
        <Label title="Espécie:" type="first">
          <EditInformation title={firstData.species!} id={0} />
        </Label>
        <Label title="Ano do veículo:" type="first">
          <EditInformation title={firstData.year!} id={0} />
        </Label>
        <TitleWrapper title="Informações Adicionais" className="mt-10" />
        <Label title="Nome do motorista:" type="first">
          <EditInformation title={secondData.driverName} id={1} />
        </Label>
        <Label title="CNH ou RG:" type="first">
          <EditInformation title={secondData.driverLicenseOrId} id={1} />
        </Label>
        <Label title="E-mail:" type="first">
          <EditInformation title={secondData.driverEmail} id={1} />
        </Label>
        <Label title="Nome do agente:" type="first">
          <EditInformation title={secondData.agentName} id={1} />
        </Label>
        <Label title="Matricula do agente:" type="first">
          <EditInformation title={secondData.agentId} id={1} />
        </Label>
        <TitleWrapper title="Localização" className="mt-10" />
        <Label title="Endereço da ocorrência:" type="first">
          <EditInformation title={secondData.address} id={1} />
        </Label>
        <Label title="Latitude:" type="first">
          <EditInformation title={secondData.latitude} isEditable={false} />
        </Label>
        <Label title="Longitude:" type="first">
          <EditInformation title={secondData.longitude} isEditable={false} />
        </Label>
        <TitleWrapper title="Listagem de itens" className="mt-10" />
        {checkList && checkList.length > 0 ? (
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
          <Text className="text-center font-regular text-md mt-10 mb-4">
            Nenhum item adicionado
          </Text>
        )}
        <View className="mt-8 px-4">
          <Button
            title="Editar"
            className="w-[40%] self-end"
            color="bg-teal-600"
            onPress={() => navigate("Second")}
          />
        </View>
        <TitleWrapper title="Imagens" className="mt-10" />
        <View className="flex-row flex-wrap justify-between gap-5 px-7 mt-10">
          {gallery && gallery.length > 0 ? (
            gallery.map((image) => (
              <TouchableOpacity
                key={image.id}
                activeOpacity={0.8}
                onPress={() => {
                  setImageSelected(image.uri);
                  setModalVisible(true);
                }}
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
        <View className="mt-8 px-4">
          <Button
            title="Editar"
            className="w-[40%] self-end"
            color="bg-teal-600"
            onPress={() => navigate("Gallery")}
          />
        </View>
        <TitleWrapper title="Observações" className="mt-10" />
        <Label title="Observações:" type="first">
          <EditInformation title={secondData.observations} id={1} />
        </Label>
        <View className="flex-row justify-between px-4 pt-14">
          <View className="w-[40%]">
            <Button title="Anterior" onPress={() => navigate("Gallery")} />
          </View>
          <View className="w-[40%]">
            <Button title="Salvar" disabled={isLoading} onPress={ShowAlert} />
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <OpenImage
            onClose={() => setModalVisible(false)}
            uri={imageSelected}
          />
        </Modal>
        <Modal animationType="fade" transparent visible={isLoading}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-[90%] py-4 justify-center items-center rounded-lg">
              <Text className="text-center text-md font-bold mt-5">
                Salvando as informações
              </Text>
              <View className="my-5 w-[90%]">
                <Text className="text-center text-base font-regular mb-8">
                  Essa ação pode demorar alguns segundos, por favor, aguarde.
                </Text>
                <ActivityIndicator size="large" color="#000" />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}
