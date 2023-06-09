import { useEffect, useState, useCallback, useMemo } from "react";
import { Alert, Modal, ScrollView, Text, TextInput, View } from "react-native";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Label } from "@/components/Label";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { InputField } from "@/components/InputField";
import { TitleWrapper } from "@/components/TitleWrapper";
import { SelectItems } from "@/components/Select/SelectItems";
import { VariableInputField } from "@/components/VariableInputField";

import { useNavigation } from "@react-navigation/native";
import { useDynamicRefs } from "@/utils/useDynamicRefs";
import {
  getCurrentLocation,
  getPermissions,
  getReverseGeocodeAsync,
} from "@/utils/locationHelper";
import { ACCESSORY, DAMAGE } from "@/utils/defaultData";

import { AdditionalDataDTO } from "@/dtos/AdditionalDataDTO";
import { useSecondStore } from "@/stores/secondStore";
import { useSelectItemStore } from "@/stores/selectItemStore";

import { useRealm } from "@/database";
import { Accessory } from "@/database/schemas/Accessory";
import { Damage } from "@/database/schemas/Damage";
import { useNetInfo } from "@react-native-community/netinfo";

type FormData = AdditionalDataDTO & {
  address: string;
  observations: string;
};

export type SelectItemProps = {
  id: string;
  name: string;
  damage: string;
  other: boolean;
};

type SyncProps = {
  id: string;
  name: string;
};

const schema = yup.object().shape({
  driverName: yup
    .string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  driverLicenseOrId: yup
    .string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  driverEmail: yup.string().trim().email("Coloque um e-mail válido"),
  agentName: yup
    .string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  agentId: yup
    .string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  address: yup
    .string()
    .trim()
    .required(
      "Campo obrigatório, se não souber o endereço, aperte o botão de localização para obter automaticamente"
    ),
  observations: yup.string().trim(),
});

export function SecondInformation() {
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [damageValue, setDamageValue] = useState<SyncProps[]>([]);
  const [inputHeight, setInputHeight] = useState(48);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectItemProps[]>([]);

  const { navigate } = useNavigation();
  const { secondData, setSecondData } = useSecondStore();
  const { setSelectItem } = useSelectItemStore();

  const realm = useRealm();
  const netInfo = useNetInfo();

  const {
    control,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const ids = useMemo(
    () => [
      "driverName",
      "driverLicenseOrId",
      "driverEmail",
      "agentName",
      "agentId",
      "address",
      "observations",
    ],
    []
  );
  const refs = useDynamicRefs(ids);

  function removeItem(id: string) {
    setSelectedItem((prev) => prev.filter((item) => item.id !== id));
  }

  function checkForNewAccessory(currentAccessory: SyncProps[]) {
    if (selectedItem.length === 0) return currentAccessory;
    const newSelectedItem = currentAccessory
      .map((itemA) => ({
        id: itemA.id,
        name: itemA.name,
      }))
      .concat(
        selectedItem.filter(
          (itemB) => !currentAccessory.some((itemA) => itemA.id === itemB.id)
        )
      )
      .map(({ id, name }) => ({ id, name }));
    return newSelectedItem;
  }

  const saveData = useCallback(
    (data: Partial<FormData>) => {
      const newData = {
        driverName: data.driverName || "",
        driverLicenseOrId: data.driverLicenseOrId || "",
        driverEmail: data.driverEmail || "",
        agentName: data.agentName || "",
        agentId: data.agentId || "",
        address: data.address || "",
        observations: data.observations || "",
        latitude,
        longitude,
        checkList: selectedItem,
      };
      setSecondData(newData);
      navigate("Gallery");
    },
    [navigate, latitude, longitude, selectedItem]
  );

  async function handleGetLocation() {
    try {
      setIsLoading(true);
      const location = await getCurrentLocation();
      const { latitude, longitude } = location.coords;
      setLatitude(latitude.toString());
      setLongitude(longitude.toString());
      let street = "";
      if (netInfo.isConnected) {
        const response = await getReverseGeocodeAsync({ latitude, longitude });
        street = response ? response : "";
      }
      setValue("address", street);
    } catch (error) {
      Alert.alert(
        "Aviso!",
        "Algo deu errado e não foi possível obter a localização"
      );
      console.log(error);
    } finally {
      clearErrors("address");
      setIsLoading(false);
    }
  }

  function checkItems() {
    if (Object.keys(secondData).length === 0) return;
    Object.keys(secondData).forEach((key) => {
      const propertyKey = key as keyof FormData;
      setValue(propertyKey, secondData[propertyKey]);
    });
    setSelectedItem(secondData.checkList);
    setLatitude(secondData.latitude);
    setLongitude(secondData.longitude);
  }

  function setDefaultValues() {
    const accessoryDb = realm.objects(Accessory).map((item) => ({
      id: item._id.toString(),
      name: item.name,
    }));
    const accessory = checkForNewAccessory(
      accessoryDb.length > 0 ? accessoryDb : ACCESSORY
    );
    setSelectItem(accessory);
    const damageDb = realm.objects(Damage).map((item) => ({
      id: item._id.toString(),
      name: item.name,
    }));
    setDamageValue(damageDb.length > 0 ? damageDb : DAMAGE);
  }

  useEffect(() => {
    getPermissions();
    checkItems();
  }, []);

  useEffect(() => {
    setDefaultValues();
  }, [selectedItem]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName("accessory");
      mutableSubs.add(realm.objects(Accessory), {
        name: "accessory",
      });
    });
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName("damage");
      mutableSubs.add(realm.objects(Damage), {
        name: "damage",
      });
    });
    setDefaultValues();
  }, [realm]);
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
        <TitleWrapper title="Informações Adicionais" />
        <Label
          title="Nome do motorista:"
          type="first"
          children={
            <InputField
              name="driverName"
              placeholder="Nome do motorista"
              control={control}
              error={errors && (errors.driverName?.message as string)}
              keyboardType="default"
              inputRef={refs.driverName}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.driverLicenseOrId.current?.focus()}
            />
          }
        />
        <Label
          title="CNH ou RG:"
          children={
            <InputField
              name="driverLicenseOrId"
              placeholder="CNH ou RG do motorista"
              control={control}
              error={errors && (errors.driverLicenseOrId?.message as string)}
              keyboardType="visible-password"
              uppercase
              inputRef={refs.driverLicenseOrId}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.driverEmail.current?.focus()}
            />
          }
        />
        <Label
          title="E-mail:"
          children={
            <InputField
              name="driverEmail"
              placeholder="E-mail do motorista"
              control={control}
              error={errors && (errors.driverEmail?.message as string)}
              keyboardType="email-address"
              autoCapitalize="none"
              inputRef={refs.driverEmail}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.agentName.current?.focus()}
            />
          }
        />
        <Label
          title="Nome do agente:"
          children={
            <InputField
              name="agentName"
              placeholder="Nome do agente"
              control={control}
              error={errors && (errors.agentName?.message as string)}
              keyboardType="default"
              inputRef={refs.agentName}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.agentId.current?.focus()}
            />
          }
        />
        <Label
          title="Matricula do agente:"
          type="last"
          children={
            <InputField
              name="agentId"
              placeholder="Matricula do agente"
              control={control}
              error={errors && (errors.agentId?.message as string)}
              keyboardType="visible-password"
              uppercase
              inputRef={refs.agentId}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.address.current?.focus()}
            />
          }
        />
        <TitleWrapper title="Localização" />
        <Label
          title="Endereço da ocorrência:"
          type="first"
          children={
            <InputField
              name="address"
              placeholder="Endereço da ocorrência"
              control={control}
              error={errors && (errors.address?.message as string)}
              keyboardType="default"
              inputRef={refs.address}
              icon={
                <IconButton
                  iconName="location-sharp"
                  isLoading={isLoading}
                  onSubmit={handleGetLocation}
                />
              }
            />
          }
        />
        <View className="flex-row px-4 pb-8 justify-between">
          <View className="flex-1 pt-3 mr-2">
            <Text className="font-bold text-base">Latitude: </Text>
            <TextInput
              className="bg-gray-100 text-black border-2 border-gray-200 rounded-md pl-4 py-2 my-2 h-12 w-full"
              value={latitude}
              editable={false}
            />
          </View>
          <View className="flex-1 pt-3 ml-2">
            <Text className="font-bold text-base">Longitude: </Text>
            <TextInput
              className="bg-gray-100 text-black border-2 border-gray-200 rounded-md pl-4 py-2 my-2 h-12 w-full"
              value={longitude}
              editable={false}
            />
          </View>
        </View>
        <TitleWrapper title="Listagem de Itens" />
        <View className="flex-1 items-center pt-8 pb-2">
          <View className="w-[70%]">
            <Button
              color="bg-teal-600"
              title="Adicionar ou editar itens"
              onPress={() => setModalVisible(true)}
            />
          </View>
        </View>
        <View className="flex-1 px-4 my-5">
          {selectedItem.map((item) => (
            <View key={item.id} className="flex-1 my-2">
              <Text className="font-bold text-base">{`${item.name}:`}</Text>
              <View className="relative flex-row justify-center my-2 h-12">
                <TextInput
                  className="
                  bg-gray-100
                  border-2
                  border-gray-200
                  rounded-md
                  py-3
                  pl-4
                  pr-14
                  w-full
                  font-regular
                  text-input
                  text-black
                "
                  value={item.damage}
                  editable={false}
                />
                <IconButton
                  iconName="trash"
                  color="bg-red-600"
                  onSubmit={() => removeItem(item.id)}
                />
              </View>
            </View>
          ))}
        </View>
        <TitleWrapper title="Observações" />
        <View className="flex-1 px-4 my-5">
          <VariableInputField
            inputRef={refs.observations}
            name="observations"
            placeholder="Observações"
            control={control}
            changedHeight={inputHeight}
            multiline
            onContentSizeChange={(event) =>
              setInputHeight(event.nativeEvent.contentSize.height + 30)
            }
          />
        </View>
        <View className="flex-row justify-between px-4 pt-8">
          <View className="w-[40%]">
            <Button title="Anterior" onPress={() => navigate("First")} />
          </View>
          <View className="w-[40%]">
            <Button title="Próximo" onPress={handleSubmit(saveData)} />
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <SelectItems
          data={selectedItem}
          damageValue={damageValue}
          onPress={setSelectedItem}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
}
