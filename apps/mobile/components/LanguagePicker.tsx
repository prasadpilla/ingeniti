import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Button from './Button';
import Paragraph from './Paragraph';
import { languageResources } from '../utils/i18next/i18next';
import languagesList from '../utils/i18next/language-list.json';

interface LanguagePickerProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ selectedLanguage, onSelectLanguage }) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const renderItem = ({ item }: { item: string }) => {
    const language = languagesList[item as keyof typeof languagesList];

    return (
      <TouchableOpacity
        style={[styles.languageItem, { borderBottomColor: theme.colors.outlineVariant }]}
        onPress={() => {
          onSelectLanguage(language.key);
          setModalVisible(false);
        }}
      >
        <Paragraph style={styles.languageName}>{language.nativeLabel}</Paragraph>
      </TouchableOpacity>
    );
  };

  const languageData = Object.keys(languageResources);

  return (
    <View style={{ alignItems: 'center' }}>
      <Paragraph style={styles.label}>{t('choose_language')}</Paragraph>
      <TouchableOpacity
        style={[
          styles.pickerButtonContainer,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerButton}>
          <Paragraph style={styles.pickerButtonText}>
            {languagesList[selectedLanguage as keyof typeof languagesList].nativeLabel}
          </Paragraph>
          <MaterialIcons name="arrow-drop-down" size={20} color={theme.colors.secondary} />
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <Paragraph style={styles.modalTitle}>{t('select_language')}</Paragraph>
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
    marginTop: 8,
    borderWidth: 1,
    width: 130,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 6,
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
  languageItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  languageName: {
    fontSize: 16,
    textAlign: 'left',
  },
});

export default LanguagePicker;
