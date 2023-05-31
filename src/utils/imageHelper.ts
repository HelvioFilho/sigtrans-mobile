import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import uuid from "react-native-uuid";
import { generateId } from "./storageHelper";
import { ImageSelectedProps } from "@/screens/newScreens/Gallery";
import { api } from "@/services/api";

const documentId = generateId();
const imageDefault = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.5,
};

type ExternalImageProps = {
  uri: string;
};

export async function uploadImageToDatabase(uris: string[]) {
  try {
    const promises: Promise<ExternalImageProps>[] = uris.map(async (uri) => {
      const fileExtension = uri.split(".").pop();
      const photoFile = {
        name: `${uuid.v4()}.${fileExtension}`.toLocaleLowerCase(),
        uri: uri,
        type: `image/${fileExtension}`,
      } as any;

      const photoUploadForm = new FormData();
      photoUploadForm.append("file", photoFile);
      photoUploadForm.append("name", uuid.v4() as string);

      const updatedResponse = await api.post("sigtrans", photoUploadForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return updatedResponse.data;
    });
    const responses = await Promise.all(promises);
    return responses;
  } catch (error) {
    console.log("Algo deu errado ao fazer upload da imagem");
    console.log(error);
  }
}

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
      const newFileUri = `${FileSystem.documentDirectory}${fileName}`;

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

export async function saveExternalImagesToStorage(
  images: ExternalImageProps[]
) {
  try {
    const promises: Promise<ImageSelectedProps>[] = images.map(
      async (image) => {
        const fileName = image.uri.substring(
          image.uri.lastIndexOf("/") + 1
        ) as string;
        const newFileUri = `${FileSystem.documentDirectory}${fileName}`;
        console.log("new file", newFileUri);
        await FileSystem.downloadAsync(image.uri, newFileUri);

        const imageSelected: ImageSelectedProps = {
          id: uuid.v4() as string,
          name: fileName,
          documentId,
          uri: newFileUri,
        };
        return imageSelected;
      }
    );
    const responses = await Promise.all(promises);
    return responses;
  } catch (error) {
    console.log(error);
    throw new Error("Algo deu errado ao salvar a imagem");
  }
}
