import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ImageSelectedProps } from "./newScreens/Gallery";
import { useNetInfo } from "@react-native-community/netinfo";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

import { Label } from "@/components/Label";
import { TitleWrapper } from "@/components/TitleWrapper";
import { OpenImage } from "@/components/Gallery/OpenImage";
import { EditInformation } from "@/components/EditInformation";

import { useRealm } from "@/database";
import { VehicleInspection } from "@/database/schemas/VehicleInspection";
import { useDocumentStore } from "@/stores/documentStore";

import { getStorage, saveStorage } from "@/utils/storageHelper";
import {
  saveExternalImagesToStorage,
  saveImageToGallery,
} from "@/utils/imageHelper";

import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/Button";
import { generateTemplate } from "@/utils/generateTemplate";

export type CheckListProps = {
  id: string;
  name: string;
  damage: string;
};

export type GalleryProps = {
  id: string;
  uri: string;
};

export function Document() {
  const [document, setDocument] = useState({} as VehicleInspection);
  const [checkList, setCheckList] = useState<CheckListProps[]>([]);
  const [gallery, setGallery] = useState<GalleryProps[]>([]);
  const [messageWanningImage, setMessageWanningImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSelected, setImageSelected] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { idData } = useDocumentStore();
  const { goBack } = useNavigation();

  const KEY = `gallery_${idData}`;

  function getGallery() {
    const response = getStorage(KEY);
    return response ? JSON.parse(response) : ([] as ImageSelectedProps[]);
  }

  const realm = useRealm();
  const netInfo = useNetInfo();

  async function saveExternalImages(images: ImageSelectedProps[]) {
    try {
      const response = await saveExternalImagesToStorage(images);
      if (response) {
        saveStorage(KEY, JSON.stringify(response));
        setGallery(response);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  function loadData() {
    const galleryImages = getGallery();
    const data = realm
      .objects("VehicleInspection")
      .filtered(`documentId = "${idData}"`)[0];
    const result = data as VehicleInspection;
    setDocument(result);
    setCheckList(JSON.parse(result.checkList));
    const externalImages = JSON.parse(result.gallery);

    if (galleryImages.length === 0 && externalImages.length > 0) {
      if (netInfo.isConnected) {
        saveExternalImages(externalImages);
      } else {
        setMessageWanningImage(
          "Existem imagens a serem baixadas, assim que a conexão com a internet for restabelecida, as imagens serão baixadas automaticamente."
        );
      }
    } else if (galleryImages.length > 0) {
      setGallery(galleryImages);
    }
  }

  async function handleSaveImage() {
    setModalVisible(false);
    try {
      const message = await saveImageToGallery(imageSelected);
      Alert.alert("Aviso!", message);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Aviso!", error.message);
      }
      Alert.alert("Aviso!", "Não foi possível salvar a imagem");
    }
  }

  async function handleSavePDF() {
    setIsLoading(true);
    try {
      let galleryExternal = [] as ImageSelectedProps[];
      if (netInfo.isConnected) {
        galleryExternal = JSON.parse(document.gallery);
      }
      const htmlTemplate = generateTemplate(
        document,
        checkList,
        galleryExternal
      );
      const file = await printToFileAsync({
        html: htmlTemplate,
      });
      await shareAsync(file.uri);
    } catch (error) {
      console.log("pdf error:", error);
      Alert.alert("Aviso!", "Não foi possível salvar o PDF");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [netInfo, idData]);

  return (
    <View className="flex-1">
      <View className="mt-[10%] pb-4 flex-row items-center px-4">
        <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
          <Ionicons name="arrow-back-circle-outline" size={34} color="black" />
        </TouchableOpacity>

        <Text className="font-bold text-subtitle ml-3">
          Informações do Documento
        </Text>
      </View>
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
          <Text className="font-regular text-center text-md mt-10 mb-4">
            Nenhum item adicionado
          </Text>
        )}
        <TitleWrapper title="Imagens" className="mt-10" />
        <View className="flex-row flex-wrap justify-between gap-5 px-7 mt-10">
          {gallery.length > 0 ? (
            gallery.map((image, key) => (
              <TouchableOpacity
                key={key}
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
            <View className="w-full justify-center items-center">
              <Text className="font-regular text-md mb-4">
                {messageWanningImage
                  ? messageWanningImage
                  : "Nenhuma imagem adicionada"}
              </Text>
            </View>
          )}
        </View>
        <TitleWrapper title="Observações" className="mt-10" />
        <Label title="Observações:" type="first">
          <EditInformation title={document.observations} isEditable={false} />
        </Label>
        <View></View>
        <View className="w-full px-4 mt-7">
          <Button
            className="w-[80%] self-center"
            title={isLoading ? "Carregando Arquivo" : "Compartilhar PDF"}
            color={isLoading ? "bg-slate-500" : "bg-teal-600"}
            disabled={isLoading}
            onPress={handleSavePDF}
          />
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <OpenImage
          onSave={handleSaveImage}
          onClose={() => setModalVisible(false)}
          uri={imageSelected}
        />
      </Modal>
    </View>
  );
}
