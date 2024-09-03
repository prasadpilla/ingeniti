import React, { useState } from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { TextInput as Input } from 'react-native-paper';

import { Themes } from '../styles/themes';

type Props = React.ComponentProps<typeof Input> & {
  errorText?: string;
  isPassword?: boolean;
  required?: boolean;
  containerStyles?: ViewStyle;
};

const TextInput = ({
  errorText,
  isPassword,
  required,
  containerStyles,
  label,
  ...props
}: Props) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleBlur = (e) => {
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const showError = false; // required && props.value (Need clarity on how to show validation errors)
  const displayedErrorText = showError ? `${label} is required` : errorText;

  return (
    <View style={[styles.container, containerStyles]}>
      <Input
        style={styles.input}
        selectionColor={Themes.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        label={label}
        error={showError || !!errorText}
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
      {displayedErrorText ? <Text style={styles.error}>{displayedErrorText}</Text> : null}
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
    fontSize: 14,
    color: Themes.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default TextInput;
