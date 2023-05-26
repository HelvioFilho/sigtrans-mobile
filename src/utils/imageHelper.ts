import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import uuid from "react-native-uuid";
import { generateId } from "./storageHelper";
import { ImageSelectedProps } from "@/screens/newScreens/Gallery";

const documentId = generateId();
const imageDefault = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.5,
};

export async function checkMediaPermission() {
  try {
    const { status: cameraPermission } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryPermission } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: mediaPermission } =
      await MediaLibrary.requestPermissionsAsync();
    if (cameraPermission !== "granted") {
      throw new Error("Precisamos de acesso a câmera para continuar");
    }
    if (libraryPermission !== "granted") {
      throw new Error("Precisamos de acesso a galeria para continuar");
    }
    if (mediaPermission !== "granted") {
      throw new Error(
        "Precisamos ter permissão para salvar a imagem na galeria"
      );
    }
  } catch (error) {
    throw new Error("Algo deu errado ao solicitar permissão de mídia");
  }
}

async function saveImageInFileSystem(
  result: ImagePicker.ImagePickerResult
): Promise<ImageSelectedProps | undefined> {
  try {
    if (result.assets) {
      const fileName = result.assets[0].uri.substring(
        result.assets[0].uri.lastIndexOf("/") + 1
      );
      const newFileUri = `${FileSystem.documentDirectory}gallery/${fileName}`;

      await FileSystem.copyAsync({
        from: result.assets[0].uri,
        to: newFileUri,
      });

      const image: ImageSelectedProps = {
        id: uuid.v4() as string,
        name: fileName,
        documentId,
        uri: newFileUri,
      };
      return image;
    }
  } catch (error) {
    throw new Error("Algo deu errado ao salvar a imagem");
  }
}

export async function launchImageCamera() {
  try {
    checkMediaPermission();
    const result = await ImagePicker.launchCameraAsync(imageDefault);

    if (!result.canceled) {
      return saveImageInFileSystem(result);
    }
    return undefined;
  } catch (error) {
    throw new Error("Algo deu errado ao abrir a câmera");
  }
}

export async function launchImageLibrary() {
  try {
    checkMediaPermission();
    const result = await ImagePicker.launchImageLibraryAsync(imageDefault);

    if (!result.canceled) {
      return saveImageInFileSystem(result);
    }
    return undefined;
  } catch (error) {
    throw new Error("Algo deu errado ao abrir a galeria");
  }
}

export async function saveImageToGallery(url: string) {
  try {
    await MediaLibrary.createAssetAsync(url);
    return "A imagem foi salva na sua galeria!";
  } catch (error) {
    throw new Error("Algo deu errado ao salvar a imagem na galeria");
  }
}

export async function deleteImageFromGallery(url: string) {
  try {
    await FileSystem.deleteAsync(url);
    return true;
  } catch (error) {
    throw new Error("Algo deu errado ao excluir a imagem da galeria");
  }
}
