import React, { useState } from 'react';
import { Image } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import LanguagePicker from '../components/LanguagePicker';
import Paragraph from '../components/Paragraph';
import { HomeProps } from '../types';

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
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
        Energy and water optimization
      </Paragraph>
      <Button mode="contained" onPress={() => navigation.navigate('Login')}>
        Login
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate('SignUp')}>
        Sign Up
      </Button>
    </Background>
  );
};

export default HomeScreen;
