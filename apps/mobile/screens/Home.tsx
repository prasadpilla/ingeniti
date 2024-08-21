import React from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import { Navigation } from '../types';

interface Props {
  navigation: Navigation;
}

const HomeScreen = ({ navigation }: Props) => (
  <Background>
    <Header>Ingeniti App</Header>

    <Paragraph>Engery grid optimization platform</Paragraph>
    <Button mode="contained" onPress={() => navigation.navigate('Login')}>
      Login
    </Button>
    <Button mode="outlined" onPress={() => navigation.navigate('SignUp')}>
      Sign Up
    </Button>
  </Background>
);

export default HomeScreen;
