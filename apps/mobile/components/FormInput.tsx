import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { TextInput as Input } from 'react-native-paper';

import { Themes } from '../styles/themes';

interface FormInputProps extends React.ComponentProps<typeof Input> {
  errorText?: string;
  isPassword?: boolean;
  required?: boolean;
  containerStyles?: ViewStyle;
}

const FormInput: React.FC<FormInputProps> = ({
  errorText,
  isPassword,
  containerStyles,
  label,
  ...props
}) => {
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
        style={styles.input}
        selectionColor={Themes.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        label={label}
        error={!!errorText}
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
      {errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  input: {
    backgroundColor: Themes.colors.surface,
  },
  error: {
    fontSize: 12,
    color: Themes.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default FormInput;
