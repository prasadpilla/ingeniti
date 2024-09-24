import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from '../../Button';
import Paragraph from '../../Paragraph';

const deviceTypeOptions = [
  { label: 'Pump/ Motor', value: 'pump_motor' },
  { label: 'Meter', value: 'meter' },
  { label: 'Others', value: 'others' },
];

interface DeviceTypePickerProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

const DeviceTypePicker: React.FC<DeviceTypePickerProps> = ({ selectedType, onSelectType }) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [otherType, setOtherType] = useState('');

  const renderTypeItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: theme.colors.outlineVariant }]}
      onPress={() => {
        if (item.value === 'others') {
          onSelectType(otherType); // Use the text input value for "Others"
        } else {
          onSelectType(item.label);
        }
        setModalVisible(false);
      }}
    >
      <Paragraph>{item.label}</Paragraph>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.pickerButtonContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.secondary,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerButton}>
          <Paragraph style={[styles.pickerButtonText, { color: theme.colors.onSurface }]}>
            {selectedType || 'Select Device Type'}
          </Paragraph>
          <MaterialIcons name="arrow-drop-down" size={20} color={theme.colors.secondary} />
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <Paragraph style={styles.modalTitle}>Select Device Type</Paragraph>
          <FlatList data={deviceTypeOptions} renderItem={renderTypeItem} keyExtractor={(item) => item.value} />
          {selectedType === 'others' && (
            <TextInput
              placeholder="Enter other type"
              value={otherType}
              onChangeText={setOtherType}
              style={styles.input}
            />
          )}
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 10,
  },
});

export default DeviceTypePicker;
