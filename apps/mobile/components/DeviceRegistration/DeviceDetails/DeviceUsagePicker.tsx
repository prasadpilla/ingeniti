import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from '../../Button';
import Paragraph from '../../Paragraph';

const deviceUsageOptions = [
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Residential', value: 'residential' },
];

interface DeviceUsagePickerProps {
  selectedUsage: string;
  onSelectUsage: (usage: string) => void;
}

const DeviceUsagePicker: React.FC<DeviceUsagePickerProps> = ({ selectedUsage, onSelectUsage }) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const renderUsageItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: theme.colors.outlineVariant }]}
      onPress={() => {
        onSelectUsage(item.label);
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
            {selectedUsage || 'Select Device Usage'}
          </Paragraph>
          <MaterialIcons name="arrow-drop-down" size={20} color={theme.colors.secondary} />
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <Paragraph style={styles.modalTitle}>Select Device Usage</Paragraph>
          <FlatList data={deviceUsageOptions} renderItem={renderUsageItem} keyExtractor={(item) => item.value} />
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
});

export default DeviceUsagePicker;
