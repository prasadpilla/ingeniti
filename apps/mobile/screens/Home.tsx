import i18next from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import LanguagePicker from '../components/LanguagePicker';
import Paragraph from '../components/Paragraph';
import { HomeProps } from '../types';

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18next.changeLanguage(language);
  };

  return (
    <Background>
      <Image
        source={require('../assets/logo.jpeg')}
        style={{ width: 100, height: 100, borderRadius: 10, marginBottom: 20 }}
      />
      <Header>
        <Image source={require('../assets/logo-title.jpeg')} style={{ width: 200, height: 50 }} />
      </Header>
      <Paragraph style={{ marginTop: -20, marginBottom: 20, fontStyle: 'italic' }}>
        {t('tagline')}
      </Paragraph>
      <Button mode="contained" onPress={() => navigation.navigate('Login')}>
        {t('login')}
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate('SignUp')}>
        {t('sign_up')}
      </Button>
      <LanguagePicker selectedLanguage={i18next.language} onSelectLanguage={handleLanguageChange} />
    </Background>
  );
};

export default HomeScreen;
