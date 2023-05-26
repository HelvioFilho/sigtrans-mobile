import { useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ACCESSORY, DAMAGE } from "@/utils/defaultData";
import { IconButton } from "../IconButton";
import { Button } from "../Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputField } from "../InputField";
import { SelectItemProps } from "@/screens/newScreens/SecondInformation";

type SelectItemsProps = {
  onPress: (data: SelectItemProps[]) => void;
  onClose: () => void;
  data: SelectItemProps[];
};

type FormData = {
  customAccessory: string;
};

type ModalItemProps = {
  id: string;
  name: string;
};

export function SelectItems({ data, onPress, onClose }: SelectItemsProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [customDamage, setCustomDamage] = useState("");
  const [customErrorDamage, setCustomErrorDamage] = useState(false);
  const [modalItem, setModalItem] = useState<ModalItemProps>(
    {} as ModalItemProps
  );
  const [filteredAccessory, setFilteredAccessory] = useState(ACCESSORY);
  const [expandedId, setExpandedId] = useState<Record<string, boolean>>({});
  const [selectedOption, setSelectedOption] = useState<
    Record<string, { damage: string; isOther: boolean }>
  >(
    data.reduce<Record<string, { damage: string; isOther: boolean }>>(
      (acc, item) => {
        if (item.id && item.damage) {
          acc[item.id] = { damage: item.damage, isOther: item.other };
        }
        return acc;
      },
      {}
    )
  );
  const [selectedAccessory, setSelectedAccessory] =
    useState<SelectItemProps[]>(data);

  const schema = yup.object().shape({
    customAccessory: yup
      .string()
      .required("Esse campo não pode ser vazio!")
      .test(
        "unique-accessory",
        "Esse acessório já foi adicionado!",
        (value) => {
          return !filteredAccessory.some(
            (accessory) =>
              accessory.name.toLowerCase().trim() ===
              value?.toLowerCase().trim()
          );
        }
      ),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function addCustomAccessory(data: Partial<FormData>) {
    if (data.customAccessory) {
      const newAccessory = {
        id: String(Math.random()),
        name: data.customAccessory.trim(),
      };
      setFilteredAccessory([newAccessory, ...filteredAccessory]);
      setValue("customAccessory", "");
    }
  }

  function toggleExpanded(id: string) {
    setExpandedId((prevState) => {
      if (prevState[id]) {
        return { ...prevState, [id]: false };
      } else {
        return { ...prevState, [id]: true };
      }
    });
  }

  function selectOption(
    id: string,
    name: string,
    option: string,
    other: boolean
  ) {
    setSelectedOption((prevState) => {
      if (prevState[id] && prevState[id].damage === option) {
        return { ...prevState, [id]: { damage: "", isOther: false } };
      } else {
        return {
          ...prevState,
          [id]: {
            damage: option,
            isOther: other,
          },
        };
      }
    });
    toggleExpanded(id);
    setSelectedAccessory((prevState) => {
      const existingSelectionIndex = prevState.findIndex(
        (item) => item.id === id
      );
      if (existingSelectionIndex !== -1) {
        return prevState.filter((_, index) => index !== existingSelectionIndex);
      } else {
        return [
          ...prevState,
          {
            id,
            name,
            damage: option,
            other,
          },
        ];
      }
    });
  }

  return (
    <View className="flex-1 px-4 pt-[10%] pb-4 bg-slate-50">
      <TouchableOpacity
        className="h-10 w-10 absolute top-5 right-2 z-50"
        activeOpacity={0.8}
        onPress={onClose}
      >
        <Ionicons name="close-circle-outline" size={33} color="black" />
      </TouchableOpacity>
      <Text className="text-subtitle font-bold mt-2 w-[90%]">
        Selecione abaixo ou adicione um item personalizado:
      </Text>
      <View className="flex-row items-center my-5">
        <InputField
          name="customAccessory"
          placeholder="Adicione um novo acessório"
          control={control}
          error={errors && (errors.customAccessory?.message as string)}
          icon={
            <IconButton
              iconName="add"
              onSubmit={handleSubmit(addCustomAccessory)}
            />
          }
        />
      </View>
      <FlatList
        data={filteredAccessory}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="bg-teal-600 my-2 rounded-lg">
            <TouchableOpacity
              className="border rounded-lg bg-white"
              activeOpacity={0.8}
              onPress={() => toggleExpanded(item.id)}
            >
              <View className="w-full bg-gray-300 py-3 px-4 rounded-lg">
                <View className="flex-row items-center py-1">
                  <Text className="font-regular text-base">{item.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
            {expandedId[item.id] &&
              DAMAGE.map((damage) => (
                <TouchableOpacity
                  key={damage.id}
                  className={`
                    ${
                      (selectedOption[item.id] &&
                        selectedOption[item.id]?.damage === damage.name) ||
                      (damage.name === "Outro" &&
                        selectedOption[item.id]?.isOther)
                        ? "border-white border-2 bg-teal-600"
                        : "border bg-white"
                    } 
                    p-3 
                    my-2 
                    mx-4 
                    rounded-lg
                    flex-row
                    justify-between
                    align-center
                    `}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (damage.name === "Outro") {
                      if (selectedOption[item.id]?.isOther) {
                        selectOption(
                          item.id,
                          item.name,
                          selectedOption[item.id].damage,
                          false
                        );
                      } else {
                        setModalItem({
                          id: item.id,
                          name: item.name,
                        });
                        setModalVisible(true);
                      }
                    } else {
                      selectOption(item.id, item.name, damage.name, false);
                    }
                  }}
                >
                  <Text
                    className={`${
                      (selectedOption[item.id] &&
                        selectedOption[item.id]?.damage === damage.name) ||
                      (damage.name === "Outro" &&
                        selectedOption[item.id]?.isOther)
                        ? "text-white"
                        : ""
                    } 
                      font-regular 
                      text-base
                      `}
                  >
                    {selectedOption[item.id]?.isOther && damage.name === "Outro"
                      ? "Outro - " + selectedOption[item.id]?.damage
                      : damage.name}
                  </Text>
                  {(selectedOption[item.id] &&
                    selectedOption[item.id]?.damage === damage.name) ||
                  (damage.name === "Outro" &&
                    selectedOption[item.id]?.isOther) ? (
                    <Ionicons name="trash" size={24} color="white" />
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
              ))}
            {!expandedId[item.id] && selectedOption[item.id]?.damage && (
              <View className="flex-row items-center py-2 px-2">
                <Text className="font-regular text-base text-white">
                  {`Condição: ${
                    selectedOption[item.id]?.isOther
                      ? "Outro - " + selectedOption[item.id]?.damage
                      : selectedOption[item.id]?.damage
                  }`}
                </Text>
              </View>
            )}
          </View>
        )}
      />
      <Button
        className="mt-5"
        title="Salvar escolhas"
        onPress={() => {
          onPress(selectedAccessory);
          onClose();
        }}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-[90%] justify-center items-center rounded-lg">
            <Text className="text-center text-base font-bold mt-5">
              Digite abaixo o estado do item:
            </Text>
            <View className="my-5 w-[90%]">
              <TextInput
                className={`bg-gray-100
                ${customErrorDamage ? "border-red-600" : "border-gray-600"}
                  border-2
                  rounded-md
                  py-2
                  px-4 
                  font-regular
                  text-input
                `}
                onBlur={() => {
                  setCustomErrorDamage(false);
                }}
                placeholder="Digite um estado que não esteja na lista"
                onChangeText={setCustomDamage}
                value={customDamage}
              />
              {customErrorDamage && (
                <Text className="pl-1 text-red-600 text-error mt-2">
                  Esse campo não pode ser vazio!
                </Text>
              )}
            </View>
            <View className="flex-row w-[90%] justify-between items-center mb-5">
              <View className="w-[40%]">
                <Button
                  title="Cancelar"
                  color="bg-red-500"
                  onPress={() => {
                    setModalVisible(false);
                  }}
                />
              </View>
              <View className="w-[40%]">
                <Button
                  title="Enviar"
                  onPress={() => {
                    if (customDamage !== "") {
                      selectOption(
                        modalItem.id,
                        modalItem.name,
                        customDamage.trim(),
                        true
                      );
                      setCustomDamage("");
                    } else {
                      setCustomErrorDamage(true);
                    }
                    setModalVisible(false);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
