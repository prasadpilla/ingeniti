import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from './Button';
import FormInput from './FormInput';
import Paragraph from './Paragraph';

interface DropdownOption {
  label: string;
  value: string | boolean;
  id: string | number;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string | boolean;
  onSelect: (value: string | boolean) => void;
  placeholder?: string;
  modalStyles?: ViewStyle;
  modalContainerStyles?: ViewStyle;
  modalTitleStyles?: TextStyle;
  itemStyles?: ViewStyle;
  hasError?: boolean;
  errorText?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  modalStyles,
  modalContainerStyles,
  modalTitleStyles,
  itemStyles,
  hasError,
  errorText,
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: DropdownOption }) => (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: theme.colors.outlineVariant }, itemStyles]}
      onPress={() => {
        onSelect(item.value);
        setModalVisible(false);
      }}
    >
      <Paragraph>{item.label}</Paragraph>
    </TouchableOpacity>
  );

  const selectedLabel = options.find((option) => option.value === selectedValue)?.label || placeholder;

  return (
    <View>
      <TouchableOpacity style={[styles.pickerButtonContainer]} onPress={() => setModalVisible(true)}>
        <FormInput
          value={selectedLabel}
          onPressIn={() => setModalVisible(true)}
          label={placeholder}
          mode="outlined"
          editable={false}
          hasError={hasError}
        />
        <MaterialIcons name="arrow-drop-down" size={20} color={theme.colors.secondary} style={styles.icon} />
      </TouchableOpacity>
      {errorText && <Text style={[styles.error, { color: theme.colors.onErrorContainer }]}>{errorText}</Text>}

      <Modal visible={modalVisible} animationType="slide" style={modalStyles}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }, modalContainerStyles]}>
          <Paragraph style={[styles.modalTitle, modalTitleStyles]}>{placeholder}</Paragraph>
          <FlatList data={options} renderItem={renderItem} keyExtractor={(item) => item.id as string} />
          <Button mode="contained" onPress={() => setModalVisible(false)}>
            Close
          </Button>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerButtonContainer: {
    position: 'relative',
  },
  pickerButton: {
    width: '100%',
    backgroundColor: 'red',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  pickerButtonText: {
    fontSize: 16,
    textAlign: 'left',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -5 }],
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 10,
  },
  error: {
    fontSize: 12,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default Dropdown;
