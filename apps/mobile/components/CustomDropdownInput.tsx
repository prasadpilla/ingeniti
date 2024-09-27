import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

export const CustomDropdownInput = (props: TextInputProps) => {
  return (
    <TextInput {...props} placeholder="Select device usage" style={styles.input} mode="outlined" />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    fontSize: 14,
  },
});
