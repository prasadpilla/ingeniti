import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

import Button from './Button';
import { Themes } from '../styles/themes';
import { countries, CountryData } from '../utils/country-data';

interface CountryCodePickerProps {
  selectedCountry: CountryData;
  onSelectCountry: (country: CountryData) => void;
}

const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  selectedCountry,
  onSelectCountry,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: CountryData }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        onSelectCountry(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.name}</Text>
      <Text style={styles.countryCode}>{item.code}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity style={styles.pickerButtonContainer} onPress={() => setModalVisible(true)}>
        <View style={styles.pickerButton}>
          <Text style={styles.pickerButtonText}>
            {selectedCountry.flag} {selectedCountry.code}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={20} color={Themes.colors.secondary} />
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a country</Text>
          <FlatList data={countries} renderItem={renderItem} keyExtractor={(item) => item.name} />
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
    borderColor: Themes.colors.secondary,
    borderRadius: 5,
    height: 51,
    backgroundColor: Themes.colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4.5,
    paddingHorizontal: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Themes.colors.background,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 10,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
  },
  countryCode: {
    fontSize: 16,
    color: Themes.colors.secondary,
  },
});

export default CountryCodePicker;
