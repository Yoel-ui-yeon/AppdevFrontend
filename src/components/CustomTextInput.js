import { Text, TextInput, View } from 'react-native';

const CustomTextInput = ({
  placeholder,
  label,
  labelStyle,
  value,
  onChangeText,
  containerStyle,
  textStyle,
  keyboardType,
  autoCapitalize = 'none',
  secureTextEntry = false,
}) => {
  const setValue = onChangeText ?? value;

  return (
    <View style={containerStyle}>
      {label ? <Text style={labelStyle}>{label}</Text> : null}
      <TextInput
        placeholder={placeholder}
        onChangeText={setValue}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        style={[textStyle, { width: '100%' }]}
      />
    </View>
  );
};

export default CustomTextInput;
