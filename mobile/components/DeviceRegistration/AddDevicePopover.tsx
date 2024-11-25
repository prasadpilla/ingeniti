import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Paragraph, useTheme } from 'react-native-paper';

interface AddDevicePopoverProps {
  onScanCode: () => void;
  onEnterCode: () => void;
  containerStyles?: ViewStyle;
  optionStyles?: ViewStyle;
  optionTextStyles?: TextStyle;
}

const AddDevicePopover: React.FC<AddDevicePopoverProps> = ({
  onScanCode,
  onEnterCode,
  containerStyles,
  optionStyles,
  optionTextStyles,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        containerStyles,
        {
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.shadow,
          borderColor: theme.colors.outlineVariant,
          borderWidth: 1,
        },
      ]}
    >
      <TouchableOpacity style={[styles.option, optionStyles]} onPress={onScanCode}>
        <MaterialCommunityIcons name="line-scan" size={18} color={theme.colors.inverseSurface} />
        <Paragraph style={optionTextStyles}>Scan code</Paragraph>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.option, optionStyles]} onPress={onEnterCode}>
        <MaterialCommunityIcons name="pencil-plus-outline" size={18} color={theme.colors.inverseSurface} />
        <Paragraph style={optionTextStyles}>Enter code</Paragraph>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    columnGap: 8,
  },
});

export default AddDevicePopover;
