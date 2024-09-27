import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from './Button';
import Paragraph from './Paragraph';

interface DropdownOption {
  label: string;
  value: string;
  id: string | number;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  modalStyles?: ViewStyle;
  pickerButtonStyles?: ViewStyle;
  modalContainerStyles?: ViewStyle;
  modalTitleStyles?: TextStyle;
  itemStyles?: ViewStyle;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  modalStyles,
  pickerButtonStyles,
  modalContainerStyles,
  modalTitleStyles,
  itemStyles,
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

  const selectedLabel =
    options.find((option) => option.value === selectedValue)?.label || placeholder;

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.pickerButtonContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.secondary,
          },
          pickerButtonStyles,
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerButton}>
          <Paragraph style={[styles.pickerButtonText, { color: theme.colors.onSurface }]}>
            {selectedLabel}
          </Paragraph>
          <MaterialIcons name="arrow-drop-down" size={20} color={theme.colors.secondary} />
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" style={modalStyles}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
            modalContainerStyles,
          ]}
        >
          <Paragraph style={[styles.modalTitle, modalTitleStyles]}>{placeholder}</Paragraph>
          <FlatList
            data={options}
            renderItem={renderItem}
            keyExtractor={(item) => item.id as string}
          />
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
    borderWidth: 1,
    borderRadius: 5,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4.5,
    paddingHorizontal: 8,
  },
  pickerButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  pickerButtonText: {
    fontSize: 16,
    textAlign: 'left',
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
});

export default Dropdown;
