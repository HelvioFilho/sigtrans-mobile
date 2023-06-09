import { Text, TextInputProps, View } from "react-native";
import { Control, Controller } from "react-hook-form";
import { TextInput } from "react-native";

type InputFieldProps = TextInputProps & {
  name: string;
  control: Control<any>;
  error: string | undefined;
  icon?: React.ReactNode;
  inputRef?: React.Ref<any> | null;
  uppercase?: boolean;
};

export function InputField({
  name,
  control,
  error,
  icon,
  inputRef,
  uppercase = false,
  ...rest
}: InputFieldProps) {
  return (
    <View className="w-full">
      <View className="flex-row justify-center my-2 h-12">
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TextInput
              ref={inputRef}
              className={`
                bg-gray-100 
                border-2 
                ${!!error ? "border-red-600" : "border-gray-600"} 
                h-12 
                rounded-md 
                py-3 
                pl-4
                ${icon ? "pr-14" : "pr-4"} 
                w-full 
                font-regular 
                text-input
              `}
              onChangeText={(text) => {
                const textToChange = uppercase ? text.toUpperCase() : text;
                onChange(textToChange);
              }}
              value={value}
              {...rest}
            />
          )}
        />
        {icon && icon}
      </View>
      {error && (
        <Text className="font-regular text-red-600 text-error">{error}</Text>
      )}
    </View>
  );
}
