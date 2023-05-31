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
import { Ionicons, Foundation } from "@expo/vector-icons";

import { Button } from "@/components/Button";
import { TitleWrapper } from "@/components/TitleWrapper";
import { CameraOrGallery } from "@/components/Gallery/CameraOrGallery";
import { OpenImage } from "@/components/Gallery/OpenImage";

import {
  deleteImageFromGallery,
  launchImageCamera,
  launchImageLibrary,
  saveImageToGallery,
} from "@/utils/imageHelper";

import { useNavigation } from "@react-navigation/native";
import { useGalleryStore } from "@/stores/galleryStore";

export type ImageSelectedProps = {
  id: string;
  name: string;
  documentId: string;
  uri: string;
};

export function Gallery() {
  const [images, setImages] = useState<ImageSelectedProps[]>([]);
  const [imageSelected, setImageSelected] = useState<ImageSelectedProps>(
    {} as ImageSelectedProps
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const { navigate } = useNavigation();
  const { galleryData, setGalleryData } = useGalleryStore();

  function closeModal() {
    setModalVisible(false);
    setOpen(false);
  }
  async function handleAddImage(fromCamera: boolean) {
    closeModal();
    if (images.length >= 5) {
      Alert.alert("Aviso!", "Você já adicionou o máximo de imagens");
      return;
    }
    try {
      let image = {} as ImageSelectedProps | undefined;
      if (fromCamera) {
        image = await launchImageCamera();
      } else {
        image = await launchImageLibrary();
      }
      if (image === undefined) return;
      const data = [...images, image];
      setGalleryData(data);
      setImages(data);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Aviso!", error.message);
      }
      Alert.alert("Aviso!", "Não foi possível adicionar a imagem");
    }
  }

  async function handleOpenImage(image: ImageSelectedProps) {
    setImageSelected(image);
    setOpen(true);
    setModalVisible(true);
  }

  async function handleSaveImage() {
    closeModal();
    try {
      const message = await saveImageToGallery(imageSelected.uri);
      Alert.alert("Aviso!", message);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Aviso!", error.message);
      }
      Alert.alert("Aviso!", "Não foi possível salvar a imagem");
    }
  }

  async function handleDeleteImage() {
    closeModal();
    try {
      const result = await deleteImageFromGallery(imageSelected.uri);
      if (result) {
        const data = images.filter((image) => image.id !== imageSelected.id);
        setGalleryData(data);
        setImages(data);
      }
      Alert.alert("Aviso!", "Imagem deletada com sucesso");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Aviso!", error.message);
      }
      Alert.alert("Aviso!", "Não foi possível deletar a imagem");
    }
  }

  useEffect(() => {
    setImages(galleryData);
  }, []);

  return (
    <View className="flex-1">
      <Text className="mt-[10%] mb-1 self-center font-bold text-title pb-4">
        Registro do Veículo
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
        <TitleWrapper title="Galeria" />
        <View className="flex-1 px-4">
          <Text className="font-regular text-base mt-6 mb-4">
            Escolha até 5 imagens para mostrar o estado do veículo:
          </Text>
          <View className="flex-row flex-wrap justify-between gap-5 px-4">
            <TouchableOpacity
              className="w-[150px] h-[150px] bg-slate-300 rounded-sm justify-center items-center"
              activeOpacity={0.8}
              disabled={images.length >= 5}
              onPress={() => setModalVisible(true)}
            >
              {images.length >= 5 ? (
                <Foundation name="prohibited" size={38} color="white" />
              ) : (
                <Ionicons name="add-outline" size={38} color="white" />
              )}
            </TouchableOpacity>
            {images.map((image) => (
              <TouchableOpacity
                key={image.id}
                activeOpacity={0.8}
                onPress={() => handleOpenImage(image)}
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
        </View>
        <View className="flex-row justify-between px-4 pt-14">
          <View className="w-[40%]">
            <Button title="Anterior" onPress={() => navigate("Second")} />
          </View>
          <View className="w-[40%]">
            <Button title="Próximo" onPress={() => navigate("Review")} />
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        {open ? (
          <OpenImage
            onSave={handleSaveImage}
            onDelete={handleDeleteImage}
            onClose={closeModal}
            uri={imageSelected.uri}
          />
        ) : (
          <CameraOrGallery
            onClose={() => setModalVisible(false)}
            onPress={handleAddImage}
          />
        )}
      </Modal>
    </View>
  );
}
