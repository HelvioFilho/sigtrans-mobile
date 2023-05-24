import { Keyboard, ScrollView, Text, View } from "react-native";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "@/components/InputField";
import { IconButton } from "@/components/IconButton";
import { useState } from "react";
import { Modal } from "react-native";
import { SelectPark } from "@/components/Select/SelectPark";

const schema = Yup.object().shape({});

export function FirstInformation() {
  const [modalVisible, setModalVisible] = useState(false);

  const {
    control,
    clearErrors,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleSelect(field: string[], value: string[]) {
    setModalVisible(false);
    Keyboard.dismiss();
    clearErrors(field);
    for (let i = 0; i < field.length; i++) {
      setValue(field[i], value[i]);
    }
  }

  return (
    <View className="flex-1 mt-5">
      <Text className="mt-[15%] mb-1 self-center font-bold text-title pb-4">
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
        <View className="items-center">
          <Text className="font-bold text-subtitle">Reboque</Text>
        </View>
        <View className="pt-8 px-4">
          <Text className="font-bold text-base">Placa do Reboque:</Text>
          <InputField
            name="plateTowTruck"
            placeholder="Digite a placa do reboque"
            control={control}
            error={errors && (errors.plateTowTruck?.message as string)}
            keyboardType="visible-password"
          />
        </View>
        <View className="pt-3 pb-8 px-4">
          <Text className="font-bold text-base">Nome do Motorista:</Text>
          <InputField
            name="driver"
            placeholder="Digite o nome do motorista"
            control={control}
            error={errors && (errors.driver?.message as string)}
            keyboardType="default"
          />
        </View>
        <View className="items-center">
          <Text className="font-bold text-subtitle">Parque de Retenção</Text>
        </View>
        <View className="pt-8 px-4">
          <Text className="font-bold text-base">Nome:</Text>
          <InputField
            name="name"
            placeholder="Digite o nome do parque"
            control={control}
            error={errors && (errors.name?.message as string)}
            icon={
              <IconButton
                iconName="search"
                onSubmit={() => {
                  setModalVisible(true);
                }}
              />
            }
          />
        </View>
        <View className="pt-4 px-4">
          <Text className="font-bold text-base">Endereço:</Text>
          <InputField
            name="address"
            placeholder="Digite o endereço do parque"
            control={control}
            error={errors && (errors.address?.message as string)}
          />
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <SelectPark
            onPress={handleSelect}
            onClose={() => setModalVisible(false)}
          />
        </Modal>
      </ScrollView>
    </View>
  );
}
