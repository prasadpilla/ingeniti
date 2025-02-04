import React, { useState } from 'react';
import { View, StyleSheet, Text, ViewStyle, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { TextInput as Input, useTheme } from 'react-native-paper';

interface FormInputProps extends React.ComponentProps<typeof Input> {
  hasError?: boolean;
  errorText?: string;
  isPassword?: boolean;
  required?: boolean;
  containerStyles?: ViewStyle;
}

const FormInput: React.FC<FormInputProps> = ({ errorText, hasError, isPassword, containerStyles, label, ...props }) => {
  const theme = useTheme();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return (
    <View style={[styles.container, containerStyles]}>
      <Input
        style={[{ backgroundColor: theme.colors.surface }]}
        selectionColor={theme.colors.primary}
        placeholderTextColor={theme.colors.mutedForeground}
        underlineColor="transparent"
        mode="outlined"
        label={label}
        error={!!errorText || hasError}
        secureTextEntry={isPassword && !passwordVisible}
        right={
          isPassword ? (
            <Input.Icon
              icon={passwordVisible ? 'eye-off' : 'eye'}
              color="#999"
              onPress={togglePasswordVisibility}
              forceTextInputFocus={false}
            />
          ) : (
            props.right
          )
        }
        onBlur={(e) => handleBlur(e)}
        {...props}
      />
      {errorText && <Text style={[styles.error, { color: theme.colors.onErrorContainer }]}>{errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  error: {
    fontSize: 12,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default FormInput;
