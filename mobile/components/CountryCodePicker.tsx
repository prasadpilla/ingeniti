import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from './Button';
import Paragraph from './Paragraph';
import { countries, CountryData } from '../utils/country-data';

interface CountryCodePickerProps {
  selectedCountry: CountryData;
  onSelectCountry: (country: CountryData) => void;
}

const CountryCodePicker: React.FC<CountryCodePickerProps> = ({ selectedCountry, onSelectCountry }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: CountryData }) => (
    <TouchableOpacity
      style={[styles.countryItem, { borderBottomColor: theme.colors.outlineVariant }]}
      onPress={() => {
        onSelectCountry(item);
        setModalVisible(false);
      }}
    >
      <Paragraph style={styles.countryFlag}>{item.flag}</Paragraph>
      <Paragraph style={styles.countryName}>{item.nativeName}</Paragraph>
      <Paragraph style={[styles.countryCode, { color: theme.colors.secondary }]}>{item.code}</Paragraph>
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
          <Paragraph style={styles.pickerButtonText}>
            {selectedCountry.flag} {selectedCountry.code}
          </Paragraph>
          <MaterialIcons name="arrow-drop-down" size={20} color={theme.colors.secondary} />
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <Paragraph style={styles.modalTitle}>{t('select_a_country')}</Paragraph>
          <FlatList data={countries} renderItem={renderItem} keyExtractor={(item) => item.name} />
          <Button mode="contained" onPress={() => setModalVisible(false)}>
            {t('close')}
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
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 10,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left',
  },
  countryCode: {
    fontSize: 16,
  },
});

export default CountryCodePicker;
