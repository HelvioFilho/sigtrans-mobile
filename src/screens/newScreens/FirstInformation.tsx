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
import { RETENTIONPARK, SPECIES, VEHICLETYPE } from "@/utils/defaultData";

import { RetentionParkDTO } from "@/dtos/RetentionParkDTO";
import { TowTruckDTO } from "@/dtos/TowTruckDTO";
import { VehicleDTO } from "@/dtos/VehicleDTO";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useFirstStore } from "@/stores/firstStore";
import { useRealm } from "@/database";
import { VehicleType } from "@/database/schemas/VehicleType";
import { Species } from "@/database/schemas/Species";
import { RetentionPark } from "@/database/schemas/RetentionPark";

const schema = Yup.object().shape({
  plateTowTruck: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  driverTowTruck: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  retentionParkName: Yup.string()
    .trim()
    .required("Campo obrigatório, caso não possua, escreva: Não consta"),
  retentionParkAddress: Yup.string()
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

type DefaultValue = {
  id: string;
  name: string;
};

export type RetentionParkDefaultValue = {
  id: string;
  name: string;
  address: string;
};

export function FirstInformation() {
  const [vehicleType, setVehicleType] = useState<DefaultValue[]>([]);
  const [species, setSpecies] = useState<DefaultValue[]>([]);
  const [retentionPark, setRetentionPark] = useState<
    RetentionParkDefaultValue[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRetentionPark, setIsRetentionPark] = useState(false);
  const [isType, setIsType] = useState(false);

  const realm = useRealm();

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
      "plateTowTruck",
      "driverTowTruck",
      "retentionParkName",
      "retentionParkAddress",
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
      navigate("Second");
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
    if (Object.keys(firstData).length === 0) return;
    Object.keys(firstData).forEach((key) => {
      const propertyKey = key as keyof FormData;
      setValue(key, firstData[propertyKey]);
    });
  }

  function setDefaultValues() {
    const vehicleType = realm.objects(VehicleType).map((item) => ({
      id: item._id.toString(),
      name: item.name,
    }));
    const species = realm.objects(Species).map((item) => ({
      id: item._id.toString(),
      name: item.name,
    }));
    const retentionPark = realm.objects(RetentionPark).map((item) => ({
      id: item._id.toString(),
      name: item.name,
      address: item.address,
    }));
    setVehicleType(vehicleType.length > 0 ? vehicleType : VEHICLETYPE);
    setSpecies(species.length > 0 ? species : SPECIES);
    setRetentionPark(retentionPark.length > 0 ? retentionPark : RETENTIONPARK);
  }

  useEffect(() => {
    checkValuesAreAlreadyFilled();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setDefaultValues();
    }, [])
  );

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName("vehicleType");
      mutableSubs.removeByName("species");
      mutableSubs.removeByName("retentionPark");
      mutableSubs.add(realm.objects(VehicleType), {
        name: "vehicleType",
      });
      mutableSubs.add(realm.objects(Species), {
        name: "species",
      });
      mutableSubs.add(realm.objects(RetentionPark), {
        name: "retentionPark",
      });
    });
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
        <TitleWrapper title="Reboque" />
        <Label
          title="Placa do Reboque:"
          type="first"
          children={
            <InputField
              name="plateTowTruck"
              inputRef={refs.plateTowTruck}
              placeholder="Placa do reboque"
              control={control}
              error={errors && (errors.plateTowTruck?.message as string)}
              keyboardType="visible-password"
              uppercase
              blurOnSubmit={false}
              onSubmitEditing={() => refs.driverTowTruck.current?.focus()}
            />
          }
        />
        <Label
          title="Nome do motorista: "
          type="last"
          children={
            <InputField
              name="driverTowTruck"
              placeholder="Nome do motorista"
              control={control}
              error={errors && (errors.driverTowTruck?.message as string)}
              inputRef={refs.driverTowTruck}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.retentionParkName.current?.focus()}
            />
          }
        />
        <TitleWrapper title="Parque de Retenção" />
        <Label
          title="Nome do Parque:"
          type="first"
          children={
            <InputField
              name="retentionParkName"
              placeholder="Nome do parque"
              control={control}
              error={errors && (errors.retentionParkName?.message as string)}
              inputRef={refs.retentionParkName}
              blurOnSubmit={false}
              onSubmitEditing={() => refs.retentionParkAddress.current?.focus()}
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
              name="retentionParkAddress"
              control={control}
              placeholder="Endereço do parque"
              error={errors && (errors.retentionParkAddress?.message as string)}
              inputRef={refs.retentionParkAddress}
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
              maxLength={4}
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
              retentionPark={retentionPark}
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
              data={isType ? vehicleType : species}
            />
          )}
        </Modal>
      </ScrollView>
    </View>
  );
}
