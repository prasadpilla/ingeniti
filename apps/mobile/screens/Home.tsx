import React from 'react';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { Navigation } from '../types';

interface Props {
  navigation: Navigation;
}

const HomeScreen = ({ navigation }: Props) => (
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
