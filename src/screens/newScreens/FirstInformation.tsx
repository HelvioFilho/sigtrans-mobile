import { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard, ScrollView, Text, View, Modal } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { Label } from "@/components/Label";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select/Select";
import { InputField } from "@/components/InputField";
import { IconButton } from "@/components/IconButton";
import { SelectPark } from "@/components/Select/SelectPark";
import { TitleWrapper } from "@/components/TitleWrapper";

import { useDynamicRefs } from "@/utils/useDynamicRefs";
import { SPECIES, VEHICLETYPE } from "@/utils/defaultData";

import { RetentionParkDTO } from "@/dtos/RetentionParkDTO";
import { TowTruckDTO } from "@/dtos/TowTruckDTO";
import { VehicleDTO } from "@/dtos/VehicleDTO";

import { useNavigation } from "@react-navigation/native";
import { useFirstStore } from "@/stores/firstStore";

const schema = Yup.object().shape({
  plateTowTruck: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  driver: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  name: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  address: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  plate: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  chassi: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  brand: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  model: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  uf: Yup.string()
    .trim()
    .required("Campo obrigatório, coloque a sigla do estado. Ex: PA"),
  type: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  species: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  year: Yup.string().trim().required("Campo obrigatório. Ex: 2021"),
});

type FormData = RetentionParkDTO & TowTruckDTO & VehicleDTO;

export function FirstInformation() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isRetentionPark, setIsRetentionPark] = useState(false);
  const [isType, setIsType] = useState(false);

  const { navigate } = useNavigation();
  const { firstData, setFirstData } = useFirstStore();

  const {
    control,
    clearErrors,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const ids = useMemo(
    () => [
      "driver",
      "name",
      "address",
      "plate",
      "chassi",
      "brand",
      "model",
      "uf",
      "type",
      "species",
      "year",
    ],
    []
  );

  const refs = useDynamicRefs(ids);

  const saveData = useCallback(
    (data: Partial<FormData>) => {
      setFirstData(data);
      navigate("New", { id: 1 });
    },
    [navigate]
  );

  function resetSelect() {
    setIsRetentionPark(false);
    setIsType(false);
  }

  function handleSelect(field: string[], value: string[], target: string) {
    setModalVisible(false);
    Keyboard.dismiss();
    clearErrors(field);
    setTimeout(() => {
      if (refs[target].current) {
        refs[target].current?.focus();
      }
    }, 400);
    for (let i = 0; i < field.length; i++) {
      setValue(field[i], value[i]);
    }
    resetSelect();
  }

  function checkValuesAreAlreadyFilled() {
    Object.keys(firstData).forEach((key) => {
      const propertyKey = key as keyof FormData;
      setValue(key, firstData[propertyKey]);
    });
  }

  useEffect(() => {
    checkValuesAreAlreadyFilled();
  }, []);

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
        <TitleWrapper title="Reboque" />
        <Label
          title="Placa do Reboque:"
          type="first"
          children={
            <InputField
              name="plateTowTruck"
              placeholder="Placa do reboque"
              control={control}
              error={errors && (errors.plateTowTruck?.message as string)}
              keyboardType="visible-password"
              uppercase
              blurOnSubmit={false}
              onSubmitEditing={() => refs.driver.current?.focus()}
            />
          }
        />
        <Label
          title="Nome do motorista: "
          type="last"
          children={
            <InputField
              name="driver"
              placeholder="Nome do motorista"
              control={control}
              error={errors && (errors.driver?.message as string)}
              inputRef={refs.driver}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.name.current?.focus()}
            />
          }
        />
        <TitleWrapper title="Parque de Retenção" />
        <Label
          title="Nome do Parque:"
          type="first"
          children={
            <InputField
              name="name"
              placeholder="Nome do parque"
              control={control}
              error={errors && (errors.name?.message as string)}
              inputRef={refs.name}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.address.current?.focus()}
              icon={
                <IconButton
                  iconName="search"
                  onSubmit={() => {
                    setIsRetentionPark(true);
                    setModalVisible(true);
                  }}
                />
              }
            />
          }
        />
        <Label
          title="Endereço:"
          type="last"
          children={
            <InputField
              name="address"
              control={control}
              placeholder="Endereço do parque"
              error={errors && (errors.address?.message as string)}
              inputRef={refs.address}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.model.current?.focus()}
            />
          }
        />
        <TitleWrapper title="Informações do Veículo" />
        <Label
          title="Modelo:"
          type="first"
          children={
            <InputField
              name="model"
              control={control}
              placeholder="Modelo do veículo"
              error={errors && (errors.model?.message as string)}
              inputRef={refs.model}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.plate.current?.focus()}
            />
          }
        />
        <Label
          title="Placa:"
          children={
            <InputField
              name="plate"
              control={control}
              placeholder="Placa do veículo"
              error={errors && (errors.plate?.message as string)}
              keyboardType="visible-password"
              uppercase
              inputRef={refs.plate}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.chassi.current?.focus()}
            />
          }
        />
        <Label
          title="Chassi:"
          children={
            <InputField
              name="chassi"
              control={control}
              placeholder="Chassi do veículo"
              error={errors && (errors.chassi?.message as string)}
              keyboardType="visible-password"
              uppercase
              inputRef={refs.chassi}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.brand.current?.focus()}
            />
          }
        />
        <Label
          title="Marca:"
          children={
            <InputField
              name="brand"
              control={control}
              placeholder="Marca do Veículo"
              error={errors && (errors.brand?.message as string)}
              inputRef={refs.brand}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.uf.current?.focus()}
            />
          }
        />
        <Label
          title="UF:"
          children={
            <InputField
              name="uf"
              control={control}
              placeholder="Tipo de Veículo"
              error={errors && (errors.uf?.message as string)}
              uppercase
              inputRef={refs.uf}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.type.current?.focus()}
            />
          }
        />
        <Label
          title="Tipo:"
          children={
            <InputField
              name="type"
              control={control}
              placeholder="Tipo de Veículo"
              error={errors && (errors.type?.message as string)}
              inputRef={refs.type}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.species.current?.focus()}
              icon={
                <IconButton
                  iconName="search"
                  onSubmit={() => {
                    setIsType(true);
                    setModalVisible(true);
                  }}
                />
              }
            />
          }
        />
        <Label
          title="Espécie:"
          children={
            <InputField
              name="species"
              control={control}
              placeholder="Espécie de Veículo"
              error={errors && (errors.species?.message as string)}
              inputRef={refs.species}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.year.current?.focus()}
              icon={
                <IconButton
                  iconName="search"
                  onSubmit={() => {
                    setModalVisible(true);
                  }}
                />
              }
            />
          }
        />
        <Label
          title="Ano do veículo:"
          type="last"
          children={
            <InputField
              name="year"
              control={control}
              keyboardType="number-pad"
              placeholder="Ano do Veículo"
              error={errors && (errors.year?.message as string)}
              inputRef={refs.year}
            />
          }
        />
        <View className="flex-row justify-end pr-4">
          <View className="w-[40%]">
            <Button title="Próximo" onPress={handleSubmit(saveData)} />
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          {isRetentionPark ? (
            <SelectPark
              onPress={handleSelect}
              onClose={() => {
                resetSelect();
                setModalVisible(false);
              }}
            />
          ) : (
            <Select
              target={isType ? "species" : "year"}
              type={isType ? "type" : "species"}
              onPress={handleSelect}
              onClose={() => {
                resetSelect();
                setModalVisible(false);
              }}
              data={isType ? VEHICLETYPE : SPECIES}
            />
          )}
        </Modal>
      </ScrollView>
    </View>
  );
}
