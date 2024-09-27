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
        { backgroundColor: theme.colors.background, shadowColor: theme.colors.shadow },
      ]}
    >
      <TouchableOpacity style={[styles.option, optionStyles]} onPress={onScanCode}>
        <MaterialCommunityIcons name="line-scan" size={18} color={theme.colors.inverseSurface} />
        <Paragraph style={optionTextStyles}>Scan code</Paragraph>
      </TouchableOpacity>
      <View style={styles.separator} />
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    columnGap: 8,
  },

  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
});

export default AddDevicePopover;
