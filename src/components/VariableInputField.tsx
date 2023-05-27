import { TextInputProps, View } from "react-native";
import { Control, Controller } from "react-hook-form";
import { TextInput } from "react-native";

type VariableInputFieldProps = TextInputProps & {
  name: string;
  control: Control<any>;
  changedHeight: number;
  inputRef?: React.Ref<any> | null;
};

export function VariableInputField({
  name,
  control,
  changedHeight,
  inputRef,
  ...rest
}: VariableInputFieldProps) {
  const height = `${changedHeight}px`;
  return (
    <View className="w-full">
      <View className={`flex-row justify-center my-2 h-[${height}]`}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TextInput
              ref={inputRef}
              className={`
              bg-gray-100 
              border-2 
              border-gray-600 
              h-[${height}]
              rounded-md 
              py-3 
              pl-4
              pr-4 
              w-full 
              font-regular 
              text-input
            `}
              onChangeText={onChange}
              value={value}
              {...rest}
            />
          )}
        />
      </View>
    </View>
  );
}
