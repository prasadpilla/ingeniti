import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Themes } from '../styles/themes';
import { languageResources } from '../utils/i18next/i18next';
import languagesList from '../utils/i18next/language-list.json';
import Button from './Button';

interface LanguagePickerProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ selectedLanguage, onSelectLanguage }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
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
      <Text style={styles.label}>{t('choose_language')}</Text>
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
          <Text style={styles.modalTitle}>{t('select_language')}</Text>
          <FlatList data={languageData} renderItem={renderItem} keyExtractor={(item) => item} />
          <Button mode="contained" onPress={() => setModalVisible(false)}>
            {t('close')}
          </Button>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'semibold',
    marginBottom: 5,
    marginTop: 10,
  },
  pickerButtonContainer: {
    borderWidth: 1,
    borderColor: Themes.colors.secondaryContainer,
    borderRadius: 5,
    height: 30,
    backgroundColor: Themes.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
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
