import React from 'react';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { HomeProps } from '../types';

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => (
  <Background>
    <Header>inGeniti</Header>
    <Paragraph>Energy and water optimization platform</Paragraph>
    <Button mode="contained" onPress={() => navigation.navigate('Login')}>
      Login
    </Button>
    <Button mode="outlined" onPress={() => navigation.navigate('SignUp')}>
      Sign Up
    </Button>
  </Background>
);

export default HomeScreen;
