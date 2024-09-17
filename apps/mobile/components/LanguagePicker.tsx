import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

import Button from './Button';
import { Themes } from '../styles/themes';
import { languageResources } from '../utils/i18next/i18next';
import languagesList from '../utils/i18next/language-list.json';

interface Language {
  key: string;
  label: string;
  nativeLabel: string;
}

interface LanguagePickerProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ selectedLanguage, onSelectLanguage }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: string }) => {
    const language = languagesList[item as keyof typeof languagesList];

    return (
      <TouchableOpacity
        style={styles.languageItem}
        onPress={() => {
          onSelectLanguage(language.key);
          setModalVisible(false);
        }}
      >
        <Text style={styles.languageName}>{language.nativeLabel}</Text>
      </TouchableOpacity>
    );
  };

  const languageData = Object.keys(languageResources);

  return (
    <View>
      <TouchableOpacity style={styles.pickerButtonContainer} onPress={() => setModalVisible(true)}>
        <View style={styles.pickerButton}>
          <Text style={styles.pickerButtonText}>
            {languagesList[selectedLanguage as keyof typeof languagesList].nativeLabel}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={20} color={Themes.colors.secondary} />
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a Language</Text>
          <FlatList data={languageData} renderItem={renderItem} keyExtractor={(item) => item} />
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
  languageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  languageName: {
    fontSize: 16,
  },
});

export default LanguagePicker;
